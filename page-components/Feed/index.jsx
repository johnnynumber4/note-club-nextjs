import React, { useState } from 'react';
import { Spacer } from '@/components/Layout';
import Poster from './Poster';
import PostList from './PostList';
import FeaturedList from './FeaturedList';
import Link from 'next/link';
import { Container, Wrapper } from '@/components/Layout';
import styles from './Poster.module.css';

export const Feed = () => {
  const [activeView, setActiveView] = useState('featured');
  const handleViewChange = (view) => {
    setActiveView(view);
  };

  return (
    <div>
      <Spacer size={1} axis="vertical" />
      <Poster />
      <Spacer size={1} axis="vertical" />
      <Wrapper>
        <div className={styles.root}>
          <div>
            <Container className={styles.poster}>
              <div>
                <Link href="#">
                  <a className={styles.link} onClick={() => handleViewChange('featured')}>
                    Now Playing
                  </a>
                </Link>
                <Link href="#">
                  <a className={styles.link} onClick={() => handleViewChange('archives')}>
                    The Archives
                  </a>
                </Link>
              </div>
            </Container>
          </div>
        </div>
      </Wrapper>
      <Spacer size={1} axis="vertical" />
      {activeView === 'featured' && <FeaturedList />}
      {activeView === 'archives' && <PostList />}
    </div>
  );
};