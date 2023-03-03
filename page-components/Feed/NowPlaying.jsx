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
        <Link
          key={posts[0]._id}
          href={`/user/${posts[0].creator.username}/post/${posts[0]._id}`}
          passHref
          legacyBehavior
        >
          <div className={styles.wrap}>
            <Post className={styles.post} post={posts[0]} />
          </div>
        </Link>
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
