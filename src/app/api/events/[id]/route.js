import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(req, context) {
  try {
    const params = await context.params
    const id = params.id
    const updatedData = await req.json();

    // Basic validation (optional but useful)
    if (!ObjectId.isValid(id)) {
      return Response.json({ success: false, error: 'Invalid ID format' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const events = db.collection('events');

    const result = await events.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updatedData,
          date: new Date(updatedData.date), // ensure proper Date object
        },
      }
    );

    if (result.matchedCount === 0) {
      return Response.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    return Response.json({ success: result.modifiedCount === 1 });
  } catch (error) {
    console.error('Error updating event:', error);
    return Response.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function GET(req, context) {
  const params = await context.params
  const id = params.id

  let objectId;
  try {
    objectId = new ObjectId(id);
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid ID format' }), { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();
  const events = db.collection('events');

  const event = await events.findOne({ _id: objectId });

  if (!event) {
    return new Response(JSON.stringify({ error: 'Event not found' }), { status: 404 });
  }

  return Response.json(event);
}
