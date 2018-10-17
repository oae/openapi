const axios = require('axios');
const qs = require('querystring');

const client = axios.create({
  baseURL: 'https://openlibrary.org'
});

module.exports = {
  Query: {
    books: async (obj, { title = 'Silmarillion' } = {}, context, info) => {
      const bookRefs = await client.get('query.json', {
        params: {
          type: '/type/edition',
          title
        }
      });

      const books = await Promise.all(bookRefs.data.map(async bookRef => {
        const res = await client.get(bookRef.key);
        return res.data;
      }));

      return books;
    },
  },

  Book: {
    isbn10: (obj, args, context, info) => {
      return obj.isbn_10;
    },
    isbn13: (obj, args, context, info) => {
      return obj.isbn_13;
    },
    publishDate: (obj, args, context, info) => {
      return obj.publish_date;
    }
  }
};
