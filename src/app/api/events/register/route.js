import { getToken } from 'next-auth/jwt';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

const getResponseHeaders = () => ({
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, max-age=0',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
});

// Helper function to safely create ObjectId
const createObjectId = (id) => {
  try {
    return id instanceof ObjectId ? id : new ObjectId(id);
  } catch (error) {
    console.error('Invalid ObjectId:', error);
    return null;
  }
};

export async function POST(request) {
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
      // Parse and validate request body
      const body = await request.json();
      const { eventId } = body || {};

      // Validate event ID
      if (!eventId) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Event ID is required' 
          }),
          { status: 400, headers: getResponseHeaders() }
        );
      }


      // Convert to ObjectId safely
      const eventObjectId = createObjectId(eventId);
      if (!eventObjectId) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Invalid event ID format' 
          }),
          { status: 400, headers: getResponseHeaders() }
        );
      }

      // Initialize database connection
      const client = await clientPromise;
      if (!client) {
        throw new Error('Failed to connect to database');
      }

      const db = client.db();
      const eventsCollection = db.collection('events');

      // First check if the event exists
      const event = await eventsCollection.findOne({
        _id: eventObjectId
      });

      if (!event) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Event not found',
            code: 'EVENT_NOT_FOUND'
          }),
          { status: 404, headers: getResponseHeaders() }
        );
      }

      // Check if user is already registered
      if (event.attendees && event.attendees.includes(token.email)) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Already registered for this event',
            code: 'ALREADY_REGISTERED'
          }),
          { status: 400, headers: getResponseHeaders() }
        );
      }

      // Update the event by adding the user email to the attendees array
      const result = await eventsCollection.updateOne(
        { _id: eventObjectId },
        { 
          $addToSet: { 
            attendees: token.email 
          },
          $set: {
            updatedAt: new Date()
          }
        }
      );

      if (result.matchedCount === 0) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Event not found',
            code: 'EVENT_NOT_FOUND'
          }),
          { status: 404, headers: getResponseHeaders() }
        );
      }

      if (result.modifiedCount === 0) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Failed to register for event',
            code: 'REGISTRATION_FAILED',
            ...(process.env.NODE_ENV === 'development' && {
              debug: 'No changes made to the document'
            })
          }),
          { status: 500, headers: getResponseHeaders() }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Successfully registered for event',
          eventId: eventId,
          timestamp: new Date().toISOString()
        }),
        { 
          status: 200, 
          headers: getResponseHeaders() 
        }
      );
    } catch (error) {
      console.error('Event registration error:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to process registration',
          code: 'REGISTRATION_ERROR',
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}
