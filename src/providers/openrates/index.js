const { loadTypeDefs, loadResolvers } = require('../../utils');
const { enabled } = require('./env');

async function init() {
  return {
    typeDefs: await loadTypeDefs(__dirname, ['./openrates.type.graphql']),
    resolvers: await loadResolvers(__dirname, ['./openrates.resolver.js']),
    context: async () => {},
  };
}

module.exports = {
  name: 'openrates',
  enabled,
  init,
};
