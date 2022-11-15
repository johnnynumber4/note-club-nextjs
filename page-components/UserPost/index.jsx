import { Description } from '@/components/Description';
import { Spacer, Wrapper } from '@/components/Layout';
import { Post as PostItem } from '@/components/Post';
import Commenter from './Commenter';
import CommentList from './CommentList';
import styles from './UserPost.module.css';
import Image from 'next/image';

export const UserPost = ({ post }) => {
  return (
    <Wrapper>
      <Spacer size={2} axis="vertical" />
      <PostItem post={post} />
      <h3 className={styles.subtitle}>Listen Now:</h3>
      {post.yt && (
        <div>
          <p>
            <a
              href={`https://music.youtube.com/playlist?list=${post.yt}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ zIndex: 99 }}
            >
              <Image
                src="/icons/Youtube_Music_icon.png"
                alt="YouTube Music Search"
                width="80"
                height="80"
              />
            </a>
          </p>
        </div>
      )}
      <h3 className={styles.subtitle}>About the Album:</h3>
      <Description post={post} />
      <h3 className={styles.subtitle}>Comments</h3>
      <Commenter post={post} />
      <CommentList post={post} />
    </Wrapper>
  );
};
