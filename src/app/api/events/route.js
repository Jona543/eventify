// app/api/events/route.js
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { auth } from '@/lib/authHelper'; // Import the auth function

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, date, endDate, location, topic, featured = false } = body;

    if (!title || !description || !date || !endDate || !location || !topic ) {
      return Response.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const events = db.collection('events');

    await events.insertOne({
      title,
      description: description || '',
      date: new Date(date),
      endDate: new Date(endDate),
      location,
      topic,
      featured: Boolean(featured),
      createdAt: new Date(),
    });

    return Response.json({ success: true, message: 'Event created' });
  } catch (error) {
    console.error('Event creation error:', error.stack || error);
    return Response.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const eventsCollection = db.collection('events');

    // Grab the topic from the query params
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic');

    // Build query conditionally
    const query = topic ? { topic } : {};

    const events = await eventsCollection
      .find(query)
      .sort({ date: 1 }) // Sorts events by date ascending
      .toArray();

    return Response.json({ success: true, events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return Response.json({ success: false, error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await auth();  // Use the auth function to get the session

    if (!session || session.user.role !== 'staff') {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ success: false, error: 'Missing event ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const events = db.collection('events');

    const result = await events.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return Response.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    return Response.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return Response.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

