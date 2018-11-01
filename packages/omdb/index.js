const { loadTypeDefs, loadResolvers } = require('@openapi/core/utils');
const context = require('./context');
const { enabled } = require('./env');

async function init() {
  return {
    typeDefs: await loadTypeDefs(__dirname, ['./omdb.type.graphql']),
    resolvers: await loadResolvers(__dirname, ['./omdb.resolver.js']),
    context,
  };
}

module.exports = {
  name: 'omdb',
  enabled,
  init,
};
