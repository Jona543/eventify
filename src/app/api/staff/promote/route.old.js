import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

// Simple test route that should work without any database connections
export async function POST() {
  try {
    // Just return a simple response to test if the route works
    return new Response(
      JSON.stringify({ success: true, message: 'Promote route is working' }),
      { 
        status: 200, 
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );
  } catch (error) {
    console.error('Error in /api/staff/promote:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { 
          message: error.message,
          stack: error.stack 
        })
      }),
      { 
        status: 500, 
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
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
