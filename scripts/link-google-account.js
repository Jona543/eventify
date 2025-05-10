import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

const GOOGLE_ACCOUNT = {
  provider: 'google',
  type: 'oauth',
  providerAccountId: '109714411317049780297',
  access_token: 'dummy-access-token', 
  expires_at: Math.floor(Date.now() / 1000) + 3600, 
  scope: 'openid email profile',
  token_type: 'Bearer'
};

async function linkGoogleAccount() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    const db = client.db('eventify');

    const user = await db.collection('users').findOne({ email: 'eventify44@gmail.com' });
    
    if (!user) {
      console.error('User not found');
      process.exit(1);
    }

    const existingAccount = await db.collection('accounts').findOne({
      provider: 'google',
      providerAccountId: GOOGLE_ACCOUNT.providerAccountId
    });

    if (existingAccount) {
      console.log('Google account is already linked to this user');
      process.exit(0);
    }

    await db.collection('accounts').insertOne({
      ...GOOGLE_ACCOUNT,
      userId: user._id,
      refresh_token: null, 
      access_token: null,  
      id_token: null      
    });

    console.log('Successfully linked Google account to user');
    process.exit(0);
  } catch (error) {
    console.error('Error linking Google account:', error);
    process.exit(1);
  }
}

linkGoogleAccount();
