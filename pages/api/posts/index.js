import { ValidateProps } from '@/api-lib/constants';
import { findPosts, insertPost } from '@/api-lib/db';
import { auths, validateBody } from '@/api-lib/middlewares';
import { getMongoDb } from '@/api-lib/mongodb';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';
import wiki from 'wikijs';
import { searchSpotifyAlbum } from '@/api-lib/spotify';

const handler = nc(ncOpts);

handler.get(async (req, res) => {
  const db = await getMongoDb();

  const posts = await findPosts(
    db,
    req.query.before ? new Date(req.query.before) : undefined,
    req.query.by,
    req.query.limit ? parseInt(req.query.limit, 10) : undefined
  );

  res.json({ posts });
});

handler.post(
  ...auths,
  validateBody({
    type: 'object',
    properties: {
      albumTitle: ValidateProps.post.albumTitle,
      albumArtist: ValidateProps.post.albumArtist,
      yt: ValidateProps.post.yt,
      theme: ValidateProps.post.theme,
      albumArt: ValidateProps.post.albumArt,
    },
    required: ['albumTitle', 'albumArtist', 'yt', 'theme', 'albumArt'],
    additionalProperties: false,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }

    const postDetails = {
      albumTitle: req.body.albumTitle,
      albumArtist: req.body.albumArtist,
      theme: req.body.theme,
      yt: req.body.yt,
      albumArt: req.body.albumArt,
    };

    const db = await getMongoDb();

    try {
      const spotify = await searchSpotifyAlbum(
        postDetails.albumArtist,
        postDetails.albumTitle
      );

      if (spotify.albums && spotify.albums.items.length > 0) {
        postDetails.spotify = spotify.albums.items[0].external_urls.spotify;
      } else {
        postDetails.spotify = null;
      }

      const page = await wiki().find(
        `${postDetails.albumTitle} ${postDetails.albumArtist} (album)`
      );
      postDetails.wikiDesc = await page.summary();
    } catch (error) {
      console.error('Error fetching additional data:', error);
      postDetails.wikiDesc = 'Description not available.';
      postDetails.spotify = null;
    }

    const post = await insertPost(db, {
      albumTitle: postDetails.albumTitle,
      albumArtist: postDetails.albumArtist,
      theme: postDetails.theme,
      yt: postDetails.yt,
      albumArt: postDetails.albumArt,
      wikiDesc: postDetails.wikiDesc,
      spotify: postDetails.spotify,
      author: req.user._id,
    });

    return res.json({ post });
  }
);

export default handler;
