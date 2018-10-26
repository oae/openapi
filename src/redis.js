const Redis = require('ioredis');

const { REDIS_MAIN_URL, REDIS_QUEUE_URL } = require('./env');

module.exports = new Redis(REDIS_MAIN_URL, {
  enableReadyCheck: true,
});

module.exports.queueRedis = new Redis(REDIS_QUEUE_URL, {
  enableReadyCheck: true,
});
