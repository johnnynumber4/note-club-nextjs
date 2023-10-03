import { Spacer, Wrapper } from '@/components/Layout';
import { Post as PostItem } from '@/components/Post';
import Commenter from './Commenter';
import CommentList from './CommentList';
import ListenLinks from '@/components/ListenLinks/ListenLinks';
import { Grid } from '@material-ui/core';
import Masonry from 'react-masonry-component';
import { makeStyles } from '@material-ui/core/styles';
import { searchSpotifyAlbum } from '../../api-lib/spotify';

const useStyles = makeStyles(() => ({
  post: {
    cursor: 'pointer',
    width: '100%',
  },
}));

export const UserPost = ({ post }) => {
  const classes = useStyles();
  return (
    <Wrapper>
      <Spacer size={2} axis="vertical" />
      <Grid container spacing={2} component={Masonry}>
        <Grid item className={classes.post} xs={12} sm={6}>
          <PostItem post={post} />
        </Grid>
        <Grid item className={classes.post} xs={12} sm={6}>
          <ListenLinks post={post} />
        </Grid>
        <Grid item className={classes.post} xs={12} sm={12} md={6}>
          <Commenter post={post} />
          <CommentList post={post} />
        </Grid>
      </Grid>
    </Wrapper>
  );
};
