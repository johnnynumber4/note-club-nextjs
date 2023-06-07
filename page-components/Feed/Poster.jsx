// import { Avatar } from '@/components/Avatar';
import { Input } from '@/components/Input';
import { Container, Wrapper } from '@/components/Layout';
import { LoadingDots } from '@/components/LoadingDots';
import { Text, TextLink } from '@/components/Text';
import { fetcher } from '@/lib/fetch';
import { usePostPages } from '@/lib/post';
import { useCurrentUser } from '@/lib/user';
import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import styles from './Poster.module.css';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  FormControl,
  // FormLabel
} from '@mui/material';

const useStyles = makeStyles(() => ({
}));

const PosterInner = ({ user }) => {
  // const classes = useStyles();
  const albumTitleRef = useRef();
  const albumArtistRef = useRef();
  const themeRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const { mutate } = usePostPages();

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        await fetcher('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            albumTitle: albumTitleRef.current.value,
            albumArtist: albumArtistRef.current.value,
            theme: themeRef.current.value,
          }),
        });
        toast.success('You have posted successfully');
        albumTitleRef.current.value = '';
        albumArtistRef.current.value = '';
        themeRef.current.value = '';
        // refresh post lists
        mutate();
      } catch (e) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    },
    [mutate]
  );

  return (
    <form onSubmit={onSubmit}>
      <Container className={styles.poster}>
        {/* <Avatar size={40} username={user.username} url={user.profilePicture} /> */}
        <FormControl sx={{ width: '100%' }}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <Input
                ref={albumTitleRef}
                className={styles.input}
                placeholder={`What album should we listen to?`}
                ariaLabel={`What album should we listen to?`}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input
                ref={albumArtistRef}
                className={styles.input}
                placeholder={`And who was that by?`}
                ariaLabel={`And who was that by?`}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input
                ref={themeRef}
                className={styles.input}
                placeholder={`What's the theme?`}
                ariaLabel={`What's the theme?`}
              />
            </Grid>
          </Grid>
          <Button type="success" loading={isLoading}>
            Post
          </Button>
        </FormControl>
      </Container>
    </form>
  );
};

const Poster = () => {
  const { data, error } = useCurrentUser();
  const loading = !data && !error;

  return (
    <Wrapper>
      <div className={styles.root}>
        <h3 className={styles.heading}>Post your album!</h3>
        {loading ? (
          <LoadingDots>Loading</LoadingDots>
        ) : data?.user ? (
          <PosterInner user={data.user} />
        ) : (
          <Text color="secondary">
            Please{' '}
            <Link href="/login" passHref legacyBehavior>
              <TextLink color="link" variant="highlight">
                sign in
              </TextLink>
            </Link>{' '}
            to post
          </Text>
        )}
      </div>
    </Wrapper>
  );
};

export default Poster;
