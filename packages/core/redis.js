const Redis = require('ioredis');

const { mainRedisUrl, queueRedisUrl } = require('./env');

module.exports = new Redis(mainRedisUrl, {
  enableReadyCheck: true,
});

module.exports.queueRedis = new Redis(queueRedisUrl, {
  enableReadyCheck: true,
});
