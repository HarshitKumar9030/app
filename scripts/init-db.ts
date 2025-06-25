/**
 * Database initialization script
 * Run with: tsx scripts/init-db.ts
 */

import { config } from 'dotenv';
import UserRepository from '../src/lib/userRepository';

// Load environment variables
config({ path: '.env.local' });

async function initializeDatabase() {
  console.log('Initializing database...');

  try {
    // Create indexes for users collection
    console.log('Creating database indexes...');
    await UserRepository.createIndexes();
    console.log('Database indexes created successfully');
    
    console.log('Database initialization completed!');
    
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();
    