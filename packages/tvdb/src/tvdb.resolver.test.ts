import { createServer, destroyServer } from '@openapi/core/testUtils';
import { gql } from '@openapi/core/utils';
import { request } from 'graphql-request';

import { name as pluginName } from '../package.json';
import { Query } from './generated/graphql.js';

let server = null;

beforeAll(async () => {
  server = await createServer([
    [
      pluginName,
      {
        auth: {
          apikey: process.env.OA_TVDB_API_KEY,
        },
      },
    ],
  ]);
});

afterAll(async () => {
  await destroyServer(server);
});

const fragments = gql`
  fragment episodeFields on Episode {
    absoluteNumber
    airedAt
    artwork
    directors
    guestStars
    imdbId
    name
    overview
    relativeNumber
    season
    writers
  }

  fragment seriesFields on Series {
    airedAt
    airsDayOfWeek
    airsTime
    aliases
    banner
    episodes {
      ...episodeFields
    }
    genre
    id
    imdbId
    name
    network
    overview
    rating
    seasons {
      episodes {
        ...episodeFields
      }
      number
    }
    status
  }
`;

function testValidSeries(item) {
  expect(item.airedAt).not.toBeEmpty();
  expect(item.airsDayOfWeek).not.toBeEmpty();
  expect(item.airsTime).not.toBeEmpty();
  expect(item.aliases).toBeArray();
  expect(item.banner).not.toBeEmpty();
  expect(item.episodes).toBeArray();
  expect(item.genre).toBeArray();
  expect(item.id).not.toBeEmpty();
  expect(item.imdbId).not.toBeEmpty();
  expect(item.name).not.toBeEmpty();
  expect(item.network).not.toBeEmpty();
  expect(item.overview).not.toBeEmpty();
  expect(item.rating).not.toBeEmpty();
  expect(item.seasons).toBeArray();
  expect(item.status).not.toBeEmpty();
}

describe('tvdb', () => {
  it('should return series with given name', async () => {
    const query = gql`
      ${fragments}
      {
        series(name: "Game Of Thrones") {
          ...seriesFields
        }
      }
    `;
    const result: Query = await request(server.endpoint, query);
    expect(result.series).toBeArray();
    result.series.forEach(testValidSeries);
  }, 20000);
});
