import { utils } from '@openapi/core';

export async function init() {
  return {
    typeDefs: await utils.loadTypeDefs(__dirname, ['./openweather.type.graphql']),
    resolvers: await utils.loadResolvers(__dirname, ['./openweather.resolver.ts']),
    context: async () => {},
  };
}
