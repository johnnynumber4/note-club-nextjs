import React, { useState } from 'react';
import { Spacer, Container, Wrapper } from '@/components/Layout';
import Poster from './Poster';
import PostList from './PostList';
import FeaturedList from './FeaturedList';
import Link from 'next/link';
import { usePostPages } from '@/lib/post';
import Router from 'next/router';
import styles from './Poster.module.css';

export const Feed = () => {
  const { data } = usePostPages();
  const posts = data
    ? data.reduce((acc, val) => [...acc, ...val.posts], [])
    : [];

  const [activeView, setActiveView] = useState('featured');

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const handleFeelingLucky = () => {
    const randomIndex = Math.floor(Math.random() * posts.length);
    const randomPost = posts[randomIndex];
    const url = `/user/${randomPost.author}/post/${randomPost._id}`;
    Router.push(url);
  };

  return (
    <div>
      <Spacer size={1} axis="vertical" />
      <Poster />
      <Spacer size={1} axis="vertical" />
      <Wrapper>
        <div className={styles.root}>
          <Container className={styles.poster}>
            <nav className={styles.navContainer}>
              <div className={styles.linkContainer}>
                <Link href="#">
                  <a
                    className={styles.link}
                    onClick={() => handleViewChange('featured')}
                  >
                    Now Playing
                  </a>
                </Link>
                <Link href="#">
                  <a
                    className={styles.link}
                    onClick={() => handleViewChange('archives')}
                  >
                    The Archives
                  </a>
                </Link>
                <Link href="#">
                  <a className={styles.link} onClick={handleFeelingLucky}>
                    I&apos;m Feeling Lucky
                  </a>
                </Link>
              </div>
            </nav>
          </Container>
        </div>
      </Wrapper>
      <Spacer size={1} axis="vertical" />
      {activeView === 'featured' && <FeaturedList />}
      {activeView === 'archives' && <PostList />}
    </div>
  );
};
