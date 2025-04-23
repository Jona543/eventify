// app/api/topics/route.js
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const topics = await db.collection('events').distinct('topic');
    return Response.json({ success: true, topics });
  } catch (error) {
    console.error('Error fetching topics:', error);
    return Response.json({ success: false, error: 'Failed to fetch topics' }, { status: 500 });
  }
}
