import { getToken } from 'next-auth/jwt';
import clientPromise from '@/lib/mongodb';

export async function DELETE(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();
  const users = db.collection('users');

  const result = await users.deleteOne({ email: token.email });

  if (result.deletedCount === 1) {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ error: 'User not found or already deleted' }), { status: 404 });
  }
}
