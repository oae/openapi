import { utils } from '@openapi/core';

export async function init() {
  return {
    typeDefs: await utils.loadTypeDefs(__dirname, ['./scalars.graphql', './common.graphql']),
    resolvers: await utils.loadResolvers(__dirname, [
      './scalars.resolver.ts',
      './common.resolver.ts',
    ]),
    context: async () => {},
  };
}
