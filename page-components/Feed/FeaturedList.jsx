import { Spacer } from '@/components/Layout';
import Wrapper from '@/components/Layout/Wrapper';
import { Post } from '@/components/Post';
import { usePostPages } from '@/lib/post';
import styles from './PostList.module.css';
import { Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Masonry from 'react-masonry-component';
import { useEffect, useState } from 'react';
import Router from 'next/router';
import { LoadingDots } from '../../components/LoadingDots';

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
  post: {
    cursor: 'pointer',
    width: '100%',
  },
}));

const FeaturedList = () => {
  const classes = useStyles();

  const { data } = usePostPages();
  const posts = data ? data.reduce((acc, val) => [...acc, ...val.posts], []) : [];

  const randomJam = Math.floor(Math.random() * posts.length);

  const [showList, setShowList] = useState(true);
  useEffect(() => {
    Router.onRouteChangeStart = () => {
      setShowList(false);
    };

    Router.onRouteChangeComplete = () => {
      setShowList(true);
    };
  }, []);

  const handleFeelingLucky = () => {
    const randomPost = posts[randomJam];
    const url = `/user/${randomPost.creator.username}/post/${randomPost._id}`;
    Router.push(url);
  };

  return (
    <div>
      <Spacer axis="vertical" size={1} />
      <Wrapper style={{ display: 'inline' }}>
        {showList && posts[0] ? (
          <>
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
              <Typography>Throwback Jam</Typography>
              <Button variant="outlined" onClick={handleFeelingLucky} className={classes.card}>I'm Feeling Lucky</Button>
            </Grid>
            <Grid
              container
              sx={{ minWidth: '33%' }}
              // style={{ marginBottom: '100px' }}
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
                <Typography>Now Playing</Typography>
                <Post className={styles.post} post={posts[0]} />
              </Grid>
            </Grid>
          </>
        ) : (
          <LoadingDots />
        )}
      </Wrapper>
    </div>
  );
};

export default FeaturedList;
