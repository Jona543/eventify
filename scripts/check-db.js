import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

async function checkDB() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    const db = client.db('eventify');

    // Check users collection
    const user = await db.collection('users').findOne({ email: 'eventify44@gmail.com' });
    console.log('User:', user ? 'Found' : 'Not found');

    // Check accounts collection
    const account = await db.collection('accounts').findOne({ 
      provider: 'google',
      'providerAccountId': '109714411317049780297'
    });
    
    console.log('Google account:', account ? 'Linked' : 'Not linked');
    
    if (account) {
      console.log('Account details:', {
        userId: account.userId,
        provider: account.provider,
        providerAccountId: account.providerAccountId
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error checking database:', error);
    process.exit(1);
  }
}

checkDB();
