import { gql, testUtils } from '@openapi/core';
import { request } from 'graphql-request';

import { name as pluginName } from '../package.json';
import { Query } from './generated/graphql.js';

let server = null;

beforeAll(async () => {
  server = await testUtils.createServer([pluginName]);
});

afterAll(async () => {
  await testUtils.destroyServer(server);
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

function testValidBook(book) {
  expect(book.title).not.toBeEmpty();
  expect(book.createdAt).not.toBeEmpty();
  expect(book.lastModifiedAt).not.toBeEmpty();
  expect(book.editions).toBeArray();
  expect(book.covers).toBeArray();
  expect(book.authors).toBeArray();
}

describe('openlibrary', () => {
  it('should return books with matching title', async () => {
    const query = gql`
      ${bookFields}
      {
        books(title: "Lord of the Rings", limit: 2) {
          ...bookFields
        }
      }
    `;

    const result: Query = await request(server.endpoint, query);
    expect(result.books).toBeArray();
    result.books.forEach(testValidBook);
  }, 20000);

  it('should return books from given author', async () => {
    const query = gql`
      ${bookFields}
      {
        booksFromAuthor(author: "tolkien", limit: 2) {
          ...bookFields
        }
      }
    `;

    const result: Query = await request(server.endpoint, query);
    expect(result.booksFromAuthor).toBeArray();
    result.booksFromAuthor.forEach(testValidBook);
  }, 20000);
});
