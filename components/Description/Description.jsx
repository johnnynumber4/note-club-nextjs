import clsx from 'clsx';
import styles from './Description.module.css';

const Description = ({ post, className }) => {
  return (
    <div className={clsx(styles.root, className)}>
      <div className={styles.wrap}>
        <div>
          <p className={styles.content}>{post.wikiDesc}</p>
        </div>
      </div>
    </div>
  );
};

export default Description;
