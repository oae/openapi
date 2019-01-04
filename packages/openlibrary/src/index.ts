import { utils } from '@openapi/core';
import createContext from './createContext';

export async function init() {
  return {
    typeDefs: await utils.loadTypeDefs(__dirname, ['./openlibrary.type.graphql']),
    resolvers: await utils.loadResolvers(__dirname, ['./openlibrary.resolver.ts']),
    context: createContext,
  };
}
