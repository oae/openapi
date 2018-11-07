const { resolveAlias } = require('@openapi/core/utils');
const client = require('./client');

const createCategoriesResolver = () => async (obj, _, context, info) => {
  const res = await client.get('categories');
  return { ...res.data };
};

module.exports = {
  Query: {
    categories: createCategoriesResolver(),
  },

  Category: {
    id: resolveAlias('id'),
  },
};
