import { utils } from '@openapi/core';

export async function init() {
  return {
    typeDefs: await utils.loadTypeDefs(__dirname, ['./openrates.type.graphql']),
    resolvers: await utils.loadResolvers(__dirname, ['./openrates.resolver.ts']),
    context: async () => {},
  };
}
