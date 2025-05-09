import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export function createObjectId(id) {
  if (!id) return null;
  try {
    if (id instanceof ObjectId) return id;
    if (typeof id === 'string') return new ObjectId(id);
    return null;
  } catch (error) {
    console.error('Invalid ObjectId:', error);
    return null;
  }
}

export function serializeDocument(doc) {
  if (!doc) return null;
  
  if (Array.isArray(doc)) {
    return doc.map(serializeDocument);
  }
  
  if (doc instanceof Date) {
    return doc.toISOString();
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
        result[key] = value.map(serializeDocument);
      } else if (value && typeof value === 'object' && value !== null) {
        result[key] = serializeDocument(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }
  
  return doc;
}

export async function getDb() {
  const client = await clientPromise;
  return client.db();
}

export default clientPromise;
