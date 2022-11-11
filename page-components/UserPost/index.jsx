import { Spacer, Wrapper } from '@/components/Layout';
import { Post as PostItem } from '@/components/Post';
import Commenter from './Commenter';
import CommentList from './CommentList';
import styles from './UserPost.module.css';
import Image from 'next/Image';

export const UserPost = ({ post }) => {
  return (
    <Wrapper>
      <Spacer size={2} axis="vertical" />
      <PostItem post={post} />
      {post.yt && (
        <div>
          <p>Listen Now:</p>
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
      <p className={styles.content}>{post.wikiDesc}</p>
      <h3 className={styles.subtitle}>Comments</h3>
      <Commenter post={post} />
      <CommentList post={post} />
    </Wrapper>
  );
};
