import Head from 'next/head';
import styles from './Layout.module.css';
import Nav from './Nav';

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Note Club</title>
        <meta
          key="viewport"
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta
          name="description"
          content="We like to listen to music and share our thoughts on the albums we select.  No matter how bad or good, they will live forever in this repo."
        />
        <meta property="og:title" content="Note Club" />
        <meta
          property="og:description"
          content="We like to listen to music and share our thoughts on the albums we select.  No matter how bad or good, they will live forever in this repo."
        />
        <meta
          property="og:image"
          content="https://cdns-images.dzcdn.net/images/artist/238f5524a401dfdd5cac685f0f7989bd/500x500.jpg"
        />
      </Head>
      <Nav />
      <main className={styles.main}>{children}</main>
    </>
  );
};

export default Layout;
