import { loadResolvers, loadTypeDefs } from '@openapi/core/utils';
import createContext from './createContext';

export async function init() {
  return {
    typeDefs: await loadTypeDefs(__dirname, ['./omdb.type.graphql']),
    resolvers: await loadResolvers(__dirname, ['./omdb.resolver']),
    context: createContext,
  };
}
