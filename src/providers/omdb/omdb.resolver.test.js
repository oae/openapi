const { request } = require('graphql-request');
const { createServer, destroyServer } = require('../../testUtils');

const omdbManifest = require('./');
const { gql } = require('../../utils');

let server = null;

beforeAll(async () => {
  server = await createServer([omdbManifest]);
});

afterAll(async () => {
  await destroyServer(server);
});

const movieFields = gql`
  fragment movieFields on Movie {
    title
    year
    imdb {
      id
      rating
      votes
    }
    metacritic {
      rating
    }
    rottenTomatoes {
      rating
    }
    rated
    released
    runtime
    genre
    director
    writer
    actors
    plot
    language
    country
    awards
    poster
    boxOffice
    production
    website
  }
`;

describe('omdb', () => {
  it('should return movies with title', async () => {
    const query = gql`
      ${movieFields}
      {
        movies(title: "Inception", limit: 2) {
          ...movieFields
        }
      }
    `;

    const result = await request(server.endpoint, query);
    expect(result).toMatchSnapshot();
  });

  it('should return a movie for given imdbId', async () => {
    const query = gql`
      ${movieFields}
      {
        movie(imdbId: "tt1375666") {
          ...movieFields
        }
      }
    `;

    const result = await request(server.endpoint, query);
    expect(result).toMatchSnapshot();
  });
});
