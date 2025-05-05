
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/lib/authOptions';

export async function auth() {
  const options = await getAuthOptions()
  return await getServerSession(options);
}

export async function POST(req) {
  const session = await auth();
  console.log('Session:', session);

  if (!session) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
    });
  }

  // Only allow credentials-based users to change passwords
  if (session.provider !== 'credentials') {
    return new Response(
      JSON.stringify({ error: 'Password change not available for this login method' }),
      { status: 403 }
    );
  }

  const { oldPassword, newPassword } = await req.json();

  if (!oldPassword || !newPassword) {
    return new Response(JSON.stringify({ error: 'Missing old or new password' }), {
      status: 400,
    });
  }

  const client = await clientPromise;
  const db = client.db();
  const users = db.collection('users');

  const user = await users.findOne({ _id: new ObjectId(session.user.id) });

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
    });
  }

  if (!user.passwordHash) {
    return new Response(
      JSON.stringify({ error: 'This account does not support password authentication' }),
      { status: 400 }
    );
  }

  const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!isMatch) {
    return new Response(JSON.stringify({ error: 'Old password is incorrect' }), {
      status: 401,
    });
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  await users.updateOne(
    { _id: new ObjectId(session.user.id) },
    { $set: { passwordHash: hashedNewPassword } }
  );

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  });
}
