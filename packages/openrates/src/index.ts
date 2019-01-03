import { loadResolvers, loadTypeDefs } from '@openapi/core/utils';

export async function init() {
  return {
    typeDefs: await loadTypeDefs(__dirname, ['./openrates.type.graphql']),
    resolvers: await loadResolvers(__dirname, ['./openrates.resolver.ts']),
    context: async () => {},
  };
}
