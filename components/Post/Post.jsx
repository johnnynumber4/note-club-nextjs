import { Avatar } from '@/components/Avatar';
import { Container } from '@/components/Layout';
import { format } from '@lukeed/ms';
import { Box } from '@mui/material';
import clsx from 'clsx';
import Link from 'next/link';
import { useMemo } from 'react';
import styles from './Post.module.css';
// import Image from 'next/image';

const Post = ({ post, className }) => {
  const timestampTxt = useMemo(() => {
    const diff = Date.now() - new Date(post.createdAt).getTime();
    if (diff < 1 * 60 * 1000) return 'Just now';
    return `${format(diff, true)} ago`;
  }, [post.createdAt]);
  return (
    <Box
      className={clsx(styles.root, className)}
      style={{ backgroundImage: `url(${post.albumArt})` }}
    >
      <Box className={styles.contentBox}>
        <Link href={`/user/${post.creator.username}`}>
          <Container className={styles.creator}>
            <Avatar
              size={36}
              url={post.creator.profilePicture}
              username={post.creator.username}
            />
            <Container column className={styles.meta}>
              <p className={styles.name}>{post.creator.name}</p>
              <p className={styles.username}>{post.creator.username}</p>
            </Container>
          </Container>
        </Link>
        <div className={styles.wrap}>
          <p className={styles.content}>{post.albumArtist}</p>
          <p className={styles.content}>{post.albumTitle}</p>
          <p className={styles.pill}>{post.theme}</p>
        </div>
        <div className={styles.wrap}>
          <time dateTime={String(post.createdAt)} className={styles.timestamp}>
            {timestampTxt}
          </time>
        </div>
      </Box>
    </Box>
  );
};

export default Post;
