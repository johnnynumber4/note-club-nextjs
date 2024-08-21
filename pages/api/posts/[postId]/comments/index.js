import nc from 'next-connect';
import { getSession } from 'next-auth/react';

import { ValidateProps } from '@/api-lib/constants';
import { findPostById } from '@/api-lib/db';
import { findComments, insertComment } from '@/api-lib/db/comment';
import { validateBody } from '@/api-lib/middlewares';
import { getMongoDb } from '@/api-lib/mongodb';
import { ncOpts } from '@/api-lib/nc';

const handler = nc(ncOpts);

// GET request to fetch comments for a specific post
handler.get(async (req, res) => {
  try {
    const db = await getMongoDb();
    const post = await findPostById(db, req.query.postId);

    if (!post) {
      return res.status(404).json({ error: { message: 'Post not found.' } });
    }

    const comments = await findComments(
      db,
      req.query.postId,
      req.query.before ? new Date(req.query.before) : undefined,
      req.query.limit ? parseInt(req.query.limit, 10) : undefined
    );

    res.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// POST request to create a new comment
handler.post(
  validateBody({
    type: 'object',
    properties: {
      content: ValidateProps.comment.content,
    },
    required: ['content'],
    additionalProperties: false,
  }),
  async (req, res) => {
    try {
      // Fetch session to ensure the user is authenticated
      const session = await getSession({ req });

      console.log('SESSION', session); // Debugging: Check the session details in the logs

      if (!session || !session.user) {
        return res
          .status(401)
          .json({ error: 'You must be logged in to comment' });
      }

      const db = await getMongoDb();
      const content = req.body.content;
      const post = await findPostById(db, req.query.postId);

      if (!post) {
        return res.status(404).json({ error: { message: 'Post not found.' } });
      }

      const comment = await insertComment(db, post._id, {
        author: session.user.username, // Store the Discord username
        content,
      });

      res.json({ comment });
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ error: 'Failed to create comment' });
    }
  }
);

export default handler;
