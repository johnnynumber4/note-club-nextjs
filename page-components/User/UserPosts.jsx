// import { Button } from '@/components/Button';
import {
  // Container,
  Spacer,
} from '@/components/Layout';
import Wrapper from '@/components/Layout/Wrapper';
import { Post } from '@/components/Post';
// import { Text } from '@/components/Text';
import { usePostPages } from '@/lib/post';
import Link from 'next/link';
import styles from './UserPosts.module.css';
import { Box } from '@material-ui/core';

const UserPosts = ({ user }) => {
  const {
    data,
    //  size, setSize, isLoadingMore, isReachingEnd
  } = usePostPages({
    author: user._id,
  });
  const posts = data
    ? data.reduce((acc, val) => [...acc, ...val.posts], [])
    : [];

  return (
    <div className={styles.root}>
      <Spacer axis="vertical" size={1} />
      <Wrapper>
        {posts.map((post) => (
          <Box style={{ marginBottom: '10px' }} key={post._id}>
            <Link
              key={post._id}
              href={`/user/${post.creator.username}/post/${post._id}`}
              className={styles.wrap}
              style={{
                background: `url(${post.albumArt}) no-repeat center center;`,
              }}
            >
              <Post
                className={styles.post}
                post={post}
                style={{
                  background: `url(${post.albumArt}) no-repeat center center;`,
                }}
              />
            </Link>
          </Box>
        ))}
        {/* <Container justifyContent="center">
          {isReachingEnd ? (
            <Text color="secondary">No more posts are found</Text>
          ) : (
            <Button
              variant="ghost"
              type="success"
              loading={isLoadingMore}
              onClick={() => setSize(size + 1)}
            >
              Load more
            </Button>
          )}
        </Container> */}
      </Wrapper>
    </div>
  );
};

export default UserPosts;
