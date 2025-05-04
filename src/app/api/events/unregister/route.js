// /api/events/unregister/route.js
import { auth } from '@/lib/authHelper';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  const session = await auth();
  if (!session) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });

  const { eventId } = await req.json();
  if (!eventId) return new Response(JSON.stringify({ error: 'Missing event ID' }), { status: 400 });

  const client = await clientPromise;
  const db = client.db();

  await db.collection('events').updateOne(
    { _id: new ObjectId(eventId) },
    { $pull: { attendees: session.user.email } }
  );

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
