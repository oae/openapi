const { resolveAlias } = require('@openapi/core/utils');
const format = require('date-fns/format');
const fp = require('lodash/fp');
const client = require('./client');
const { DEFAULT_LIMIT } = require('./constants');

const createAnimesResolver = () => async (obj, { limit = DEFAULT_LIMIT } = {}, context, info) => {
  const res = await client.get('anime', {
    params: {
      'page[limit]': 5,
    },
  });
  return res.data.data;
};

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

const getAnimeImage = key => obj => {
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

const resolveAnimeTitle = key => obj => {
  const title = fp.get(key, obj);
  if (title) {
    return {
      en: title.en,
      enJp: title.en_jp,
      jaJp: title.ja_jp,
      canonicalTitle: obj.attributes.canonicalTitle,
    };
  }
  return null;
};

const resolveDate = key => obj => {
  const date = fp.get(key, obj);
  return format(date);
};

const resolveTitle = () => obj => obj.attributes.title;

const resolveAnimeCategories = () => async (obj, _, context, info) => {
  const res = await client.get(`anime/${obj.id}/categories`);
  return res.data.data;
};

module.exports = {
  Query: {
    animes: createAnimesResolver(),
    animeCategories: createCategoriesResolver(),
  },

  Anime: {
    title: resolveAnimeTitle('attributes.titles'),
    slug: resolveAlias('attributes.slug'),
    synopsis: resolveAlias('attributes.synopsis'),
    createdAt: resolveAlias('attributes.createdAt'),
    updatedAt: resolveAlias('attributes.updatedAt'),
    status: resolveAlias('attributes.status'),
    averageRating: resolveAlias('attributes.averageRating'),
    startDate: resolveDate('attributes.startDate'),
    endDate: resolveDate('attributes.endDate'),
    posterImage: getAnimeImage('attributes.posterImage'),
    coverImage: getAnimeImage('attributes.coverImage'),
    episodeCount: resolveAlias('attributes.episodeCount'),
    nsfw: resolveAlias('attributes.nsfw'),
    categories: resolveAnimeCategories(),
  },

  Category: {
    title: resolveTitle(),
    description: resolveAlias('attributes.description'),
    slug: resolveAlias('attributes.slug'),
    nsfw: resolveAlias('attributes.nsfw'),
    createdAt: resolveAlias('attributes.createdAt'),
    updatedAt: resolveAlias('attributes.updatedAt'),
    cover: getAnimeImage('attributes.image'),
  },
};
