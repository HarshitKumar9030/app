import { MongoClient, Db, Collection, Document } from 'mongodb';

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
};

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB_NAME || 'forge');
}

export async function getCollection<T extends Document>(collectionName: string): Promise<Collection<T>> {
  const db = await getDatabase();
  return db.collection<T>(collectionName);
}

// Collection helpers
export const Collections = {
  DEPLOYMENTS: 'deployments',
  SUBDOMAINS: 'subdomains',
  USERS: 'users',
  HEALTH_CHECKS: 'health_checks',
  INCIDENTS: 'incidents'
} as const;

export async function healthCheck(): Promise<boolean> {
  try {
    const client = await clientPromise;
    await client.db('admin').command({ ismaster: 1 });
    return true;
  } catch (error) {
    console.error('MongoDB health check failed:', error);
    return false;
  }
}

export default clientPromise;
