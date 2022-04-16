import videoTestData from '../data/videos.json';
import { YOUTUBE_API_KEY, BASE_URL} from './url-const';

export const getYoutubeVideoById = (videoId) => {
    const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`; 
    return getCommonVideos(URL);
};

const fetchVideos = async (url) => {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    const BASE_URL = "youtube.googleapis.com/youtube/v3";
  
    const response = await fetch(`https://${BASE_URL}/${url}&maxResults=25&key=${YOUTUBE_API_KEY}`);
  
    return await response.json();
};

export const getCommonVideos = async (url) => {
    try {
      const isDev = process.env.DEVELOPMENT;
      const data = isDev ? videoTestData : await fetchVideos(url);
      if (data?.error) {
        console.error("Youtube API error", data.error);
        return [];
      }
  
      return data?.items.map((item) => {
        const id = item.id?.videoId || item.id;
        const snippet = item.snippet;
        return {
          title: snippet?.title,
          imgUrl: snippet.thumbnails.high.url,
          id,
          description: snippet.description,
          publishTime: snippet.publishedAt,
          channelTitle: snippet.channelTitle,
          statistics: item.statistics ? item.statistics : { viewCount: 0 },
        };
      });
    } catch (error) {
      console.error("Something went wrong with video library", error);
      return [];
    }
  };

export const getVideos = (searchQuery) => {
    const YOUTUBE_URL= BASE_URL + `search?part=snippet&maxResults=25&q=${searchQuery}&key=${YOUTUBE_API_KEY}`;
    return getCommonVideos(YOUTUBE_URL);
}

export const getPopularVideos = () => {
    const YOUTUBE_POPULAR_URL= BASE_URL + `videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=25&regionCode=US&key=${YOUTUBE_API_KEY}`;
    return getCommonVideos(YOUTUBE_POPULAR_URL);
}

export const getWatchItAgainVideos = async (userId, token) => {
  const videos = await getWatchedVideos(userId, token);
  return videos?.map((video) => {
    return {
      id: video.videoId,
      imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
    };
  }) || [];
};

export const getMyList = async (userId, token) => {
  const videos = await getMyListVideos(userId, token);
  return videos?.map((video) => {
    return {
      id: video.videoId,
      imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
    };
  }) || [];
};