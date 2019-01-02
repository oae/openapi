const { queue } = require('@openapi/core');

const { login } = require('./auth');

export const authQueue = queue.create('kitsu:auth');

authQueue.process(async () => {
  const token = await login();
  return token;
});

export async function init() {
  authQueue.add({}, { repeat: { every: 1000 * 60 * 60 * 24 } });
}
