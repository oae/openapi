import { loadResolvers, loadTypeDefs } from '@openapi/core/utils';

export async function init() {
  return {
    typeDefs: await loadTypeDefs(__dirname, ['./openweather.type.graphql']),
    resolvers: await loadResolvers(__dirname, ['./openweather.resolver.ts']),
    context: async () => {},
  };
}
