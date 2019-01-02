import { testUtils } from '@openapi/core';
import { gql } from '@openapi/core/utils';
import { request } from 'graphql-request';

import { name as pluginName } from '../package.json';
import { Movie } from './generated/graphql.js';

let server = null;

beforeAll(async () => {
  server = await testUtils.createServer([
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
  await testUtils.destroyServer(server);
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

function testValidMovie(movie) {
  expect(movie.title).not.toBeEmpty();
  expect(movie.year).not.toBeEmpty();

  expect(movie.imdb).toBeObject();
  expect(movie.imdb.id).not.toBeEmpty();
  expect(movie.imdb.rating).not.toBeEmpty();
  expect(movie.imdb.votes).not.toBeEmpty();

  expect(movie.rated).not.toBeEmpty();
  expect(movie.released).not.toBeEmpty();
  expect(movie.runtime).not.toBeEmpty();
  expect(movie.genre).toBeArray();
  expect(movie.director).not.toBeEmpty();
  expect(movie.writer).not.toBeEmpty();
  expect(movie.actors).toBeArray();
  expect(movie.plot).not.toBeEmpty();
  expect(movie.language).toBeArray();
  expect(movie.country).toBeArray();
  expect(movie.boxOffice).not.toBeEmpty();
  expect(movie.production).not.toBeEmpty();
  expect(movie.website).not.toBeEmpty();
}

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

    const result: { movies: Movie[] } = await request(server.endpoint, query);
    expect(result.movies).toBeArray();
    result.movies.forEach(testValidMovie);
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

    const result: { movie: Movie } = await request(server.endpoint, query);
    testValidMovie(result.movie);
  });
});
