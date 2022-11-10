import { ValidateProps } from '@/api-lib/constants';
import { findPosts, insertPost } from '@/api-lib/db';
import { auths, validateBody } from '@/api-lib/middlewares';
import { getMongoDb } from '@/api-lib/mongodb';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';
import * as ytMusic from 'node-youtube-music';
import wiki from 'wikijs';

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
      await ytMusic
        .searchAlbums(postDetails.albumTitle)
        .then(async (resultyt) => {
          const ytResultLink = resultyt[0].albumId;
          const ytAlbumArt = resultyt[0].thumbnailUrl;
          postDetails.yt = ytResultLink;
          postDetails.albumArt = ytAlbumArt;
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
                // console.log(postDetails);
                const post = await insertPost(db, {
                  albumTitle: postDetails.albumTitle,
                  albumArtist: postDetails.albumArtist,
                  wikiDesc: postDetails.wikiDesc,
                  yt: postDetails.yt,
                  albumArt: postDetails.albumArt,
                  theme: postDetails.theme,
                  author: req.user._id,
                });
                return res.json({ post });
              });
            });
        });
    };
    ytResult(postDetails);
    console.log(postDetails);
  }
);

export default handler;
