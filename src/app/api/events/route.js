import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  console.log('GET /api/events called');
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic');
    console.log('Topic filter:', topic || 'none');
    
    console.log('Connecting to MongoDB...');
    const client = await clientPromise;
    console.log('Connected to MongoDB');
    
    const db = client.db('eventify');
    console.log('Using database: eventify');

    const query = {};
    if (topic) {
      query.topic = topic;
    }
    
    console.log('Fetching events with query:', JSON.stringify(query));
    
    const collection = db.collection('events');
    console.log('Using collection: events');
    
    const count = await collection.countDocuments(query);
    console.log(`Found ${count} events matching the query`);
    
    const events = await collection
      .find(query)
      .sort({ date: 1 }) 
      .toArray();
    
    console.log(`Retrieved ${events.length} events from database`);
    
    const serializedEvents = events.map(event => {
      try {
        return {
          ...event,
          _id: event._id.toString(),
          date: event.date?.toISOString(),
          createdAt: event.createdAt?.toISOString(),
          updatedAt: event.updatedAt?.toISOString(),
        };
      } catch (error) {
        console.error('Error serializing event:', error, 'Event data:', event);
        return null;
      }
    }).filter(Boolean);
    
    console.log(`Successfully serialized ${serializedEvents.length} events`);
    
    return NextResponse.json(
      { success: true, data: serializedEvents },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );
  } catch (error) {
    console.error('Error in GET /api/events:', error);
    if (error.stack) {
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch events',
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return new Response(
    JSON.stringify({ success: true, message: 'Event creation would be processed here' }),
    { 
      status: 200, 
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  );
}

export async function DELETE() {
  return new Response(
    JSON.stringify({ success: true, message: 'Event deletion would be processed here' }),
    { 
      status: 200, 
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  );
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}
