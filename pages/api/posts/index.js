import { ValidateProps } from '@/api-lib/constants';
import { findPosts, insertPost } from '@/api-lib/db';
import { auths, validateBody } from '@/api-lib/middlewares';
import { getMongoDb } from '@/api-lib/mongodb';
import { ncOpts } from '@/api-lib/nc';
import YoutubeMusicApi from 'youtube-music-api';
import nc from 'next-connect';
import wiki from 'wikijs';
import { searchSpotifyAlbum } from '@/api-lib/spotify';

const handler = nc(ncOpts);
const api = new YoutubeMusicApi();

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

// handler.put(async (req, res) => {
//   const db = await getMongoDb();

//   const post = await findPostById(
//     db,
//     req.query.id,
//   );

//   res.json({ post });
// });

handler.post(
  ...auths,
  validateBody({
    type: 'object',
    properties: {
      albumTitle: ValidateProps.post.albumTitle,
      albumArtist: ValidateProps.post.albumArtist,
      wikiDesc: ValidateProps.post.wikiDesc,
      yt: ValidateProps.post.yt,
      theme: ValidateProps.post.theme,
      albumArt: ValidateProps.post.albumArt,
    },
    required: ['albumTitle', 'albumArtist', 'theme'],
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
    };

    const db = await getMongoDb();

    const ytResult = async (postDetails) => {
      api
        .initalize() // Retrieves Innertube Config
        .then(async () => {
          await api
            .search(
              postDetails.albumArtist + ' ' + postDetails.albumTitle,
              'album'
            )
            .then(async (resultyt) => {
              const ytResultLink = resultyt.content[0].playlistId;
              const ytAlbumArt = resultyt.content[0].thumbnails[3].url;
              postDetails.yt = ytResultLink;
              postDetails.albumArt = ytAlbumArt;
              const spotify = await searchSpotifyAlbum(
                postDetails.albumArtist,
                postDetails.albumTitle
              );
              const spotifyLink = spotify.albums.items[0].external_urls.spotify;
              postDetails.spotify = spotifyLink ?? null;
              wiki()
                .find(
                  postDetails.albumTitle +
                    ' ' +
                    postDetails.albumArtist +
                    ' ' +
                    '(album)'
                )
                .then(async (page) => {
                  await page.summary().then(async (wikiDesc) => {
                    postDetails.wikiDesc = wikiDesc;
                    const post = await insertPost(db, {
                      albumTitle: postDetails.albumTitle,
                      albumArtist: postDetails.albumArtist,
                      wikiDesc: postDetails.wikiDesc,
                      yt: postDetails.yt,
                      albumArt: postDetails.albumArt,
                      theme: postDetails.theme,
                      author: req.user._id,
                      spotify: postDetails.spotify,
                    });
                    return res.json({ post });
                  });
                });
            });
        });
    };
    ytResult(postDetails);
  }
);

export default handler;
