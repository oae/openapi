import { queue } from '@openapi/core';

import { login } from './auth';

export const authQueue = queue.create('tvdb:auth');

authQueue.process(async () => {
  const token = await login();
  return token;
});

export async function init() {
  authQueue.add({}, { repeat: { every: 1000 * 60 * 5 } });
}
