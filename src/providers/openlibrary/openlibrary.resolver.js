const client = require('./client');

const fetchRelationWithKey = (dataKey, prefix) => async (obj, args, context, info) => {
  const loaders = await context.getContext('openlibrary/openlibrary');
  const keys = obj[dataKey].map(key => `${prefix}/${key}`);
  return loaders.keyLoader.loadMany(keys);
};

module.exports = {
  Query: {
    books: async (obj, { title = 'Silmarillion', author, limit } = {}, context, info) => {
      const res = await client.get('search.json', {
        params: {
          q: title,
          author,
          limit,
        },
      });

      return res.data.docs;
    },
  },

  Book: {
    authors: fetchRelationWithKey('author_key', '/authors'),
    editions: fetchRelationWithKey('edition_key', '/editions'),
  },
};
