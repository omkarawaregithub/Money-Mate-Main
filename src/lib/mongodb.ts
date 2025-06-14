// src/lib/mongodb.ts
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

// Using a global variable to maintain a cached connection across hot reloads in development.
// This prevents connections from growing exponentially during API Route usage.
// In production, this will always be null initially.
let cachedClient: MongoClient | null = null;
let cachedDb: any = null; // Using 'any' for Db for simplicity, can be typed with 'Db' from 'mongodb'

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    await client.connect();
    console.log("Successfully connected to MongoDB.");
    const db = client.db(); // You might want to specify your database name here, e.g., client.db("yourDbName")

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    // Gracefully handle error or throw
    throw error;
  }
}

export default connectToDatabase;

// Example of how to structure your client for re-use:
// (from https://github.com/vercel/next.js/blob/canary/examples/with-mongodb/lib/mongodb.js)

declare global {
  // eslint-disable-next-line no-unused-vars
  var _mongoClientPromise: Promise<MongoClient>
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
  });
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module,the client can be shared across functions.
export { clientPromise };
