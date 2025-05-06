import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import mongodb, { toObjectId, serializeDoc } from '@/lib/mongodb-utils';

const getResponseHeaders = () => ({
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, max-age=0',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
});

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: getResponseHeaders()
  });
}

/**
 * Register a user for an event
 * @route POST /api/events/register
 * @body {string} eventId - The ID of the event to register for
 * @returns {Promise<Response>} JSON response with success status and message
 */
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
      const eventObjectId = toObjectId(eventId);
      if (!eventObjectId) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Invalid event ID format' 
          }),
          { status: 400, headers: getResponseHeaders() }
        );
      }

      const client = await mongodb;
      const db = client.db();
      const eventsCollection = db.collection('events');

      // First check if the event exists
      const event = await eventsCollection.findOne(
        { _id: eventObjectId },
        { projection: { _id: 1, attendees: 1 } }
      );
      
      // Serialize the event document
      if (event) {
        event = serializeDoc(event);
      }

      if (!event) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Event not found' 
          }),
          { status: 404, headers: getResponseHeaders() }
        );
      }

      // Add user to attendees if not already registered
      if (!event.attendees.includes(session.user.email)) {
        const result = await eventsCollection.updateOne(
          { _id: eventObjectId },
          { $addToSet: { attendees: session.user.email } }
        );

        if (result.modifiedCount === 0) {
          throw new Error('Failed to register for event');
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Successfully registered for event' 
        }),
        { status: 200, headers: getResponseHeaders() }
      );
    } catch (error) {
      console.error('Event registration error:', error);
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
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { 
          debug: error.message 
        })
      }),
      { status: 500, headers: getResponseHeaders() }
    );
  }
}
