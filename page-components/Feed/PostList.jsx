import { Spacer } from '@/components/Layout';
import Wrapper from '@/components/Layout/Wrapper';
import { Post } from '@/components/Post';
import { Search } from '@/components/Search';
import { usePostPages } from '@/lib/post';
import Link from 'next/link';
import styles from './PostList.module.css';
import { Grid, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    // paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(10),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  linkBox: {
    zIndex: '10',
  },
}));

const PostList = () => {
  const classes = useStyles();
  const { data } = usePostPages();
  const posts = data
    ? data.reduce((acc, val) => [...acc, ...val.posts], [])
    : [];

  return (
    <div>
      <Spacer axis="vertical" size={1} />
      <Search posts={posts} />
      <Container className={classes.cardGrid}>
        <Wrapper style={{ display: 'inline' }}>
          <Grid container spacing={4}>
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/user/${post.creator.username}/post/${post._id}`}
                passHref
                legacyBehavior
                className={classes.linkBox}
              >
                <Grid item xs={12} sm={6} md={6}>
                  <Post className={styles.post} post={post} />
                </Grid>
              </Link>
            ))}
          </Grid>
        </Wrapper>
      </Container>
    </div>
  );
};

export default PostList;
