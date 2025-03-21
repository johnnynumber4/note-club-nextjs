import { ObjectId } from 'mongodb';
import { dbProjectionUsers } from './user';

export async function findPostById(db, id) {
  try {
    const posts = await db
      .collection('posts')
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        { $limit: 1 },
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: 'username', // Update to 'username'
            as: 'creator',
          },
        },
        { $unwind: { path: '$creator', preserveNullAndEmptyArrays: true } },
        { $project: dbProjectionUsers('creator.') },
      ])
      .toArray();
    return posts[0] || null;
  } catch (error) {
    console.error('Error finding post by ID:', error);
    throw new Error('Failed to find post');
  }
}

export async function findPostsByUser(db, username) {
  return db.collection('posts').find({ author: username }).toArray();
}
