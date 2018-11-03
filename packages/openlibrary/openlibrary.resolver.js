const fp = require('lodash/fp');

const { resolveAlias } = require('@openapi/core/utils');

const { name: pluginName } = require('./package.json');

const { extractKeys, normalizeKey } = require('./utils');
const client = require('./client');
const { DEFAULT_LIMIT, KeyType } = require('./constants');

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
  { title, author, limit = DEFAULT_LIMIT } = {},
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

const resolveDescription = () => (obj, args, context, info) => {
  if (fp.isString(obj.description)) {
    return obj.description;
  }

  return fp.getOr(null, 'description.value', obj);
};

module.exports = {
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
