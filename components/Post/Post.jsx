import { format } from '@lukeed/ms';
import Link from 'next/link';
import { useMemo } from 'react';
import React from 'react';
import {
  Avatar,
  // Badge,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  // IconButton,
  Typography,
  Box,
} from '@material-ui/core';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from '@material-ui/core/styles';
import Image from 'next/image';

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingBottom: theme.spacing(8),
  },
  card: {
    width: '100%',
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
  pill: {
    border: 'none',
    color: 'var(--pill-accent)',
  },
  content: {
    padding: '8px',
    paddingBottom: 'unset !important',
  },
  divider: {
    margin: `${theme.spacing(3)}px 0`,
    color: 'var(--accents-5)',
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
      marginLeft: -theme.spacing(1),
    },
  },
  cardRoot: {
    justifyContent: 'space-between',
  },
  cardHeaderRoot: {
    padding: '8px !important',
  },
  timestamp: {
    fontSize: '0.875rem',
    fontWeight: '400',
    lineHeight: '1.25rem',
    margin: '0',
    color: 'var(--accents-5)',
  },
}));

const Post = ({ post, user }) => {
  const classes = useStyles();
  const profilePic = user ? user.profilePicture : null;
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
              classes={{ root: classes.cardHeaderRoot }}
              title={post.albumTitle}
              subheader={timestampTxt}
              subheaderTypographyProps={{ color: 'var(--accents-5)' }}
            />
            <CardMedia className={classes.media} image={post.albumArt} />
            <CardContent classes={{ root: classes.content }}>
              <Typography
                className={'MuiTypography--heading'}
                variant={'h6'}
                gutterBottom
              >
                {post.albumArtist}
              </Typography>
              <Typography className={classes.pill} variant={'caption'}>
                {post.theme}
              </Typography>
              <Divider className={classes.divider} />
            </CardContent>
          </Box>
        </Link>
        <CardActions classes={{ root: classes.cardRoot }}>
          {profilePic && <Avatar className={classes.avatar} src={profilePic} />}
          <Link href={`/user/${post.creator.username}`}>
            <Typography
              className={'MuiTypography--subheading'}
              variant={'caption'}
            >
              {post.creator.username}
            </Typography>
          </Link>
          <a
            href={`https://music.youtube.com/playlist?list=${post.yt}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textAlign: 'right' }}
          >
            <Image
              src="/icons/Youtube_Music_icon.png"
              alt="YouTube Music Search"
              width="30vw"
              height="30vh"
            />
          </a>
          <a
            href={`https://listen.tidal.com/search/albums?q=${post.albumArtist}%20${post.albumTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textAlign: 'right' }}
          >
            <Image
              src="/icons/Tidal_Music_Icon.png"
              alt="Tidal Music Search"
              width="30vw"
              height="30vh"
            />
          </a>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Post;
