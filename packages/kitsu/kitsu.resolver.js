const { resolveAlias } = require('@openapi/core/utils');
const fp = require('lodash/fp');
const client = require('./client');
const { DEFAULT_LIMIT } = require('./constants');

const createCategoriesResolver = () => async (
  obj,
  { limit = DEFAULT_LIMIT } = {},
  context,
  info
) => {
  const res = await client.get('categories', {
    params: {
      'page[limit]': limit,
    },
  });
  return res.data.data;
};

const getCovers = key => obj => {
  const images = fp.get(key, obj);
  if (images) {
    return {
      tiny: images.tiny,
      small: images.small,
      medium: images.medium,
      large: images.large,
      original: images.original,
    };
  }
  return null;
};

module.exports = {
  Query: {
    animeCategories: createCategoriesResolver(),
  },

  Category: {
    title: resolveAlias('attributes.title'),
    description: resolveAlias('attributes.description'),
    slug: resolveAlias('attributes.slug'),
    nsfw: resolveAlias('attributes.nsfw'),
    createdAt: resolveAlias('attributes.createdAt'),
    updatedAt: resolveAlias('attributes.updatedAt'),
    covers: getCovers('attributes.image'),
  },
};
