/**
 * Converts MongoDB documents to plain JavaScript objects
 * Handles ObjectId and other MongoDB specific types
 */
export function serializeDocument(doc) {
  if (!doc) return null;
  
  // Handle arrays
  if (Array.isArray(doc)) {
    return doc.map(serializeDocument);
  }
  
  // Handle dates
  if (doc instanceof Date) {
    return doc.toISOString();
  }
  
  // Handle ObjectId
  if (doc?._id && typeof doc._id === 'object' && doc._id.toString) {
    doc = { ...doc, _id: doc._id.toString() };
  }
  
  // Handle nested objects
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

/**
 * Safely converts a value to ObjectId
 */
export function toObjectId(id) {
  const { ObjectId } = require('mongodb');
  try {
    return new ObjectId(id);
  } catch (error) {
    return null;
  }
}
