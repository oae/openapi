const { queue } = require('@openapi/core');

const { login } = require('./auth');

const authQueue = queue.create('tvdb:auth');

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
