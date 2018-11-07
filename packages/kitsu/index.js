const { loadTypeDefs, loadResolvers } = require('@openapi/core/utils');

async function init() {
  return {
    typeDefs: await loadTypeDefs(__dirname, ['./kitsu.type.graphql']),
    resolvers: await loadResolvers(__dirname, ['./kitsu.resolver.js']),
    context: async () => {},
  };
}

module.exports = {
  init,
};
