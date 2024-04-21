import React, { useState } from 'react';
import { Spacer } from '@/components/Layout';
// import styles from './Feed.module.css';
import Poster from './Poster';
import PostList from './PostList';
import FeaturedList from './FeaturedList';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Wrapper } from '@/components/Layout';
import styles from './Poster.module.css';

const useStyles = makeStyles(() => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    color: 'unset',
    backgroundColor: 'unset',
    boxShadow: 'var(--shadow-smallest)',
    borderRadius: '8px',
    transition: 'ease 0.2s box-shadow',
  },
}));

export const Feed = () => {
  const classes = useStyles();
  const [activeView, setActiveView] = useState('featured');
  const handleViewChange = (view) => {
    setActiveView(view);
  };

  return (
    <div>
      <Spacer size={1} axis="vertical" />
      <Poster />

      <div style={{ margin: '30px' }}>
        <Container className={styles.poster}>
          <div>
            <Button
              variant="outlined"
              onClick={() => handleViewChange('featured')}
              className={classes.card}
            >
              Now Playing
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleViewChange('archives')}
              className={classes.card}
            >
              The Archives
            </Button>
          </div>
        </Container>
      </div>
      {activeView === 'featured' && <FeaturedList />}
      {activeView === 'archives' && <PostList />}
    </div>
  );
};
