// Simple MongoDB client that creates a new connection each time
// This is less efficient but more reliable for build process

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const { MongoClient } = await import('mongodb');
  
  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  
  const db = client.db();
  
  // Cache the client and db in development to prevent multiple connections
  if (process.env.NODE_ENV === 'development') {
    cachedClient = client;
    cachedDb = db;
  }
  
  return { client, db };
}

// Export the connection function
export default connectToDatabase;

// Helper function to safely convert to ObjectId
export function toObjectId(id) {
  if (!id) return null;
  try {
    const { ObjectId } = require('mongodb');
    return new ObjectId(id);
  } catch (error) {
    console.error('Error creating ObjectId:', error);
    return null;
  }
}

// Helper function to serialize MongoDB documents
export function serializeDoc(doc) {
  if (!doc) return null;
  
  // Handle arrays
  if (Array.isArray(doc)) {
    return doc.map(serializeDoc);
  }
  
  // Handle dates
  if (doc instanceof Date) {
    return doc.toISOString();
  }
  
  // Handle MongoDB ObjectId
  if (doc?._id && typeof doc._id === 'object' && doc._id.toString) {
    doc = { ...doc, _id: doc._id.toString() };
  }
  
  if (doc?._id && typeof doc._id === 'object' && doc._id.toString) {
    doc = { ...doc, _id: doc._id.toString() };
  }
  
  if (typeof doc === 'object' && doc !== null) {
    const result = {};
    for (const [key, value] of Object.entries(doc)) {
      if (key === '_id' && value && typeof value === 'object' && value.toString) {
        result[key] = value.toString();
      } else if (Array.isArray(value)) {
        result[key] = value.map(serializeDoc);
      } else if (value && typeof value === 'object' && value !== null) {
        result[key] = serializeDoc(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }
  
  return doc;
}
