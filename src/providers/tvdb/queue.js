const Queue = require('bull');
const { REDIS_QUEUE_URL, TVDB_API_KEY } = require('../../env');
const { login } = require('./auth');

const authQueue = new Queue('tvdb:auth', REDIS_QUEUE_URL);

authQueue.process(async () => {
  const token = await login(TVDB_API_KEY);
  return token;
});

async function init() {
  authQueue.add({}, { repeat: { every: 1000 * 60 * 5 } });
}

module.exports = {
  init,
  authQueue,
};
