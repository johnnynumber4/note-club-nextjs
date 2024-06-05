import React, { useEffect, useState } from 'react';
import { Spacer, Wrapper } from '@/components/Layout';
import { Post } from '@/components/Post';
import { usePostPages } from '@/lib/post';
import styles from './PostList.module.css';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Masonry from 'react-masonry-component';
import Router from 'next/router';
import { LoadingDots } from '../../components/LoadingDots';

const useStyles = makeStyles(() => ({
  post: {
    cursor: 'pointer',
    width: '100%',
  },
}));

const FeaturedList = () => {
  const classes = useStyles();
  const { data } = usePostPages();
  const posts = data ? data.reduce((acc, val) => [...acc, ...val.posts], []) : [];
  const [showList, setShowList] = useState(true);

  useEffect(() => {
    const handleRouteChangeStart = () => setShowList(false);
    const handleRouteChangeComplete = () => setShowList(true);

    Router.events.on('routeChangeStart', handleRouteChangeStart);
    Router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      Router.events.off('routeChangeStart', handleRouteChangeStart);
      Router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, []);

  return (
    <div>
      <Spacer axis="vertical" size={1} />
      <Wrapper style={{ display: 'inline' }}>
        {showList && posts[0] ? (
          <Grid
            container
            sx={{ minWidth: '33%' }}
            spacing={2}
            component={Masonry}
          >
            <Grid
              className={classes.post}
              key={posts[0]._id}
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            >
              <Post className={styles.post} post={posts[0]} />
            </Grid>
          </Grid>
        ) : (
          <LoadingDots />
        )}
      </Wrapper>
    </div>
  );
};

export default FeaturedList;
