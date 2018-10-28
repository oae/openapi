const { loadTypeDefs, loadResolvers } = require('../../utils');
const context = require('./context');
const { enabled } = require('./env');

async function init() {
  return {
    typeDefs: await loadTypeDefs(__dirname, ['./openlibrary.type.graphql']),
    resolvers: await loadResolvers(__dirname, ['./openlibrary.resolver.js']),
    context,
  };
}

module.exports = {
  name: 'openlibrary',
  enabled,
  init,
};
