const { loadTypeDefs, loadResolvers } = require('@openapi/core/utils');

async function init() {
  return {
    typeDefs: await loadTypeDefs(__dirname, ['./openrates.type.graphql']),
    resolvers: await loadResolvers(__dirname, ['./openrates.resolver.js']),
    context: async () => {},
  };
}

module.exports = {
  init,
};
