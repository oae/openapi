const { loadTypeDefs, loadResolvers } = require('@openapi/core/utils');
const context = require('./context');
const queue = require('./queue');

async function init() {
  await queue.init();

  return {
    typeDefs: await loadTypeDefs(__dirname, ['./tvdb.type.graphql']),
    resolvers: await loadResolvers(__dirname, ['./tvdb.resolver.js']),
    context,
  };
}

module.exports = {
  init,
};
