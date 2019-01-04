import { utils } from '@openapi/core';
import { login } from './auth';
import * as queue from './queue';

export async function init() {
  await login();
  await queue.init();

  return {
    typeDefs: await utils.loadTypeDefs(__dirname, ['./kitsu.type.graphql']),
    resolvers: await utils.loadResolvers(__dirname, ['./kitsu.resolver.ts']),
    context: async () => {},
  };
}
