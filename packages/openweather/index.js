const { loadTypeDefs, loadResolvers } = require('@openapi/core/utils');

async function init() {
  return {
    typeDefs: await loadTypeDefs(__dirname, ['./openweather.type.graphql']),
    resolvers: await loadResolvers(__dirname, ['./openweather.resolver.js']),
    context: async () => {},
  };
}

module.exports = {
  init,
};
