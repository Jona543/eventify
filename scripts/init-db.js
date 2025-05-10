import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function initDB() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    const db = client.db('eventify');

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    if (!collectionNames.includes('users')) {
      await db.createCollection('users');
      console.log('Created users collection');
    }

    if (!collectionNames.includes('accounts')) {
      await db.createCollection('accounts');
      console.log('Created accounts collection');
    }

    if (!collectionNames.includes('sessions')) {
      await db.createCollection('sessions');
      console.log('Created sessions collection');
    }

    const testUser = {
      email: 'eventify44@gmail.com',
      name: 'Eventify',
      emailVerified: new Date(),
      role: 'user',
      image: 'https://lh3.googleusercontent.com/a/ACg8ocKke6uZ97bL73Q9txppRZZFUKx-4X1o6WM8GmphaNNjnWHrxg=s96-c',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const existingUser = await db.collection('users').findOne({ email: testUser.email });
    
    if (!existingUser) {
      await db.collection('users').insertOne(testUser);
      console.log('Created test user');
    } else {
      console.log('Test user already exists');
    }

    console.log('Database initialization complete');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDB();
