const resolvers = require('./openlibrary.resolver');
const contextCreator = require('./context');
const { createContextCreatorForProvider } = require('../../utils');

const info = `{
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
}`;

const createContext = createContextCreatorForProvider(contextCreator);

describe('openlibrary', () => {
  it('should return books with matching title', async () => {
    const context = createContext();

    const result = await resolvers.Query.books(
      {},
      { title: 'Lord of the Rings', limit: 2 },
      context,
      info
    );

    expect(result).toMatchSnapshot();
  });

  it('should return books from given author', async () => {
    const context = createContext();

    const result = await resolvers.Query.booksFromAuthor(
      {},
      { author: 'tolkien', limit: 2 },
      context,
      info
    );

    expect(result).toMatchSnapshot();
  });
});
