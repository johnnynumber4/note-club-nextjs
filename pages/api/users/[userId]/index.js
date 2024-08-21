import { findUserById } from '@/api-lib/db';
import { getMongoDb } from '@/api-lib/mongodb';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';
import { getSession } from 'next-auth/react'; // Import NextAuth session handler

const handler = nc(ncOpts);

// Use NextAuth session to authenticate users
handler.use(async (req, res, next) => {
  const session = await getSession({ req });
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = session.user; // Attach user to request
  next();
});

handler.get(async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const db = await getMongoDb();
    const user = await findUserById(db, userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Optional: Add logic to ensure that the requesting user has permission to view this user's data

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default handler;
