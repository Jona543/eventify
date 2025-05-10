import clientPromise from '@/lib/mongodb';

const getResponseHeaders = () => ({
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, max-age=0'
});

export async function GET() {
  try {
    const client = await clientPromise;
    if (!client) {
      throw new Error('Failed to connect to database');
    }

    const db = client.db();
    
    const query = { 
      featured: true,
      $or: [
        { status: { $exists: false } },
        { status: 'upcoming' }
      ]
    };
    
    const events = await db
      .collection('events')
      .find(query)
      .sort({ date: 1 })
      .limit(10)
      .toArray();
      
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
    console.error('Error fetching featured events:', error);
    console.error('Error details:', error.message, error.stack);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to fetch featured events',
        ...(process.env.NODE_ENV === 'development' && {
          debug: error.message,
          stack: error.stack
        })
      }),
      { 
        status: 500,
        headers: getResponseHeaders()
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
