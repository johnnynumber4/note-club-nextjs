import clsx from 'clsx';
import styles from './ListenLinks.module.css';
import Image from 'next/image';

const ListenLinks = ({ post, className }) => {
  return (
    <div className={clsx(styles.root, className)}>
      <div className={styles.wrap}>
        <div>
          <p style={{ textAlign: 'center' }}>
            <a
              href={`https://music.youtube.com/playlist?list=${post.yt}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ zIndex: 99, margin: '0 20px 0 20px' }}
            >
              <Image
                src="/icons/Youtube_Music_icon.png"
                alt="YouTube Music Search"
                width="80"
                height="80"
              />
            </a>
            <a
              href={`https://listen.tidal.com/search/albums?q=${post.albumArtist}%20${post.albumTitle}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ zIndex: 99, margin: '0 20px 0 20px' }}
            >
              <Image
                src="/icons/Tidal_Music_Icon.png"
                alt="Tidal Music Search"
                width="80"
                height="80"
              />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ListenLinks;
