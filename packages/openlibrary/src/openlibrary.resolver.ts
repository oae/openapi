import * as fp from 'lodash/fp';

import { resolveAlias } from '@openapi/core/utils';

import { name as pluginName } from '../package.json';
import client from './client';
import { DEFAULT_LIMIT, KeyType } from './constants';
import { extractKeys, normalizeKey } from './utils';

const fetchRelationWithKey = (dataKey, type) => async (
  obj,
  { limit = DEFAULT_LIMIT } = {},
  context,
  info
) => {
  const loaders = await context.getContext(pluginName);
  const rawKeys = obj[dataKey] || [];
  const keys = fp.flow(
    fp.take(limit || rawKeys.length),
    extractKeys,
    fp.map(normalizeKey(type))
  )(rawKeys);

  return loaders.keyLoader.loadMany(keys);
};

const getCovers = key => obj =>
  fp.map(cover => ({
    small: `https://covers.openlibrary.org/w/id/${cover}-S.jpg`,
    medium: `https://covers.openlibrary.org/w/id/${cover}-M.jpg`,
    large: `https://covers.openlibrary.org/w/id/${cover}-L.jpg`,
  }))(obj[key]);

const commonFields = () => ({
  createdAt: resolveAlias('created.value'),
  lastModifiedAt: resolveAlias('last_modified.value'),
});

const createBookSearchResolver = () => async (
  obj,
  { title = null, author = null, limit = DEFAULT_LIMIT } = {},
  context,
  info
) => {
  const res = await client.get('search.json', {
    params: {
      q: title,
      author,
      limit,
    },
  });

  const loaders = await context.getContext(pluginName);
  const { keyLoader } = loaders;

  return Promise.all(
    res.data.docs.map(async book => {
      const work = await keyLoader.load(book.key);
      return {
        ...book,
        ...work,
      };
    })
  );
};

const resolveDescription = () => (obj, args, context, info) =>
  fp.getOr(null, 'description.value', obj) || fp.getOr(null, 'description', obj);

export default {
  Query: {
    books: createBookSearchResolver(),
    booksFromAuthor: createBookSearchResolver(),
  },

  Book: {
    ...commonFields(),
    description: resolveDescription(),
    covers: getCovers('covers'),
    subjectPlaces: resolveAlias('subject_places'),
    subjectPeople: resolveAlias('subject_people'),
    authors: fetchRelationWithKey('author_key', KeyType.AUTHOR),
    editions: fetchRelationWithKey('edition_key', KeyType.EDITION),
  },

  BookEdition: {
    ...commonFields(),
    isbn10: resolveAlias('isbn_10'),
    isbn13: resolveAlias('isbn_13'),
    publishDate: resolveAlias('publish_date'),
    authors: fetchRelationWithKey('authors', KeyType.AUTHOR),
  },

  BookAuthor: {
    ...commonFields(),
    birthDate: resolveAlias('birth_date'),
    deathDate: resolveAlias('death_date'),
    altNames: resolveAlias('alternate_names'),
    personalName: resolveAlias('personal_name'),
  },
};
