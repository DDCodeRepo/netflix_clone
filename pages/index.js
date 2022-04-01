import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

import NavBar from '../components/nav/navbar';
import Banner from "../components/banner/banner";
import Card from '../components/card/card';

import SectionCards from '../components/card/section-cards';

import { getPopularVideos, getVideos } from '../lib/video';

export async function getServerSideProps(){
  const disneyVideos = await getVideos("disney trailer");
  const productivityVideos = await getVideos("productivity trailer");
  const travelVideos = await getVideos("travel trailer");
  const popularVideos = await getPopularVideos();


  return { props: { disneyVideos, travelVideos, productivityVideos, popularVideos } };
}

export default function Home({ disneyVideos, travelVideos, productivityVideos, popularVideos }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className={styles.main}>
        <NavBar username="debjit@dd.com"/>
        <Banner 
          title='Clifford the red dog'
          subTitle='A very cute dog' 
          imgUrl='/static/clifford.webp'
        />

        <div className={styles.sectionWrapper}>
          <SectionCards title="Disney" videos={disneyVideos} size="large"/>
          <SectionCards title="Travel" videos={travelVideos} size="small"/>
          <SectionCards title="Productivity" videos={productivityVideos} size="medium"/>
          <SectionCards title="Popular" videos={popularVideos} size="small"/>
        </div>
      </div>
    </div>
  );
}
