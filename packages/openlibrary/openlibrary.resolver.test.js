const { request } = require('graphql-request');
const { gql } = require('@openapi/core/utils');
const { createServer, destroyServer } = require('@openapi/core/testUtils');

const { name: pluginName } = require('./package.json');

let server = null;

beforeAll(async () => {
  server = await createServer([pluginName]);
});

afterAll(async () => {
  await destroyServer(server);
});

const bookFields = gql`
  fragment bookFields on Book {
    title
    description
    createdAt
    lastModifiedAt
    covers {
      small
      medium
      large
    }
    subjectPlaces
    subjectPeople
    subjects
    editions(limit: 2) {
      title
      isbn10
      isbn13
      publishers
      publishDate
      authors {
        name
      }
    }
    authors(limit: 2) {
      name
      createdAt
      lastModifiedAt
      birthDate
      deathDate
      altNames
      personalName
    }
  }
`;

const validBook = {
  title: expect.not.toBeEmpty(),
  description: expect.not.toBeEmpty(),
  createdAt: expect.not.toBeEmpty(),
  lastModifiedAt: expect.not.toBeEmpty(),
  subjectPlaces: expect.toBeArray(),
  subjectPeople: expect.toBeArray(),
  subjects: expect.toBeArray(),
  editions: expect.toBeArray(),
  covers: expect.toBeArray(),
  authors: expect.toBeArray(),
};

describe('openlibrary', () => {
  it(
    'should return books with matching title',
    async () => {
      const query = gql`
        ${bookFields}
        {
          books(title: "Lord of the Rings", limit: 2) {
            ...bookFields
          }
        }
      `;

      const result = await request(server.endpoint, query);
      expect(result.books).toBeArray();
      result.books.forEach(book => expect(book).toMatchObject(validBook));
    },
    20000
  );

  it(
    'should return books from given author',
    async () => {
      const query = gql`
        ${bookFields}
        {
          booksFromAuthor(author: "tolkien", limit: 2) {
            ...bookFields
          }
        }
      `;

      const result = await request(server.endpoint, query);
      expect(result.booksFromAuthor).toBeArray();
      result.booksFromAuthor.forEach(book => expect(book).toMatchObject(validBook));
    },
    20000
  );
});
