import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import Link from 'next/link';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import styles from './Search.module.css';
import { makeStyles } from '@material-ui/core/styles';
import { LoadingDots } from '../LoadingDots';

const useStyles = makeStyles(() => ({
  autoRoot: {
    margin: 'unset',
  },
  searchBar: {
    margin: '20px',
  },
}));

export default function SearchBar({ posts }) {
  const classes = useStyles();
  const [show, setShow] = useState(true);
  useEffect(() => {
    Router.onRouteChangeStart = () => {
      setShow(false);
    };

    Router.onRouteChangeComplete = () => {
      setShow(true);
    };
  }, []);

  return (
    <Stack className={classes.searchBar}>
      {show ? (
        <Autocomplete
          classes={{ root: classes.autoRoot }}
          id="album-search"
          options={posts.map((option) => option.albumTitle)}
          sx={{ margin: '0 0 20px' }}
          renderOption={(option) => {
            const post = posts.filter(
              (element) => element.albumTitle === option.key
            )[0];

            return (
              <li key={option.key}>
                <Link
                  href={`/user/${post.creator.username}/post/${post._id}`}
                  passHref
                >
                  <a className="hover:underline hover:text-blue-500">
                    - {option.key}{' '}
                  </a>
                </Link>
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search..."
              className={styles.input}
              InputProps={{
                ...params.InputProps,
                type: 'search',
                className: styles.input,
              }}
            />
          )}
        />
      ) : (
        <LoadingDots />
      )}
    </Stack>
  );
}
