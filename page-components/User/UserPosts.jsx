import { Spacer } from '@/components/Layout';
import Wrapper from '@/components/Layout/Wrapper';
import { Post } from '@/components/Post';
import { usePostPages } from '@/lib/post';
import styles from './UserPosts.module.css';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';
import Router from 'next/router';
import { LoadingDots } from '../../components/LoadingDots';
import Masonry from 'react-masonry-component';

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
  root: {
    marginBottom: '100px',
  },
}));

const UserPosts = ({ user }) => {
  const classes = useStyles();
  const { data } = usePostPages({
    author: user._id,
  });
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
      <Wrapper style={{ display: 'inline' }}>
        {showList ? (
          <Grid
            container
            classes={{ root: classes.root }}
            sx={{ minWidth: '33%' }}
            style={{ marginBotton: '100px' }}
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
                <Post className={styles.post} post={post} user={user} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <LoadingDots />
        )}
      </Wrapper>
    </div>
  );
};

export default UserPosts;
