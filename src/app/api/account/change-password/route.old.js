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
    const session = await getServerSession(authOptions);
    
    // Validate authentication
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        }),
        { status: 401, headers: getResponseHeaders() }
      );
    }

    // Return a simple success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Password change would be processed here',
        userId: session.user.id
      }),
      { status: 200, headers: getResponseHeaders() }
    );

  } catch (error) {
    console.error('Error in change password:', error);
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
