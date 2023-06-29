import { Container } from '@/components/Layout';
import { format } from '@lukeed/ms';
import Link from 'next/link';
import { useMemo } from 'react';
import styles from './Post.module.css';
import React from 'react';
import {
  Avatar,
  Badge,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  IconButton,
  MoreVertIcon,
  Typography,
  Box,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingBottom: theme.spacing(8),
  },
  newcard: {
    maxWidth: 300,
    margin: 'auto',
    '&:hover': {
      boxShadow: '0 16px 70px -12.125px rgba(0,0,0,0.3)',
    },
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
    color: 'var(--accents-6)',
    fontWeight: '500',
    fontSize: '0.875rem',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    '-webkit-line-clamp': '2',
    '-webkit-box-orient': 'vertical',
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  media: {
    paddingTop: '56.25%',
  },
  content: {
    textAlign: 'left',
    padding: theme.spacing.unit * 3,
  },
  divider: {
    margin: `${theme.spacing.unit * 3}px 0`,
  },
  heading: {
    fontWeight: 'bold',
  },
  subheading: {
    lineHeight: 1.8,
    color: 'var(--accents-5)',
  },
  avatar: {
    display: 'inline-block',
    border: '2px solid white',
    '&:not(:first-of-type)': {
      marginLeft: -theme.spacing.unit,
    },
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
      <Card className={classes.newcard}>
        <CardHeader
          // action={
          //   <div>
          //     <Badge badgeContent={'2'} color="secondary">
          //       {' '}
          //     </Badge>
          //     <IconButton aria-label="settings">
          //       <MoreVertIcon />
          //     </IconButton>
          //   </div>
          // }
          title={post.albumTitle}
          subheader={timestampTxt}
        />
        <CardMedia className={classes.media} image={post.albumArt} />
        <CardContent className={classes.content}>
          <Typography
            className={'MuiTypography--heading'}
            variant={'h6'}
            gutterBottom
          >
            {post.albumArtist}
          </Typography>
          <Typography
            className={'MuiTypography--subheading'}
            variant={'caption'}
          >
            {post.theme}
          </Typography>
          <Divider className={classes.divider} dark />
          <Avatar className={classes.avatar} src={post.creator.avatar} />
          <Link href={`/user/${post.creator.username}`}>
            <Typography
              className={'MuiTypography--subheading'}
              variant={'caption'}
            >
              {post.theme}
            </Typography>
          </Link>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Post;
