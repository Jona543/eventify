import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import events from './seedData.js';

dotenv.config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

async function seedEvents() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('events');

    await collection.deleteMany({});
    await collection.insertMany(events);

    console.log('✅ Events seeded successfully!');
  } catch (err) {
    console.error('❌ Failed to seed events:', err);
  } finally {
    await client.close();
  }
}

seedEvents();
