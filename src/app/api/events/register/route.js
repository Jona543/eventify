import { getServerSession } from 'next-auth';  // Import from next-auth
import clientPromise from '@/lib/mongodb';     // MongoDB client promise
import { ObjectId } from 'mongodb';            // MongoDB ObjectId
import { authOptions } from '@/lib/authOptions'; // Auth options for next-auth

export async function POST(req) {
  // Get the session using next-auth's getServerSession
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(
      JSON.stringify({ error: 'Not authenticated' }),
      { status: 401 }
    );
  }

  // Extract eventId from the request body
  const { eventId } = await req.json();

  if (!eventId) {
    return new Response(
      JSON.stringify({ error: 'Missing event ID' }),
      { status: 400 }
    );
  }

  // Connect to MongoDB
  const client = await clientPromise;
  const db = client.db();

  try {
    // Update the event by adding the user email to the attendees array
    const result = await db.collection('events').updateOne(
      { _id: new ObjectId(eventId) },
      { $addToSet: { attendees: session.user.email } } // Adds email only if it's not already in the array
    );

    // If no document was updated (event not found), return a 404
    if (result.matchedCount === 0) {
      return new Response(
        JSON.stringify({ error: 'Event not found' }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error registering for event:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to register for event' }),
      { status: 500 }
    );
  }
}
