import { ObjectId } from 'mongodb';
import { dbProjectionUsers } from './user';

/**
 * Finds a post by its ID.
 * @param {Object} db - The database connection.
 * @param {string} id - The ID of the post to find.
 * @returns {Object|null} The found post or null if not found.
 */
export async function findPostById(db, id) {
  try {
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid post ID');
    }

    const objectId = new ObjectId(id);

    // Aggregate to find the post and join with the users collection
    const posts = await db
      .collection('posts')
      .aggregate([
        { $match: { _id: objectId } },
        { $limit: 1 },
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
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

export async function findPosts(db, before, by) {
  try {
    const query = [
      {
        $match: {
          ...(by && { author: by }),
          ...(before && { createdAt: { $lt: before } }),
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'creator',
        },
      },
      { $unwind: { path: '$creator', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          albumTitle: 1,
          albumArtist: 1,
          theme: 1,
          yt: 1,
          albumArt: 1,
          author: 1,
          spotify: 1,
          wikiDesc: 1,
          createdAt: 1,
          'creator.username': 1, // Make sure to project the creator fields you need
        },
      },
    ];

    const result = await db.collection('posts').aggregate(query).toArray();
    return result;
  } catch (error) {
    console.error('Error finding posts:', error);
    throw new Error('Failed to find posts');
  }
}

export async function insertPost(db, post) {
  try {
    const { insertedId } = await db.collection('posts').insertOne(post);
    post._id = insertedId;
    return post;
  } catch (error) {
    console.error('Error inserting post:', error);
    throw new Error('Failed to insert post');
  }
}

export async function updatePost(db, { id, wikiDesc, yt, albumArt, theme }) {
  try {
    const result = await db.collection('posts').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          wikiDesc,
          yt,
          albumArt,
          theme,
        },
      }
    );

    if (result.matchedCount === 0) {
      throw new Error('Post not found');
    }

    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error updating post:', error);
    throw new Error('Failed to update post');
  }
}
