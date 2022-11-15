import clsx from 'clsx';
import Link from 'next/link';
import styles from './Description.module.css';
import Image from 'next/image';

const Description = ({ post, className }) => {
  return (
    <div className={clsx(styles.root, className)}>
      <div className={styles.wrap}>
        <div>
          <p>
            <Link
              href={`https://music.youtube.com/playlist?list=${post.yt}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/icons/Youtube_Music_icon.png"
                alt="YouTube Music Search"
                width="80"
                height="80"
              />
            </Link>
          </p>
          <p className={styles.content}>{post.wikiDesc}</p>
        </div>
      </div>
    </div>
  );
};

export default Description;
