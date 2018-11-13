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
          clientId: process.env.OA_KITSU_CLIENT_ID,
          clientSecret: process.env.OA_KITSU_CLIENT_SECRET,
          username: process.env.OA_KITSU_USERNAME,
          password: process.env.OA_KITSU_PASSWORD,
        },
      },
    ],
  ]);
});

afterAll(async () => {
  await destroyServer(server);
});

const fragments = gql`
  fragment animeImageFields on AnimeImage {
    tiny
    small
    medium
    large
    original
  }

  fragment categoryFields on Category {
    title
    description
    slug
    nsfw
    cover {
      ...animeImageFields
    }
    createdAt
    updatedAt
  }

  fragment animeFields on Anime {
    title {
      en
      enJp
      jaJp
      canonicalTitle
    }
    slug
    synopsis
    createdAt
    updatedAt
    status
    averageRating
    startDate
    endDate
    posterImage {
      ...animeImageFields
    }
    coverImage {
      ...animeImageFields
    }
    episodeCount
    nsfw
    categories {
      ...categoryFields
    }
  }
`;

const validAnimes = {
  title: expect.toBeObject(),
  slug: expect.not.toBeEmpty(),
  synopsis: expect.not.toBeEmpty(),
  createdAt: expect.not.toBeEmpty(),
  updatedAt: expect.not.toBeEmpty(),
  status: expect.not.toBeEmpty(),
  averageRating: expect.toBeNumber(),
  startDate: expect.not.toBeEmpty(),
  endDate: expect.not.toBeEmpty(),
  posterImage: expect.toBeObject(),
  coverImage: expect.toBeObject(),
  episodeCount: expect.toBeNumber(),
  nsfw: expect.toBeBoolean(),
  categories: expect.toBeArray(),
};

describe('kitsu', () => {
  it('should return categories', async () => {
    const query = gql`
      {
        animeCategories(limit: 1) {
          title
          description
          slug
          nsfw
          cover {
            tiny
            small
            medium
            large
            original
          }
          createdAt
          updatedAt
        }
      }
    `;
    const result = await request(server.endpoint, query);
    expect(result).toMatchSnapshot();
  });

  it('should return animes', async () => {
    const query = gql`
      ${fragments}
      {
        animes(limit: 1) {
          ...animeFields
        }
      }
    `;
    const result = await request(server.endpoint, query);
    expect(result).toMatchSnapshot();
  });

  it('should return animes as far as limit', async () => {
    const query = gql`
      {
        animes(limit: 30) {
          nsfw
        }
      }
    `;
    const result = await request(server.endpoint, query);
    expect(result.animes).toHaveLength(30);
  });

  it('should return trending animes', async () => {
    const query = gql`
      ${fragments}
      {
        trendingAnimes {
          ...animeFields
        }
      }
    `;
    const result = await request(server.endpoint, query);
    expect(result.trendingAnimes).toBeArray();
    expect(result.trendingAnimes[0]).toMatchObject(validAnimes);
  });
});
