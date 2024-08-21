import { findUserByUsername, updateUserById } from '@/api-lib/db';
import { getMongoDb } from '@/api-lib/mongodb';
import { slugUsername } from '@/lib/user';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import nc from 'next-connect';
import { getSession } from 'next-auth/react'; // Import NextAuth session handler

const upload = multer({ dest: '/tmp' });
const handler = nc();

if (process.env.CLOUDINARY_URL) {
  const {
    hostname: cloud_name,
    username: api_key,
    password: api_secret,
  } = new URL(process.env.CLOUDINARY_URL);

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
  });
}

// Use NextAuth session to authenticate users
handler.use(async (req, res, next) => {
  const session = await getSession({ req });
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = session.user;
  next();
});

handler.get(async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  return res.json({ user: req.user });
});

handler.patch(upload.single('profilePicture'), async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const db = await getMongoDb();

  let profilePicture;
  if (req.file) {
    try {
      const image = await cloudinary.uploader.upload(req.file.path, {
        width: 512,
        height: 512,
        crop: 'fill',
      });
      profilePicture = image.secure_url;
    } catch (error) {
      return res.status(500).json({ error: 'Failed to upload image' });
    }
  }

  const { name, bio, username } = req.body;

  // Check for unique username if provided
  let newUsername;
  if (username) {
    newUsername = slugUsername(username);
    if (
      newUsername !== req.user.username &&
      (await findUserByUsername(db, newUsername))
    ) {
      return res
        .status(403)
        .json({ error: 'The username has already been taken.' });
    }
  }

  const user = await updateUserById(db, req.user.id, {
    ...(newUsername && { username: newUsername }),
    ...(name && { name }),
    ...(typeof bio === 'string' && { bio }),
    ...(profilePicture && { profilePicture }),
  });

  res.json({ user });
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
