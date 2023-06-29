import { Spacer } from '@/components/Layout';
import Wrapper from '@/components/Layout/Wrapper';
import { Post } from '@/components/Post';
import { usePostPages } from '@/lib/post';
import styles from './PostList.module.css';
import { Grid, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Masonry from 'react-masonry-component';

const useStyles = makeStyles((theme) => ({
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
    minWidth: '33%',
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
      <Container className={classes.cardGrid}>
        <Wrapper style={{ display: 'inline' }}>
          <Grid
            container
            sx={{ minWidth: '33%' }}
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
              >
                <Post className={styles.post} post={post} />
              </Grid>
            ))}
          </Grid>
        </Wrapper>
      </Container>
    </div>
  );
};

export default PostList;
