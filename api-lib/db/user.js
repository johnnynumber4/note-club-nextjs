import { ObjectId } from 'mongodb';

// Function to find a user by email, typically used for registration or login
export async function findUserByEmail(db, email) {
  return await db.collection('users').findOne({ email });
}

// Function to find a user by ID, useful for session management
export async function findUserForAuth(db, userId) {
  return db
    .collection('users')
    .findOne({ _id: new ObjectId(userId) }, { projection: dbProjectionUsers() })
    .then((user) => user || null);
}

// Function to find a user by ID
export async function findUserById(db, userId) {
  return db
    .collection('users')
    .findOne({ _id: new ObjectId(userId) }, { projection: dbProjectionUsers() })
    .then((user) => user || null);
}

// Function to find a user by username
export async function findUserByUsername(db, username) {
  return db
    .collection('users')
    .findOne({ username }, { projection: dbProjectionUsers() })
    .then((user) => user || null);
}

// Function to insert a new user, accommodating users with no password
export async function insertUser(db, userDetails) {
  const user = {
    ...userDetails,
    createdAt: new Date(),
  };
  const { insertedId } = await db.collection('users').insertOne(user);
  user._id = insertedId;
  return user;
}

// Function to update user details, excluding sensitive fields
export async function updateUserById(db, id, data) {
  return db
    .collection('users')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after', projection: dbProjectionUsers() }
    )
    .then(({ value }) => value);
}

// Projection for user data, excluding sensitive fields
export function dbProjectionUsers(prefix = '') {
  return {
    [`${prefix}password`]: 0, // Exclude password
    [`${prefix}emailVerified`]: 0, // Exclude email verification status
    [`${prefix}createdAt`]: 0, // Optionally exclude creation date
  };
}
