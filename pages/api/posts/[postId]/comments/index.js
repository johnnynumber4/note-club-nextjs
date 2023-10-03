import { ValidateProps } from '@/api-lib/constants';
import {
  findPostById,
  //  updatePost
} from '@/api-lib/db';
import { findComments, insertComment } from '@/api-lib/db/comment';
import { auths, validateBody } from '@/api-lib/middlewares';
import { getMongoDb } from '@/api-lib/mongodb';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';
import { searchSpotifyAlbum } from '@/api-lib/spotify';
// import YoutubeMusicApi from 'youtube-music-api';
// import wiki from 'wikijs';

// const api = new YoutubeMusicApi();

const handler = nc(ncOpts);

handler.get(async (req, res) => {
  const db = await getMongoDb();

  const post = await findPostById(db, req.query.postId);
  // const postDetails = {
  //   albumTitle: post.albumTitle,
  //   albumArtist: post.albumArtist,
  //   theme: post.theme,
  // };

  // const ytResult = async (postDetails) => {
  //   api
  //     .initalize() // Retrieves Innertube Config
  //     .then(async () => {
  //       await api
  //         .search(
  //           postDetails.albumArtist + ' ' + postDetails.albumTitle,
  //           'album'
  //         )
  //         .then(async (resultyt) => {
  //           const ytResultLink = resultyt.content[0].playlistId;
  //           const ytAlbumArt = resultyt.content[0].thumbnails[3].url;
  //           postDetails.yt = ytResultLink;
  //           postDetails.albumArt = ytAlbumArt;
  //           wiki()
  //             .find(
  //               postDetails.albumTitle +
  //                 ' ' +
  //                 postDetails.albumArtist +
  //                 ' ' +
  //                 '(album)'
  //             )
  //             .then(async (page) => {
  //               await page.summary().then(async (wikiDesc) => {
  //                 postDetails.wikiDesc = wikiDesc;
  //                 const post = await updatePost(db, {
  //                   id: req.query.postId,
  //                   albumTitle: postDetails.albumTitle,
  //                   albumArtist: postDetails.albumArtist,
  //                   wikiDesc: postDetails.wikiDesc,
  //                   yt: postDetails.yt,
  //                   albumArt: postDetails.albumArt,
  //                   theme: postDetails.theme,
  //                 });
  //                 return res.json({ post });
  //               });
  //             });
  //         });
  //     });
  // };
  // ytResult(postDetails);

  if (!post) {
    return res.status(404).json({ error: { message: 'Post is not found.' } });
  }

  const comments = await findComments(
    db,
    req.query.postId,
    req.query.before ? new Date(req.query.before) : undefined,
    req.query.limit ? parseInt(req.query.limit, 10) : undefined
  );

  return res.json({ comments });
});

handler.post(
  ...auths,
  validateBody({
    type: 'object',
    properties: {
      content: ValidateProps.comment.content,
    },
    required: ['content'],
    additionalProperties: false,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }

    const db = await getMongoDb();

    const content = req.body.content;

    const post = await findPostById(db, req.query.postId);

    if (!post) {
      return res.status(404).json({ error: { message: 'Post is not found.' } });
    }

    const comment = await insertComment(db, post._id, {
      author: req.user._id,
      content,
    });

    return res.json({ comment });
  }
);

export default handler;
