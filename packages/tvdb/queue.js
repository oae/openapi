const Queue = require('bull');
const { queueRedisUrl } = require('@openapi/core/env');
const { login } = require('./auth');

const authQueue = new Queue('tvdb:auth', queueRedisUrl);

authQueue.process(async () => {
  const token = await login();
  return token;
});

async function init() {
  authQueue.add({}, { repeat: { every: 1000 * 60 * 5 } });
}

module.exports = {
  init,
  authQueue,
};
