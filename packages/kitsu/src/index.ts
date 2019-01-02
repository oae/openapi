import { loadResolvers, loadTypeDefs } from '@openapi/core/utils';
import { login } from './auth';
import * as queue from './queue';

export async function init() {
  await login();
  await queue.init();

  return {
    typeDefs: await loadTypeDefs(__dirname, ['./kitsu.type.graphql']),
    resolvers: await loadResolvers(__dirname, ['./kitsu.resolver.ts']),
    context: async () => {},
  };
}
