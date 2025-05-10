import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import connectToDatabase, { toObjectId, serializeDoc } from '@/lib/mongodb-utils';

const getResponseHeaders = () => ({
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, max-age=0',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
});

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new Response(
        JSON.stringify({ success: false, error: 'Not authenticated' }),
        { status: 401, headers: getResponseHeaders() }
      );
    }

    const { db } = await connectToDatabase();
    
    const events = await db.collection('events')
      .find({ 
        attendees: { $elemMatch: { $eq: session.user.email } } 
      })
      .toArray();

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: serializeDoc(events)
      }),
      { status: 200, headers: getResponseHeaders() }
    );

  } catch (error) {
    console.error('Error in /api/users/events:', error);
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
