const { queue } = require('@openapi/core');

const { login } = require('./auth');

const authQueue = queue.create('kitsu:auth');

authQueue.process(async () => {
  const token = await login();
  return token;
});

async function init() {
  authQueue.add({}, { repeat: { every: 1000 * 60 * 60 } });
}

module.exports = {
  init,
  authQueue,
};
