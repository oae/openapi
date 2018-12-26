import { loadResolvers, loadTypeDefs } from '@openapi/core/utils';

async function init() {
  return {
    typeDefs: await loadTypeDefs(__dirname, ['./scalars.graphql', './common.graphql']),
    resolvers: await loadResolvers(__dirname, ['./scalars.resolver.ts', './common.resolver.ts']),
    context: async () => {},
  };
}

export default {
  init,
};
