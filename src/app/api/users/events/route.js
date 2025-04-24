// /api/user/events/route.js
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });

  const client = await clientPromise;
  const db = client.db();

  const events = await db.collection('events')
    .find({ attendees: session.user.email })
    .toArray();

  return new Response(JSON.stringify(events), { status: 200 });
}
