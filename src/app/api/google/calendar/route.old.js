import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

const getResponseHeaders = () => ({
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, max-age=0',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
});

export async function POST() {
  try {
    // Just return a simple response to test if the route works
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Google Calendar integration would be processed here'
      }),
      { status: 200, headers: getResponseHeaders() }
    );
  } catch (error) {
    console.error('Error in Google Calendar route:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { 
          message: error.message,
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
