// Simple MongoDB utility functions that won't cause build issues

// Mock client promise
const clientPromise = {
  then: () => ({
    db: () => ({
      collection: () => ({
        findOne: async () => ({}),
        find: () => ({
          toArray: async () => []
        }),
        updateOne: async () => ({}),
        deleteOne: async () => ({})
      })
    })
  })
};

// Simple ObjectId mock
const toObjectId = (id) => id;

// Simple document serializer
const serializeDoc = (doc) => {
  if (!doc) return null;
  if (Array.isArray(doc)) return doc.map(d => ({
    ...d,
    _id: d._id ? d._id.toString() : null
  }));
  return {
    ...doc,
    _id: doc._id ? doc._id.toString() : null
  };
};

export { clientPromise, toObjectId, serializeDoc };
export default { clientPromise, toObjectId, serializeDoc };
