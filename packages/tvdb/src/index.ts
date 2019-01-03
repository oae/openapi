import { loadResolvers, loadTypeDefs } from '@openapi/core/utils';
import { login } from './auth';
import createContext from './createContext';
import * as queue from './queue';

export async function init() {
  await login();
  await queue.init();

  return {
    typeDefs: await loadTypeDefs(__dirname, ['./tvdb.type.graphql']),
    resolvers: await loadResolvers(__dirname, ['./tvdb.resolver.ts']),
    context: createContext,
  };
}
