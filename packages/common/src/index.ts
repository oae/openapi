import { loadResolvers, loadTypeDefs } from '@openapi/core/utils';

export async function init() {
  return {
    typeDefs: await loadTypeDefs(__dirname, ['./scalars.graphql', './common.graphql']),
    resolvers: await loadResolvers(__dirname, ['./scalars.resolver.ts', './common.resolver.ts']),
    context: async () => {},
  };
}
