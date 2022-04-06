import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { getYoutubeVideoById } from "../../lib/video";

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

    //data to fetch from API
    const { title, publishTime, description, channelTitle, viewCount} = video;

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
                src={`http://www.youtube.com/embed/${router.query.videoId}?enablejsapi=1&origin=http://example.com&controls=0&rel=1`}
                frameborder="0"
            />
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