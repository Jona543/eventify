import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';  // Ensure this is set up correctly
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req, res) {
  // Get session data using next-auth
  const session = await getServerSession(authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { eventId } = await req.json();

  if (!eventId) {
    return res.status(400).json({ error: 'Missing event ID' });
  }

  const client = await clientPromise;
  const db = client.db();

  // Remove the user email from the event attendees list
  try {
    const result = await db.collection('events').updateOne(
      { _id: new ObjectId(eventId) },
      { $pull: { attendees: session.user.email } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Event not found or user not registered' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error unregistering user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
