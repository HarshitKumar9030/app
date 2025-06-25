import { MongoClient, Db, Collection } from 'mongodb';
import { User } from '@/types/api';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const uri = process.env.MONGODB_URI!;
  const dbName = process.env.MONGODB_DB_NAME || 'forge';

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export class UserRepository {
  private static async getCollection(): Promise<Collection<User>> {
    const { db } = await connectToDatabase();
    return db.collection<User>('users');
  }

  // create new user
  static async createUser(userData: Omit<User, '_id'>): Promise<User> {
    const collection = await this.getCollection();
    
    const result = await collection.insertOne(userData as User);
    const user = await collection.findOne({ _id: result.insertedId });
    
    if (!user) {
      throw new Error('Failed to create user');
    }
    
    return user;
  }

  // find user by email
  static async findUserByEmail(email: string): Promise<User | null> {
    const collection = await this.getCollection();
    return await collection.findOne({ email: email.toLowerCase() });
  }

  // find user by API key
  static async findUserByApiKey(apiKey: string): Promise<User | null> {
    const collection = await this.getCollection();
    
    // First find by API key and active status
    const user = await collection.findOne({ 
      apiKey,
      isActive: true
    });
    
    // Check expiration manually if user found
    if (user && user.apiKeyExpiresAt && user.apiKeyExpiresAt <= new Date()) {
      return null; // API key expired
    }
    
    return user;
  }

  // find user by ID
  static async findUserById(id: string): Promise<User | null> {
    const collection = await this.getCollection();
    return await collection.findOne({ id });
  }

  // update user's API key
  static async updateUserApiKey(userId: string, newApiKey: string): Promise<boolean> {
    const collection = await this.getCollection();
    
    const result = await collection.updateOne(
      { id: userId },
      { 
        $set: { 
          apiKey: newApiKey,
          updatedAt: new Date(),
          lastActiveAt: new Date()
        }
      }
    );
    
    return result.modifiedCount > 0;
  }

  // update user's last active timestamp
  static async updateLastActive(userId: string): Promise<boolean> {
    const collection = await this.getCollection();
    
    const result = await collection.updateOne(
      { id: userId },
      { 
        $set: { 
          lastActiveAt: new Date(),
          updatedAt: new Date()
        }
      }
    );
    
    return result.modifiedCount > 0;
  }

  // add deployment to user
  static async addDeploymentToUser(userId: string, deploymentId: string): Promise<boolean> {
    const collection = await this.getCollection();
    
    const result = await collection.updateOne(
      { id: userId },
      { 
        $addToSet: { deployments: deploymentId },
        $set: { 
          updatedAt: new Date(),
          lastActiveAt: new Date()
        }
      }
    );
    
    return result.modifiedCount > 0;
  }

  // add subdomain to user
  static async addSubdomainToUser(userId: string, subdomain: string): Promise<boolean> {
    const collection = await this.getCollection();
    
    const result = await collection.updateOne(
      { id: userId },
      { 
        $addToSet: { subdomains: subdomain },
        $set: { 
          updatedAt: new Date(),
          lastActiveAt: new Date()
        }
      }
    );
    
    return result.modifiedCount > 0;
  }

  // remove deployment from user
  static async removeDeploymentFromUser(userId: string, deploymentId: string): Promise<boolean> {
    const collection = await this.getCollection();
    
    const result = await collection.updateOne(
      { id: userId },
      { 
        $pull: { deployments: deploymentId },
        $set: { 
          updatedAt: new Date()
        }
      }
    );
    
    return result.modifiedCount > 0;
  }

  // get user statistics
  static async getUserStats(userId: string): Promise<{
    totalDeployments: number;
    totalSubdomains: number;
    activeDeployments: number;
  } | null> {
    const user = await this.findUserById(userId);
    if (!user) return null;

    return {
      totalDeployments: user.deployments.length,
      totalSubdomains: user.subdomains.length,
      activeDeployments: user.deployments.length // TODO: Filter by active deployments
    };
  }

  // deactivate user account
  static async deactivateUser(userId: string): Promise<boolean> {
    const collection = await this.getCollection();
    
    const result = await collection.updateOne(
      { id: userId },
      { 
        $set: { 
          isActive: false,
          updatedAt: new Date()
        }
      }
    );
    
    return result.modifiedCount > 0;
  }

  // check if email exists
  static async emailExists(email: string): Promise<boolean> {
    const collection = await this.getCollection();
    const count = await collection.countDocuments({ email: email.toLowerCase() });
    return count > 0;
  }

  // create database indexes for better performance
  static async createIndexes(): Promise<void> {
    const collection = await this.getCollection();
    
    await Promise.all([
      collection.createIndex({ email: 1 }, { unique: true }),
      collection.createIndex({ apiKey: 1 }, { unique: true }),
      collection.createIndex({ id: 1 }, { unique: true }),
      collection.createIndex({ isActive: 1 }),
      collection.createIndex({ createdAt: 1 }),
      collection.createIndex({ lastActiveAt: 1 })
    ]);
  }
}

export default UserRepository;
