import { ObjectId } from 'mongodb';
import { dbProjectionUsers } from './user';

export async function findPostById(db, id) {
  const posts = await db
    .collection('posts')
    .aggregate([
      { $match: { _id: new ObjectId(id) } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'creator',
        },
      },
      { $unwind: '$creator' },
      { $project: dbProjectionUsers('creator.') },
    ])
    .toArray();
  if (!posts[0]) return null;
  return posts[0];
}

export async function findPosts(db, before, by) {
  return db
    .collection('posts')
    .aggregate([
      {
        $match: {
          ...(by && { author: new ObjectId(by) }),
          ...(before && { createdAt: { $lt: before } }),
        },
      },
      { $sort: { _id: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'creator',
        },
      },
      { $unwind: '$creator' },
      { $project: dbProjectionUsers('creator.') },
    ])
    .toArray();
}

export async function insertPost(
  db,
  { author, albumTitle, albumArtist, wikiDesc, yt, albumArt, theme, spotify }
) {
  const post = {
    author,
    albumTitle,
    albumArtist,
    wikiDesc,
    yt,
    albumArt,
    theme,
    spotify,
    createdAt: new Date(),
  };
  const { insertedId } = await db.collection('posts').insertOne(post);
  post._id = insertedId;
  return post;
}

// export async function updatePost(
//   db,
//   { id, wikiDesc, yt, albumArt, theme }
// ) {
//   const post = {
//     id,
//     wikiDesc,
//     yt,
//     albumArt,
//     theme,
//   };
//   const postId = await db.collection('posts').updateOne({"_id": ObjectId(`${id}`)},
//     {
//       $set:
//       {
//         wikiDesc,
//         yt,
//         albumArt,
//         theme,
//       }
//     }
//   );
//   return post;
// }
