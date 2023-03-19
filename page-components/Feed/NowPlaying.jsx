import { ButtonLink } from '@/components/Button';
import { Container, Spacer, Wrapper } from '@/components/Layout';
import { Post } from '@/components/Post';
import { useLastPost } from '@/lib/post';
import Link from 'next/link';
import styles from './PostList.module.css';

const NowPlaying = () => {
  const { data } = useLastPost();
  const posts = data
    ? data.reduce((acc, val) => [...acc, ...val.posts], [])
    : [];

  return (
    <div className={styles.root}>
      <Spacer axis="vertical" size={1} />
      <Wrapper>
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
        <Container justifyContent="center" className={styles.buttons}>
          <Container>
            <Link passHref href="/feed" legacyBehavior>
              <ButtonLink className={styles.button}>
                Explore NoteClub
              </ButtonLink>
            </Link>
          </Container>
          <Spacer axis="horizontal" size={1} />
        </Container>
      </Wrapper>
    </div>
  );
};

export default NowPlaying;
