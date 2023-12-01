import { Spacer } from '@/components/Layout';
import styles from './Feed.module.css';
import Poster from './Poster';
import PostList from './PostList';
import FeaturedList from './FeaturedList';
import NowPlaying from './NowPlaying';

export const Feed = () => {
  return (
    <div className={styles.root}>
      <Spacer size={1} axis="vertical" />
      <Poster />
      <FeaturedList />
      <PostList />
    </div>
  );
};

export const NowPlayingFeed = () => {
  return (
    <div className={styles.root}>
      <Spacer size={1} axis="vertical" />
      {/* <Poster /> */}
      Now Playing
      <NowPlaying />
    </div>
  );
};
