import { gql, testUtils } from '@openapi/core';
import { request } from 'graphql-request';

import { name as pluginName } from '../package.json';
import { Query } from './generated/graphql.js';

let server = null;

beforeAll(async () => {
  server = await testUtils.createServer([
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
  await testUtils.destroyServer(server);
});

const animeImageFields = gql`
  fragment animeImageFields on AnimeImage {
    tiny
    small
    medium
    large
    original
  }
`;

const categoryFields = gql`
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
`;

const animeFields = gql`
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

function testValidAnime(anime) {
  expect(anime.title).toBeObject();
  expect(anime.slug).not.toBeEmpty();
  expect(anime.synopsis).not.toBeEmpty();
  expect(anime.createdAt).not.toBeEmpty();
  expect(anime.updatedAt).not.toBeEmpty();
  expect(anime.status).not.toBeEmpty();
  expect(anime.averageRating).toBeNumber();
  expect(anime.startDate).not.toBeEmpty();
  expect(anime.endDate).not.toBeEmpty();
  expect(anime.posterImage).toBeObject();
  expect(anime.nsfw).toBeBoolean();
  expect(anime.categories).toBeArray();
}

function testValidCategory(category) {
  expect(category.title).not.toBeEmpty();
  expect(category.slug).not.toBeEmpty();
  expect(category.nsfw).toBeBoolean();
  expect(category.createdAt).not.toBeEmpty();
  expect(category.updatedAt).not.toBeEmpty();
}

describe('kitsu', () => {
  it('should return categories', async () => {
    const query = gql`
      ${animeImageFields}
      ${categoryFields}
      {
        animeCategories(limit: 2, skip: 3) {
          ...categoryFields
        }
      }
    `;
    const result: Query = await request(server.endpoint, query);
    expect(result.animeCategories).toBeArray();
    result.animeCategories.forEach(testValidCategory);
  });

  it('should return animes', async () => {
    const query = gql`
      ${animeImageFields}
      ${categoryFields}
      ${animeFields}
      {
        animes(limit: 2, skip: 3) {
          ...animeFields
        }
      }
    `;
    const result: Query = await request(server.endpoint, query);
    expect(result.animes).toBeArray();
    result.animes.forEach(testValidAnime);
  });

  it('should return animes as far as limit', async () => {
    const query = gql`
      {
        animes(limit: 5, skip: 3) {
          nsfw
        }
      }
    `;
    const result: Query = await request(server.endpoint, query);
    expect(result.animes).toHaveLength(5);
  });

  it('should return trending animes', async () => {
    const query = gql`
      ${animeImageFields}
      ${categoryFields}
      ${animeFields}
      {
        trendingAnimes {
          ...animeFields
        }
      }
    `;
    const result: Query = await request(server.endpoint, query);
    expect(result.trendingAnimes).toBeArray();
    result.trendingAnimes.forEach(testValidAnime);
  });
});
