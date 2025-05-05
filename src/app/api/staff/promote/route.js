// /api/events/promote/route.js
import { auth } from '@/lib/authHelper'; 
import clientPromise from '@/lib/mongodb';

export async function POST(req) {
  const session = await auth(); 

  if (!session || session.user.role !== 'staff') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 });
  }

  const { email } = await req.json();

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');

    const result = await users.updateOne(
      { email },
      { $set: { role: 'staff' } }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Promote user error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
