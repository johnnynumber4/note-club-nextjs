import { nanoid } from 'nanoid';

/**
 * Finds a token by its ID and type.
 * @param {Object} db - The database connection object.
 * @param {string} id - The ID of the token.
 * @param {string} type - The type of the token.
 * @returns {Object|null} The token object or null if not found.
 */
export function findTokenByIdAndType(db, id, type) {
  return db.collection('tokens').findOne({
    _id: id,
    type,
  });
}

/**
 * Finds and deletes a token by its ID and type.
 * @param {Object} db - The database connection object.
 * @param {string} id - The ID of the token.
 * @param {string} type - The type of the token.
 * @returns {Object|null} The deleted token object or null if not found.
 */
export function findAndDeleteTokenByIdAndType(db, id, type) {
  return db
    .collection('tokens')
    .findOneAndDelete({ _id: id, type })
    .then(({ value }) => value);
}

/**
 * Creates and inserts a new token into the database.
 * @param {Object} db - The database connection object.
 * @param {Object} params - The token parameters.
 * @param {string} params.author - The author of the token.
 * @param {string} params.type - The type of the token.
 * @param {Date} params.expireAt - The expiration date of the token.
 * @returns {Object} The created token object.
 */
export async function createToken(db, { author, type, expireAt }) {
  const securedTokenId = nanoid(32);
  const token = {
    _id: securedTokenId,
    author,
    type,
    expireAt,
  };
  await db.collection('tokens').insertOne(token);
  return token;
}
