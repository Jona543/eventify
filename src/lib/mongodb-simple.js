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

const toObjectId = (id) => id;

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
