import { resolveAlias } from '@openapi/core/utils';
import * as format from 'date-fns/format';
import * as _ from 'lodash';
import * as fp from 'lodash/fp';
import client from './client';
import { DEFAULT_LIMIT } from './constants';

const createAnimesResolver = () => async (
  obj,
  { limit = DEFAULT_LIMIT, skip = 0 } = {},
  context,
  info
) =>
  // Kitsu anime query max limit is 20. So we need to divide query in pieces.
  Promise.all(
    _.range(0, limit, 20).map(offset => {
      const limitVal = limit - offset >= 20 ? 20 : limit - offset;
      return client
        .get('anime', {
          params: {
            'page[limit]': limitVal,
            'page[offset]': offset + skip,
          },
        })
        .then(res => res.data.data);
    })
  ).then(data => _.flatten(data));

const createCategoriesResolver = () => async (
  obj,
  { limit = DEFAULT_LIMIT, skip = 0 } = {},
  context,
  info
) => {
  const res = await client.get('categories', {
    params: {
      'page[limit]': limit,
      'page[offset]': skip,
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

const createTrendingAnimesResolver = () => async (obj, args, context, info) => {
  const res = await client.get('trending/anime');
  return res.data.data;
};

const resolveAnimeCategories = () => async (obj, args, context, info) => {
  const res = await client.get(`anime/${obj.id}/categories`);
  return res.data.data;
};

export default {
  Query: {
    animes: createAnimesResolver(),
    trendingAnimes: createTrendingAnimesResolver(),
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
    title: resolveAlias('attributes.title'),
    description: resolveAlias('attributes.description'),
    slug: resolveAlias('attributes.slug'),
    nsfw: resolveAlias('attributes.nsfw'),
    createdAt: resolveAlias('attributes.createdAt'),
    updatedAt: resolveAlias('attributes.updatedAt'),
    cover: getAnimeImage('attributes.image'),
  },
};
