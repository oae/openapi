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
      expect(result).toMatchSnapshot();
    },
    20000
  );
});
