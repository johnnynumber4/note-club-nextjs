import React, { useState, useEffect } from 'react';
import { Spacer, Container } from '@/components/Layout';
import { BlockContainer } from '@/components/Layout/BlockContainer';
import Poster from './Poster';
import PostList from './PostList';
import FeaturedList from './FeaturedList';
import Link from 'next/link';
import { usePostPages } from '@/lib/post';
import Router from 'next/router';
import { useCurrentUser } from '@/lib/user/hooks';
import styles from './Poster.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCompactDisc,
  faBook,
  faClover,
} from '@fortawesome/free-solid-svg-icons';

export const Feed = () => {
  const { data: user } = useCurrentUser();
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
    const url = `/user/${randomPost.creator.username}/post/${randomPost._id}`;
    Router.push(url);
  };

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        console.log(
          'Service Worker registered with scope:',
          registration.scope
        );
      });

      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        }
      });
    }
  }, []);

  if (!user?.user) {
    return (
      <div className={styles.welcomePage}>
        <BlockContainer>
          <h1 className={styles.welcomeTitle}>
            Welcome to <span className={styles.brandName}>NoteClub</span>
          </h1>
          <p className={styles.welcomeSubtitle}>
            Join the community, share your thoughts, and explore amazing posts!
          </p>
          <Link href="/login">
            <a className={styles.loginButton}>Login to Get Started</a>
          </Link>
        </BlockContainer>
      </div>
    );
  }

  return (
    <div>
      <Spacer size={1} axis="vertical" />
      <Poster />
      <Spacer size={1} axis="vertical" />
      <div>
        <Container>
          <nav className={styles.navContainer}>
            <div className={styles.linkContainer}>
              <Link href="#">
                <a
                  className={`${styles.link} ${
                    activeView === 'featured' ? styles.activeLink : ''
                  }`}
                  onClick={() => handleViewChange('featured')}
                >
                  <FontAwesomeIcon icon={faCompactDisc} />{' '}
                  {/* CD/Record Icon */}
                </a>
              </Link>
              <Link href="#">
                <a
                  className={`${styles.link} ${
                    activeView === 'archives' ? styles.activeLink : ''
                  }`}
                  onClick={() => handleViewChange('archives')}
                >
                  <FontAwesomeIcon icon={faBook} /> {/* Books Icon */}
                </a>
              </Link>
              <Link href="#">
                <a className={styles.link} onClick={handleFeelingLucky}>
                  <FontAwesomeIcon icon={faClover} /> {/* Shamrock Icon */}
                </a>
              </Link>
            </div>
          </nav>
        </Container>
      </div>
      <Spacer size={1} axis="vertical" />
      {activeView === 'featured' && <FeaturedList />}
      {activeView === 'archives' && <PostList />}
    </div>
  );
};
