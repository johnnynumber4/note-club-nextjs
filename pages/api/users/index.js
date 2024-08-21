import { ValidateProps } from '@/api-lib/constants';
import { findUserByEmail, findUserByUsername, insertUser } from '@/api-lib/db';
import { validateBody } from '@/api-lib/middlewares';
import { getMongoDb } from '@/api-lib/mongodb';
import { ncOpts } from '@/api-lib/nc';
import { slugUsername } from '@/lib/user';
import nc from 'next-connect';
import isEmail from 'validator/lib/isEmail';
import normalizeEmail from 'validator/lib/normalizeEmail';

const handler = nc(ncOpts);

handler.post(
  validateBody({
    type: 'object',
    properties: {
      username: ValidateProps.user.username,
      name: ValidateProps.user.name,
      email: ValidateProps.user.email,
    },
    required: ['username', 'name', 'email'],
    additionalProperties: false,
  }),
  async (req, res) => {
    const db = await getMongoDb();

    let { username, name, email } = req.body;
    username = slugUsername(username);
    email = normalizeEmail(email);

    if (!isEmail(email)) {
      return res
        .status(400)
        .json({ error: { message: 'The email you entered is invalid.' } });
    }

    // Check if the email or username already exists
    const existingEmail = await findUserByEmail(db, email);
    const existingUsername = await findUserByUsername(db, username);

    if (existingEmail) {
      return res
        .status(403)
        .json({ error: { message: 'The email has already been used.' } });
    }

    if (existingUsername) {
      return res
        .status(403)
        .json({ error: { message: 'The username has already been taken.' } });
    }

    try {
      // Insert new user if no conflicts
      const user = await insertUser(db, {
        email,
        bio: '',
        name,
        username,
        profilePicture: null,
      });

      // Send the created user in response
      res.status(201).json({ user });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
);

handler.get(async (req, res) => {
  const db = await getMongoDb();
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const user = await findUserByUsername(db, username);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default handler;
