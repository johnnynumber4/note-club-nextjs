import { Typography } from '@material-ui/core';
import styles from './Description.module.css';

const Description = ({ post }) => {
  return (
    <div>
      <Typography className={styles.content}>{post.wikiDesc}</Typography>
    </div>
  );
};

export default Description;
