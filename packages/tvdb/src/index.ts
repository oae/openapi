import { utils } from '@openapi/core';
import { login } from './auth';
import createContext from './createContext';
import * as queue from './queue';

export async function init() {
  await login();
  await queue.init();

  return {
    typeDefs: await utils.loadTypeDefs(__dirname, ['./tvdb.type.graphql']),
    resolvers: await utils.loadResolvers(__dirname, ['./tvdb.resolver.ts']),
    context: createContext,
  };
}
