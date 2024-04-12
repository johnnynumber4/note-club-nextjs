import { Typography } from '@mui/material';
import styles from './Description.module.css';

const Description = ({ post }) => {
  return (
    <div>
      <Typography className={styles.content}>{post.wikiDesc}</Typography>
    </div>
  );
};

export default Description;
