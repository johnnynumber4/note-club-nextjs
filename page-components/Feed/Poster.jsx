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
import { Modal, Box, Grid, Button, FormControl } from '@mui/material';
import { LoadingButton } from '@mui/lab';

const PosterInner = () => {
  const albumTitleRef = useRef();
  const albumArtistRef = useRef();
  const themeRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [multipleResults, setMultipleResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // State for collapse/expand

  const { mutate } = usePostPages();

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (isLoading) return; // Prevent multiple submissions

    try {
      setIsLoading(true);
      const response = await fetcher(
        `/api/search/yt?albumArtist=${albumArtistRef.current.value}&albumTitle=${albumTitleRef.current.value}`
      );
      if (response.multipleResults) {
        setMultipleResults(response.multipleResults);
        setShowModal(true);
      } else {
        toast.error('No albums found');
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleSelection = useCallback(async (selectedResult) => {
    if (isLoading) return; // Prevent multiple selections
    try {
      setIsLoading(true);

      const postDetails = {
        albumTitle: selectedResult.name,
        albumArtist: selectedResult.artist,
        theme: themeRef.current.value,
        yt: selectedResult.playlistId,
        albumArt: selectedResult.thumbnails[3].url,
      };

      // Post to the database
      await fetcher('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postDetails),
      });

      toast.success('You have posted successfully');
      setShowModal(false);
      mutate();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, mutate]);

  return (
    <form onSubmit={onSubmit}>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box className={styles.modal}>
          <h2>Select an Album</h2>
          <ul>
            {multipleResults.map((result, index) => (
              <li
                key={index}
                onClick={() => !isLoading && handleSelection(result)}
                className={isLoading ? styles.disabled : ''}
              >
                <img src={result.thumbnails[3].url} alt={result.name} />
                <span>{result.name}</span>
              </li>
            ))}
          </ul>
        </Box>
      </Modal>

      <Box
        textAlign="center"
        onClick={toggleExpand}
        className={styles.expandToggle}
      >
        {isExpanded ? '▲' : '▼'}
      </Box>

      {isExpanded && (
        <div className={styles.additionalContent}>
          <Container className={styles.poster}>
            <FormControl sx={{ width: '100%' }}>
              <Grid container spacing={1}>
                <Grid item xs={12} md={4}>
                  <Input
                    ref={albumTitleRef}
                    className={styles.input}
                    placeholder={`What album should we listen to?`}
                    ariaLabel={`What album should we listen to?`}
                    disabled={isLoading} // Disable input while loading
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Input
                    ref={albumArtistRef}
                    className={styles.input}
                    placeholder={`And who was that by?`}
                    ariaLabel={`And who was that by?`}
                    disabled={isLoading} // Disable input while loading
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Input
                    ref={themeRef}
                    className={styles.input}
                    placeholder={`What's the theme?`}
                    ariaLabel={`What's the theme?`}
                    disabled={isLoading} // Disable input while loading
                  />
                </Grid>
              </Grid>
              <Box textAlign="center">
                <LoadingButton type="submit" loading={isLoading} disabled={isLoading}>
                  Post
                </LoadingButton>
              </Box>
            </FormControl>
          </Container>
        </div>
      )}
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
