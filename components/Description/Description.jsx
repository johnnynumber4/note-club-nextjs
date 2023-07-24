import { Typography } from '@material-ui/core';
import clsx from 'clsx';
import styles from './Description.module.css';

const Description = ({ post, className }) => {
  return (
    <div className={clsx(styles.root, className)}>
      <div className={styles.wrap}>
        <div>
          <Typography className={styles.content}>{post.wikiDesc}</Typography>
        </div>
      </div>
    </div>
  );
};

export default Description;
