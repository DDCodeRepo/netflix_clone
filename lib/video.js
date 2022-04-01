import videoData from '../data/videos.json';
import { YOUTUBE_API_KEY, BASE_URL} from './url-const';

export const getCommonVideos = async (URL) => {

    try {
        const response = await fetch(URL);
        const data = await response.json();

        if (data?.error){
            console.error("Youtube API error", data.error);
            return [];
        }
    
        return data?.items.map((item)=> {
            const id = item.id?.videoId || item.id;
            return {
                title: item.snippet.title,
                imgUrl: item.snippet.thumbnails.high.url,
                id,
            };
        });
    } catch (err) {
        console.error('Something went wrong with the video library', err);
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
