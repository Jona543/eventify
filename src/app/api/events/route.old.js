import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import mongodb, { toObjectId, serializeDoc } from '@/lib/mongodb-utils';

const getResponseHeaders = () => ({
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, max-age=0',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
});

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Authentication required' 
        }),
        { status: 401, headers: getResponseHeaders() }
      );
    }

    try {
      const body = await request.json();
      const { 
        title, 
        description = '', 
        date, 
        endDate, 
        location, 
        topic, 
        featured = false 
      } = body;

      const missingFields = [];
      if (!title) missingFields.push('title');
      if (!date) missingFields.push('date');
      if (!endDate) missingFields.push('endDate');
      if (!location) missingFields.push('location');
      if (!topic) missingFields.push('topic');

      if (missingFields.length > 0) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Missing required fields',
            missingFields
          }),
          { status: 400, headers: getResponseHeaders() }
        );
      }

      const client = await mongodb;
      const db = client.db();
      const events = db.collection('events');

      const result = await events.insertOne({
        title: title.trim(),
        description: description.trim(),
        date: new Date(date),
        endDate: new Date(endDate),
        location: location.trim(),
        topic: topic.trim(),
        featured: Boolean(featured),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: session.user.email,
        attendees: [],
        status: 'upcoming'
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Event created successfully', 
          eventId: result.insertedId 
        }),
        { status: 201, headers: getResponseHeaders() }
      );
    } catch (error) {
      console.error('Event creation error:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Internal server error',
          ...(process.env.NODE_ENV === 'development' && { 
            debug: error.message,
            stack: error.stack 
          })  
        }),
        { status: 500, headers: getResponseHeaders() }
      );
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Authentication check failed',
        ...(process.env.NODE_ENV === 'development' && {
          debug: error.message,
          stack: error.stack
        })
      }),
      { status: 500, headers: getResponseHeaders() }
    );
  }
}

export async function GET(request) {
  try {
    const db = await mongodb;
    const eventsCollection = db.collection('events');

    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const skip = parseInt(searchParams.get('skip') || '0', 10);

    const query = {};
    
    if (topic) {
      query.topic = { $regex: new RegExp(topic, 'i') };
    }
    
    if (status) {
      query.status = status.toLowerCase();
    }

    const total = await eventsCollection.countDocuments(query);
    
    let events = await eventsCollection
      .find(query)
      .sort({ date: 1, createdAt: -1 })
      .skip(skip)
      .limit(Math.min(limit, 100)) 
      .toArray();
    
    events = events.map(event => serializeDoc(event));

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: events,
        total,
        skip,
        limit
      }),
      { 
        status: 200, 
        headers: getResponseHeaders() 
      }
    );
  } catch (error) {
    console.error('Error fetching events:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to fetch events',
        ...(process.env.NODE_ENV === 'development' && {
          debug: error.message,
          stack: error.stack
        })
      }),
      { status: 500, headers: getResponseHeaders() }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Authentication required' 
        }),
        { status: 401, headers: getResponseHeaders() }
      );
    }

    try {
      const { eventId } = await request.json();
      
      if (!eventId) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Event ID is required' 
          }),
          { status: 400, headers: getResponseHeaders() }
        );
      }

      const client = await mongodb;
      const db = client.db();
      const events = db.collection('events');

      const eventObjectId = toObjectId(eventId);

      const event = await events.findOne({ _id: eventObjectId });
      
      if (!event) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Event not found' 
          }),
          { status: 404, headers: getResponseHeaders() }
        );
      }

      if (event.createdBy !== session.user.email) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Not authorized to delete this event' 
          }),
          { status: 403, headers: getResponseHeaders() }
        );
      }

      await events.deleteOne({ _id: eventObjectId });

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Event deleted successfully' 
        }),
        { status: 200, headers: getResponseHeaders() }
      );
    } catch (error) {
      console.error('Error deleting event:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to delete event',
          ...(process.env.NODE_ENV === 'development' && {
            debug: error.message,
            stack: error.stack
          })
        }),
        { status: 500, headers: getResponseHeaders() }
      );
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Authentication check failed',
        ...(process.env.NODE_ENV === 'development' && {
          debug: error.message,
          stack: error.stack
        })
      }),
      { status: 500, headers: getResponseHeaders() }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: getResponseHeaders()
  });
}