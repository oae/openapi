const { request } = require('graphql-request');
const { gql } = require('@openapi/core/utils');
const { createServer, destroyServer } = require('@openapi/core/testUtils');

const { name: pluginName } = require('./package.json');

let server = null;

beforeAll(async () => {
  server = await createServer([
    [
      pluginName,
      {
        auth: {
          apiKey: process.env.OA_OMDB_API_KEY,
        },
      },
    ],
  ]);
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

const validMovie = {
  title: expect.not.toBeEmpty(),
  year: expect.not.toBeEmpty(),
  imdb: {
    id: expect.not.toBeEmpty(),
    rating: expect.not.toBeEmpty(),
    votes: expect.not.toBeEmpty(),
  },
  rated: expect.not.toBeEmpty(),
  released: expect.not.toBeEmpty(),
  runtime: expect.not.toBeEmpty(),
  genre: expect.toBeArray(),
  director: expect.not.toBeEmpty(),
  writer: expect.not.toBeEmpty(),
  actors: expect.toBeArray(),
  plot: expect.not.toBeEmpty(),
  language: expect.toBeArray(),
  country: expect.toBeArray(),
  boxOffice: expect.not.toBeEmpty(),
  production: expect.not.toBeEmpty(),
  website: expect.not.toBeEmpty(),
};

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
    expect(result.movies).toBeArray();
    expect(result.movies[0]).toMatchObject(validMovie);
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
    expect(result.movie).toMatchObject(validMovie);
  });
});
