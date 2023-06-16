// import { Avatar } from '@/components/Avatar';
import { Container } from '@/components/Layout';
import { format } from '@lukeed/ms';
import Link from 'next/link';
import { useMemo } from 'react';
import styles from './Post.module.css';
import React from 'react';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Box,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    color: 'unset',
    backgroundColor: 'unset',
    boxShadow: 'var(--shadow-smallest)',
    borderRadius: '8px',
    transition: 'ease 0.2s box-shadow',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
    textAlign: 'center',
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const Post = ({ post }) => {
  const classes = useStyles();
  const timestampTxt = useMemo(() => {
    const diff = Date.now() - new Date(post.createdAt).getTime();
    if (diff < 1 * 60 * 1000) return 'Just now';
    return `${format(diff, true)} ago`;
  }, [post.createdAt]);
  return (
    <Box>
      <Card className={classes.card}>
        <Link
          key={post._id}
          href={`/user/${post.creator.username}/post/${post._id}`}
          passHref
          legacyBehavior
        >
          <Box>
            <CardMedia
              className={classes.cardMedia}
              image={`${post.albumArt}`}
              title={`${post.albumArt}`}
            />
            <CardContent className={classes.cardContent}>
              <Typography gutterBottom variant="h5" component="h2">
                {post.albumTitle}
              </Typography>
              <Typography>{post.albumArtist}</Typography>
              <Grid item xs={12}>
                <Typography style={{ color: 'lime' }}>{post.theme}</Typography>
              </Grid>
            </CardContent>
          </Box>
        </Link>
        <CardActions>
          <Grid item xs={8}>
            <Container>
              <Container column className={styles.meta}>
                <Link href={`/user/${post.creator.username}`}>
                  <Typography className={styles.name}>
                    {post.creator.username}
                  </Typography>
                </Link>
              </Container>
            </Container>
          </Grid>
          <Grid item xs={4}>
            <time
              dateTime={String(post.createdAt)}
              className={styles.timestamp}
            >
              {timestampTxt}
            </time>
          </Grid>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Post;
