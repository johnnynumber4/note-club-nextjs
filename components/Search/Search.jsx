import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import Link from 'next/link';
// import Router from 'next/router';
// import { useEffect, useState } from 'react';
import styles from './Search.module.css';
import { makeStyles } from '@material-ui/core/styles';
// import { LoadingDots } from '../LoadingDots';

const useStyles = makeStyles(() => ({
  autoRoot: {
    margin: 'unset',
  },
  searchBar: {
    margin: '20px',
  },
  inputRoot: {
    color: 'var(--accents-7)',
  },
  paper: {
    backgroundColor: 'var(--opacity-bg)',
    color: 'var(--foreground)',
  },
}));

export default function SearchBar({ posts }) {
  const classes = useStyles();

  return (
    <Stack className={classes.searchBar}>
      <Autocomplete
        classes={{ root: classes.autoRoot, paper: classes.paper }}
        id="album-search"
        options={posts.map((option) => {
          return `${option.albumTitle + ' - ' + option.albumArtist}`;
        })}
        renderOption={(option) => {
          const post = posts.filter((element) => {
            return (
              `${element.albumTitle} - ${element.albumArtist}` === option.key
            );
          })[0];
          return (
            <li key={post._id}>
              <Link href={`/user/${post.author}/post/${post._id}`} passHref>
                <a className="hover:underline hover:text-blue-500">
                  {option.key}{' '}
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
              classes: { root: classes.inputRoot },
            }}
          />
        )}
      />
    </Stack>
  );
}
