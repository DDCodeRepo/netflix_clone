import { useState } from 'react';
import Image from 'next/image';

import cls from 'classnames';
import { motion } from 'framer-motion';

import styles from './card.module.css';

const Card = (props) => {
    const {imgUrl = "/static/default_movie.avif", size="medium", id} = props;

    const [imgSrc, setImgSrc] = useState(imgUrl);

    const classMap = {
        'large': styles.lgItem,
        'medium': styles.mdItem,
        'small': styles.smItem,
    };

    const handleOnError = () => {
        console.log('hi error');
        setImgSrc('/static/default_movie.avif');
    };

    const scale = id === 0 ? {scaleY: 1.1} : {scale: 1.2};

    return (
        <div className={styles.container}>
            <motion.div 
                className={cls(styles.imageMotionWrapper, classMap[size])} 
                whileHover={{ ...scale }}>
                <Image
                    src={imgSrc}
                    alt='image'
                    layout="fill"
                    onError={handleOnError}
                    className={styles.cardImg}
                />
            </motion.div>
        </div>
    );
};

export default Card;