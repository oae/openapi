const fp = require('lodash/fp');

const client = require('./client');
const { DEFAULT_LIMIT } = require('./constants');

const fetchRelationWithKey = (dataKey, prefix = '') => async (
  obj,
  { limit = DEFAULT_LIMIT } = {},
  context,
  info
) => {
  const loaders = await context.getContext('openlibrary/openlibrary');
  const rawKeys = obj[dataKey] || [];
  const keys = fp.flow(
    fp.take(limit || rawKeys.length),
    fp.map(key => `${prefix}/${key}`)
  )(rawKeys);

  return loaders.keyLoader.loadMany(keys);
};

const alias = key => (obj, args, context, info) => fp.get(key, obj);

const getCovers = key => obj =>
  fp.map(cover => ({
    small: `https://covers.openlibrary.org/w/id/${cover}-S.jpg`,
    medium: `https://covers.openlibrary.org/w/id/${cover}-M.jpg`,
    large: `https://covers.openlibrary.org/w/id/${cover}-L.jpg`,
  }))(obj[key]);

const commonFields = () => ({
  createdAt: alias('created.value'),
  lastModifiedAt: alias('last_modified.value'),
});

module.exports = {
  Query: {
    books: async (
      obj,
      { title = 'Silmarillion', author, limit = DEFAULT_LIMIT } = {},
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

      const loaders = await context.getContext('openlibrary/openlibrary');
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
    },
  },

  Book: {
    ...commonFields(),
    covers: getCovers('covers'),
    subjectPlaces: alias('subject_places'),
    subjectPeople: alias('subject_people'),
    authors: fetchRelationWithKey('author_key', '/authors'),
    editions: fetchRelationWithKey('edition_key', '/editions'),
  },

  BookEdition: {
    ...commonFields(),
    isbn10: alias('isbn_10'),
    isbn13: alias('isbn_13'),
    publishDate: alias('publish_date'),
    authors: fetchRelationWithKey('authors'),
  },

  BookAuthor: {
    ...commonFields(),
    birthDate: alias('birth_date'),
    deathDate: alias('death_date'),
    altNames: alias('alternate_names'),
    personalName: alias('personal_name'),
  },
};
