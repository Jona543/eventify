import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

const getResponseHeaders = () => ({
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, max-age=0',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
});

// Main DELETE handler for account deletion
export async function DELETE() {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        }),
        { 
          status: 401, 
          headers: getResponseHeaders() 
        }
      );
    }

    // Just return a success response without actually deleting anything
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Account deletion would be processed here',
        userId: session.user.id
      }),
      { 
        status: 200, 
        headers: getResponseHeaders() 
      }
    );

  } catch (error) {
    console.error('Error in account deletion:', error);
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
        headers: getResponseHeaders()
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: getResponseHeaders()
  });
}
