import { loadResolvers, loadTypeDefs } from '@openapi/core/utils';
import createContext from './createContext';

export async function init() {
  return {
    typeDefs: await loadTypeDefs(__dirname, ['./openlibrary.type.graphql']),
    resolvers: await loadResolvers(__dirname, ['./openlibrary.resolver.ts']),
    context: createContext,
  };
}
