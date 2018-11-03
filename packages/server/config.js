const Redis = require('ioredis');

module.exports = {
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
  enabledProviders: [
    '@openapi/plugin-common',
    [
      '@openapi/plugin-omdb',
      {
        auth: {
          apiKey: process.env.OA_OMDB_API_KEY,
        },
      },
    ],
    '@openapi/plugin-openlibrary',
    [
      '@openapi/plugin-openweather',
      {
        auth: {
          appId: process.env.OA_OPENWEATHER_API_KEY,
        },
      },
    ],
    [
      '@openapi/plugin-tvdb',
      {
        auth: {
          apikey: process.env.OA_TVDB_API_KEY,
        },
      },
    ],
  ],
};
