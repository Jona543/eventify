import { getToken } from 'next-auth/jwt';
import clientPromise from '@/lib/mongodb';

const getResponseHeaders = () => ({
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, max-age=0',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
});

export async function GET(request) {
  try {
    const token = await getToken({ req: request });
    
    // Validate authentication
    if (!token?.email) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Authentication required' 
        }),
        { status: 401, headers: getResponseHeaders() }
      );
    }

    try {
      // Initialize database connection
      const client = await clientPromise;
      if (!client) {
        throw new Error('Failed to connect to database');
      }

      const db = client.db();
      const eventsCollection = db.collection('events');

      // Find events where the user is an attendee
      const events = await eventsCollection
        .find({
          attendees: token.email
        })
        .sort({ date: 1 })
        .toArray();

      // Convert ObjectId to string for serialization
      const serializedEvents = events.map(event => ({
        ...event,
        _id: event._id.toString()
      }));


      return new Response(
        JSON.stringify({ 
          success: true, 
          data: serializedEvents 
        }),
        { 
          status: 200, 
          headers: getResponseHeaders() 
        }
      );
    } catch (error) {
      console.error('Error fetching user events:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to fetch user events',
          code: 'FETCH_EVENTS_ERROR',
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
        code: 'AUTH_ERROR',
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
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}
