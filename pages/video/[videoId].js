import { useState } from 'react';

import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { getYoutubeVideoById } from "../../lib/video";

import Like from '../../components/icons/like-icon';
import DisLike from '../../components/icons/dislike-icon';

import styles from '../../styles/Video.module.css';
import Modal from 'react-modal';

import clsx from 'classnames';

Modal.setAppElement('#__next');


export async function getStaticProps(context) {
    const videoId = context.params.videoId;
    const videoArray = await getYoutubeVideoById(videoId);
  
    return {
      props: {
        video: videoArray.length > 0 ? videoArray[0] : {},
      },
      revalidate: 10, // In seconds
    };
  }

export async function getStaticPaths() {

    const listOfVideos = ["mYfJxlgR2jw", "4zH5iYM4wJo", "KCPEHsAViiQ"];
    const paths = listOfVideos.map((videoId) => ({ params: { videoId }, }));
  
    return { paths, fallback: "blocking" };
}

const Video = ({ video }) => {

    const router = useRouter();
    const videoId = router.query.videoId;

    const [ toggleLike, setToggleLike ] = useState(false);
    const [ toggleDisLike, setToggleDisLike ] = useState(false);

    //data to fetch from API
    const { title, publishTime, description, channelTitle, viewCount } = video;

    useEffect(async () => {
        const response = await fetch(`/api/stats?videoId=${videoId}`, {
          method: "GET",
        });
        const data = await response.json();
    
        if (data.length > 0) {
          const favourited = data[0].favourited;
          if (favourited === 1) {
            setToggleLike(true);
          } else if (favourited === 0) {
            setToggleDisLike(true);
          }
        }
      }, []);

    const runRatingService = async (favourited) => {
        return await fetch("/api/stats", {
            method: "POST",
            body: JSON.stringify({
                videoId,
                favourited: val ? 1 : 0,
            }),
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const handleToggleDislike = () => {
        console.log('handleToggleDislike');
        const val = !toggleDisLike;
        setToggleDisLike(true);
        setToggleLike(false);

        const favourited = val ? 1 : 0;
        const response = await runRatingService(favourited);
    }

    const handleToggleLike = () => {
        console.log('handleToggleLike');
        const val = !toggleLike;

        setToggleLike(true);
        setToggleDisLike(false);

        const favourited = val ? 0 : 1;
        const response = await runRatingService(favourited);
    }

    return (
        <div className={styles.container}>
            <Modal
                isOpen={true}
                contentLabel="Watch the video"
                onRequestClose={() => router.back()}
                className={styles.modal}
                overlayClassName={styles.overlay}
            >
            <iframe 
                id="player"
                className={styles.videoPlayer}
                type="text/html"
                width="100%"
                height="390"
                src={`http://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=http://example.com&controls=0&rel=1`}
                frameborder="0"
            />

            <div className={styles.likeDislikeBtnWrapper}>
                <div className={styles.likeBtnWrapper}>
                    <button onClick={handleToggleLike}>
                        <div className={styles.btnWrapper}>
                            <Like selected={toggleLike} />
                        </div>
                    </button>
                </div>
                <div>
                    <div className={styles.likeBtnWrapper}>
                        <button onClick={handleToggleDislike}>
                            <div className={styles.btnWrapper}>
                                <DisLike selected={toggleDisLike} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            <div className={styles.modalBody}>
                <div className={styles.modalBodyContent}>
                    <div className={styles.col1}>
                        <p className={styles.publishTime}>{publishTime}</p>
                        <p className={styles.title}>{title}</p>
                        <p className={styles.description}>{description}</p>
                    </div>
                    <div className={styles.col2}>
                        <p className={clsx(styles.subText, styles.subTextWrapper)}>
                            <span className={styles.textColor}>Cast: </span>
                            <span className={styles.channelTitle}>{channelTitle}</span>
                        </p>
                        <p className={clsx(styles.subText, styles.subTextWrapper)}>
                            <span className={styles.textColor}>View Count: </span>
                            <span className={styles.channelTitle}>{viewCount}</span>
                        </p>
                    </div>
                </div>
            </div>
            </Modal>
        </div>
    );
};

export default Video;