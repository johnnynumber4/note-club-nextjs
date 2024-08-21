import { Avatar } from '@/components/Avatar';
import { Container } from '@/components/Layout';
import { format } from '@lukeed/ms';
import clsx from 'clsx';
import Link from 'next/link';
import { useMemo } from 'react';
import styles from './Comment.module.css';

const Comment = ({ comment, className }) => {
  const timestampTxt = useMemo(() => {
    const diff = Date.now() - new Date(comment.createdAt).getTime();
    if (diff < 1 * 60 * 1000) return 'Just now';
    return `${format(diff, true)} ago`;
  }, [comment.createdAt]);

  // Default values for cases where data might be missing
  const { username, profilePicture, name } = comment.creator || {};
  const avatarUrl = profilePicture || '/default-avatar.png'; // Default avatar if none provided

  return (
    <div className={clsx(styles.root, className)}>
      <Link href={`/user/${username || 'default'}`}>
        <Container className={styles.creator}>
          <Avatar
            size={36}
            url={avatarUrl}
            username={username}
            alt={username ? `${username}'s avatar` : 'User avatar'}
          />
          <Container column className={styles.meta}>
            <p className={styles.name}>{name || 'Anonymous'}</p>
            <p className={styles.username}>{username || 'unknown'}</p>
          </Container>
        </Container>
      </Link>
      <div className={styles.wrap}>
        <p className={styles.content}>
          {comment.content || 'No content available'}
        </p>
      </div>
      <div className={styles.wrap}>
        <time dateTime={String(comment.createdAt)} className={styles.timestamp}>
          {timestampTxt}
        </time>
      </div>
    </div>
  );
};

export default Comment;
