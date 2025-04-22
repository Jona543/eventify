// app/api/test-mongo/route.js
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('sample_mflix');
    const users = await db.collection('users').find().toArray();
    const test = await db.collection('test').insertOne({ hello: 'world' });
    const collections = await db.listCollections().toArray();

    return Response.json({ success: true, data: users });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
