// Simple test route to check if API routes are working
export async function GET() {
  return new Response(
    JSON.stringify({ success: true, message: 'Test route works!' }),
    { 
      status: 200, 
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}
