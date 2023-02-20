import { Spacer } from '@/components/Layout';
import Wrapper from '@/components/Layout/Wrapper';
import { Post } from '@/components/Post';
import { Search } from '@/components/Search';
import { usePostPages } from '@/lib/post';
import Link from 'next/link';
import styles from './PostList.module.css';

const PostList = () => {
  const { data } = usePostPages();
  const posts = data
    ? data.reduce((acc, val) => [...acc, ...val.posts], [])
    : [];

  return (
    <div className={styles.root}>
      <Spacer axis="vertical" size={1} />
      <Wrapper style={{ display: 'inline' }}>
        <Search posts={posts} />
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/user/${post.creator.username}/post/${post._id}`}
            passHref
            legacyBehavior
          >
            <div className={styles.wrap}>
              <Post className={styles.post} post={post} />
            </div>
          </Link>
        ))}
      </Wrapper>
    </div>
  );
};

export default PostList;
