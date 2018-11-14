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

const validSeries = {
  airedAt: expect.not.toBeEmpty(),
  airsDayOfWeek: expect.not.toBeEmpty(),
  airsTime: expect.not.toBeEmpty(),
  aliases: expect.toBeArray(),
  banner: expect.not.toBeEmpty(),
  episodes: expect.toBeArray(),
  genre: expect.toBeArray(),
  id: expect.not.toBeEmpty(),
  imdbId: expect.not.toBeEmpty(),
  name: expect.not.toBeEmpty(),
  network: expect.not.toBeEmpty(),
  overview: expect.not.toBeEmpty(),
  rating: expect.not.toBeEmpty(),
  seasons: expect.toBeArray(),
  status: expect.not.toBeEmpty(),
};

describe('tvdb', () => {
  it(
    'should return series with given name',
    async () => {
      const query = gql`
        ${fragments}
        {
          series(name: "Supernatural") {
            ...seriesFields
          }
        }
      `;
      const result = await request(server.endpoint, query);
      expect(result.series).toBeArray();
      result.series.forEach(series => expect(series).toMatchObject(validSeries));
    },
    20000
  );
});
