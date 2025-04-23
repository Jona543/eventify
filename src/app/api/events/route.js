// app/api/events/route.js
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, date, location, topic } = body;

    if (!title || !date || !location || !topic) {
      return Response.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const events = db.collection('events');

    await events.insertOne({
      title,
      description: description || '',
      date,
      location,
      topic,
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

    const events = await eventsCollection.find(query).toArray();

    return Response.json({ success: true, events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return Response.json({ success: false, error: 'Failed to fetch events' }, { status: 500 });
  }
}

