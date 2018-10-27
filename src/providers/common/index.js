const { loadTypeDefs, loadResolvers } = require('../../utils');

async function init() {
  return {
    typeDefs: await loadTypeDefs(__dirname, ['./scalars.graphql']),
    resolvers: await loadResolvers(__dirname, ['./scalars.resolver.js']),
    context: async () => {},
  };
}

module.exports = {
  name: 'common',
  init,
};