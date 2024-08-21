import { MongoClient } from 'mongodb';

let indexesCreated = false;

async function createIndexes(client) {
  if (indexesCreated) return client;

  const db = client.db();
  try {
    await Promise.all([
      db
        .collection('tokens')
        .createIndex({ expireAt: -1 }, { expireAfterSeconds: 0 }),
      db
        .collection('posts')
        .createIndexes([{ key: { createdAt: -1 } }, { key: { author: -1 } }]),
      db
        .collection('comments')
        .createIndexes([{ key: { createdAt: -1 } }, { key: { postId: -1 } }]),
      db.collection('users').createIndexes([
        { key: { email: 1 }, unique: true },
        { key: { username: 1 }, unique: true },
      ]),
    ]);

    indexesCreated = true;
  } catch (error) {
    console.error('Error creating indexes:', error);
    throw error;
  }
  return client;
}

export async function getMongoClient() {
  if (!global.mongoClientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    global.mongoClientPromise = client
      .connect()
      .then((client) => {
        return createIndexes(client);
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        throw error;
      });
  }
  return global.mongoClientPromise;
}

export async function getMongoDb() {
  try {
    const mongoClient = await getMongoClient();
    return mongoClient.db();
  } catch (error) {
    console.error('Error getting MongoDB database:', error);
    throw error;
  }
}
