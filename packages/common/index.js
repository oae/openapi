const { loadTypeDefs, loadResolvers } = require('@openapi/core/utils');

async function init() {
  return {
    typeDefs: await loadTypeDefs(__dirname, ['./scalars.graphql', './common.graphql']),
    resolvers: await loadResolvers(__dirname, ['./scalars.resolver.js', './common.resolver.js']),
    context: async () => {},
  };
}

module.exports = {
  init,
};
