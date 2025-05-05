import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function POST(req) {
  const session = await getServerSession(authOptions);

  // Return a 401 if session does not exist
  if (!session) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
    });
  }

  // Ensure password change is only available for credentials-based users
  if (session.provider !== 'credentials') {
    return new Response(
      JSON.stringify({ error: 'Password change not available for this login method' }),
      { status: 403 }
    );
  }

  // Extract old and new password from request body
  const { oldPassword, newPassword } = await req.json();

  // Validate input
  if (!oldPassword || !newPassword) {
    return new Response(JSON.stringify({ error: 'Missing old or new password' }), {
      status: 400,
    });
  }

  const client = await clientPromise;
  const db = client.db();
  const users = db.collection('users');

  // Fetch the user by session user ID
  const user = await users.findOne({ _id: new ObjectId(session.user.id) });

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
    });
  }

  // Ensure password exists for users authenticated via credentials
  if (!user.passwordHash) {
    return new Response(
      JSON.stringify({ error: 'This account does not support password authentication' }),
      { status: 400 }
    );
  }

  // Check if the old password matches
  const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!isMatch) {
    return new Response(JSON.stringify({ error: 'Old password is incorrect' }), {
      status: 401,
    });
  }

  // Hash the new password
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  // Update the password in the database
  await users.updateOne(
    { _id: new ObjectId(session.user.id) },
    { $set: { passwordHash: hashedNewPassword } }
  );

  // Return success response
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  });
}
