// /api/user/events/route.js
import { auth } from '@/src/auth'; // Import the auth function
import clientPromise from '@/lib/mongodb';

export async function GET() {
  const session = await auth(); // Use the auth function to get the session
  if (!session) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });

  const client = await clientPromise;
  const db = client.db();

  const events = await db.collection('events')
    .find({ attendees: session.user.email })
    .toArray();

  return new Response(JSON.stringify(events), { status: 200 });
}
