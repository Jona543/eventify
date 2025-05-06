import NextAuth from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import mongodb from '@/lib/mongodb-utils';

// Initialize NextAuth with the provided options
const authHandler = NextAuth(authOptions);

// Helper function to create error response
function createErrorResponse(error) {
  console.error('Auth error:', error);
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: 'Authentication error',
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
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      } 
    }
  );
}

// Create a handler that properly handles all HTTP methods
export async function GET(req, res) {
  try {
    const db = await getDb();
    return await authHandler(req, res);
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function POST(req, res) {
  try {
    const db = await getDb();
    return await authHandler(req, res);
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function PUT(req, res) {
  try {
    const db = await getDb();
    return await authHandler(req, res);
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function PATCH(req, res) {
  try {
    const db = await getDb();
    return await authHandler(req, res);
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function DELETE(req, res) {
  try {
    const db = await getDb();
    return await authHandler(req, res);
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

// Export the auth handler as default for NextAuth
export default NextAuth(authOptions);