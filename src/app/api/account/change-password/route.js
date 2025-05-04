import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  console.log('🔐 Session:', session);


  if (!session) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
    });
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

  const user = await users.findOne({ _id: new ObjectId(session.user.sub) });

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
    });
  }

  const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!isMatch) {
    return new Response(JSON.stringify({ error: 'Old password is incorrect' }), {
      status: 401,
    });
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  await users.updateOne(
    { _id: new ObjectId(session.user.sub) },
    { $set: { passwordHash: hashedNewPassword } }
  );

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  });
}

