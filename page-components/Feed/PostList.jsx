import { Spacer } from '@/components/Layout';
import Wrapper from '@/components/Layout/Wrapper';
import { Post } from '@/components/Post';
import { usePostPages } from '@/lib/post';
import styles from './PostList.module.css';
import { Grid } from '@material-ui/core';
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

const PostList = () => {
  const classes = useStyles();
  const { data } = usePostPages();
  const posts = data
    ? data.reduce((acc, val) => [...acc, ...val.posts], [])
    : [];
  const [showList, setShowList] = useState(true);
  useEffect(() => {
    Router.onRouteChangeStart = () => {
      setShowList(false);
    };

    Router.onRouteChangeComplete = () => {
      setShowList(true);
    };
  }, []);

  return (
    <div>
      <Spacer axis="vertical" size={1} />
      {showList ? (
        <Wrapper style={{ display: 'inline' }}>
          <Grid
            container
            sx={{ minWidth: '33%' }}
            style={{ marginBottom: '100px' }}
            spacing={2}
            component={Masonry}
          >
            {posts.map((post) => (
              <Grid
                className={classes.post}
                key={post._id}
                item
                xs={12}
                sm={6}
                md={4}
                lg={4}
                xl={3}
              >
                <Post className={styles.post} post={post} />
              </Grid>
            ))}
          </Grid>
        </Wrapper>
      ) : (
        <LoadingDots />
      )}
    </div>
  );
};

export default PostList;
