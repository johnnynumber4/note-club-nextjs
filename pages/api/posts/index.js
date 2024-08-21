import nc from 'next-connect';
import wiki from 'wikijs';

import { ValidateProps } from '@/api-lib/constants';
import { findPosts, insertPost } from '@/api-lib/db';
import { validateBody } from '@/api-lib/middlewares';
import { getMongoDb } from '@/api-lib/mongodb';
import { ncOpts } from '@/api-lib/nc';
import { searchSpotifyAlbum } from '@/api-lib/spotify';

const handler = nc(ncOpts);

handler.get(async (req, res) => {
  try {
    const db = await getMongoDb();
    const posts = await findPosts(
      db,
      req.query.before ? new Date(req.query.before) : undefined,
      req.query.by,
      req.query.limit ? parseInt(req.query.limit, 10) : undefined
    );
    res.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

const postSchema = {
  type: 'object',
  properties: {
    albumTitle: ValidateProps.post.albumTitle,
    albumArtist: ValidateProps.post.albumArtist,
    yt: ValidateProps.post.yt,
    theme: ValidateProps.post.theme,
    albumArt: ValidateProps.post.albumArt,
    username: { type: 'string' },
  },
  required: [
    'albumTitle',
    'albumArtist',
    'yt',
    'theme',
    'albumArt',
    'username',
  ],
  additionalProperties: false,
};

handler.post(validateBody(postSchema), async (req, res) => {
  const username = req.body.username;
  const { albumTitle, albumArtist, theme, yt, albumArt } = req.body;

  const postDetails = {
    albumTitle,
    albumArtist,
    theme,
    yt,
    albumArt,
    author: username,
    createdAt: new Date(),
  };

  try {
    const spotify = await searchSpotifyAlbum(albumArtist, albumTitle);
    postDetails.spotify =
      spotify.albums?.items[0]?.external_urls?.spotify || null;

    const page = await wiki().find(`${albumTitle} ${albumArtist} (album)`);
    postDetails.wikiDesc = await page.summary();
  } catch (error) {
    console.error('Error fetching additional data:', error);
    postDetails.wikiDesc = 'Description not available.';
    postDetails.spotify = null;
  }

  try {
    const db = await getMongoDb();
    const post = await insertPost(db, postDetails);
    res.json({ post });
  } catch (error) {
    console.error('Error inserting post:', error);
    res.status(500).json({ error: 'Failed to insert post' });
  }
});

export default handler;
