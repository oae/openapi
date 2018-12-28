import { IConfig } from '@openapi/core/openApi';
import * as Redis from 'ioredis';

const config: IConfig = {
  db: {
    redis: {
      main: new Redis(process.env.OA_REDIS_MAIN_URL, {
        enableReadyCheck: true,
      }),
      queue: new Redis(process.env.OA_REDIS_QUEUE_URL, {
        enableReadyCheck: true,
      }),
    },
    mongo: {},
    postgresql: {},
  },
  queue: {
    redisUrl: process.env.OA_REDIS_QUEUE_URL,
  },
  enabledPlugins: [
    '@openapi/plugin-common',
    [
      '@openapi/plugin-omdb',
      {
        auth: {
          apiKey: process.env.OA_OMDB_API_KEY,
        },
      },
    ],
    // '@openapi/plugin-openlibrary',
    // '@openapi/plugin-openrates',
    // [
    //   '@openapi/plugin-openweather',
    //   {
    //     auth: {
    //       appId: process.env.OA_OPENWEATHER_API_KEY,
    //     },
    //   },
    // ],
    // [
    //   '@openapi/plugin-tvdb',
    //   {
    //     auth: {
    //       apikey: process.env.OA_TVDB_API_KEY,
    //     },
    //   },
    // ],
    // [
    //   '@openapi/plugin-kitsu',
    //   {
    //     auth: {
    //       clientId: process.env.OA_KITSU_CLIENT_ID,
    //       clientSecret: process.env.OA_KITSU_CLIENT_SECRET,
    //       username: process.env.OA_KITSU_USERNAME,
    //       password: process.env.OA_KITSU_PASSWORD,
    //     },
    //   },
    // ],
  ],
};

export default config;
