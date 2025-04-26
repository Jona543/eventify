// /app/api/events/featured/route.js
import clientPromise from '@/lib/mongodb'; // Your mongo connection utility

export async function GET() {
    const client = await clientPromise
  const db = client.db()
  const events = await db.collection('events').find({ featured: true }).toArray();

  return new Response(JSON.stringify({ events }), { status: 200 });
}
