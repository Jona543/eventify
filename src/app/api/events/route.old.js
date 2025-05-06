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

// Handler for POST /api/events
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Validate authentication
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
      // Parse and validate request body
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

      // Check for required fields
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

      // Initialize database connection
      const client = await mongodb;
      const db = client.db();
      const events = db.collection('events');

      // Insert the new event
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

// Handler for GET /api/events
export async function GET(request) {
  try {
    // Initialize database connection
    const db = await mongodb;
    const eventsCollection = db.collection('events');

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const skip = parseInt(searchParams.get('skip') || '0', 10);

    // Build query object
    const query = {};
    
    if (topic) {
      query.topic = { $regex: new RegExp(topic, 'i') };
    }
    
    if (status) {
      query.status = status.toLowerCase();
    }

    // Get total count for pagination
    const total = await eventsCollection.countDocuments(query);
    
    // Fetch events with pagination and sorting
    let events = await eventsCollection
      .find(query)
      .sort({ date: 1, createdAt: -1 })
      .skip(skip)
      .limit(Math.min(limit, 100)) // Cap at 100 items per page
      .toArray();
    
    // Serialize the event documents
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

// Handler for DELETE /api/events
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Validate authentication
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
      // Parse request body
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

      // Initialize database connection
      const client = await mongodb;
      const db = client.db();
      const events = db.collection('events');

      // Convert to ObjectId safely
      const eventObjectId = toObjectId(eventId);

      // Check if event exists and user is the creator
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

      // Delete the event
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

// Handler for OPTIONS (CORS preflight)
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: getResponseHeaders()
  });
}