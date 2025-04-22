// app/api/events/route.js
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, date, location } = body;

    if (!title || !date || !location) {
      return Response.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const events = db.collection('events');

    await events.insertOne({
      title,
      description: description || '',
      date: new Date(date),
      location,
      createdAt: new Date(),
    });

    return Response.json({ success: true, message: 'Event created' });
  } catch (error) {
    console.error('Event creation error:', error.stack || error);
    return Response.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const events = db.collection('events');

    const allEvents = await events
      .find({})
      .sort({ date: 1 }) // Soonest first
      .toArray();

    return Response.json({ success: true, events: allEvents });
  } catch (error) {
    console.error('Error fetching events:', error.stack || error);
    return Response.json({ success: false, error: 'Failed to fetch events' }, { status: 500 });
  }
}
