const { loadTypeDefs, loadResolvers } = require('@openapi/core/utils');
const context = require('./context');

async function init() {
  return {
    typeDefs: await loadTypeDefs(__dirname, ['./openlibrary.type.graphql']),
    resolvers: await loadResolvers(__dirname, ['./openlibrary.resolver.js']),
    context,
  };
}

module.exports = {
  init,
};
