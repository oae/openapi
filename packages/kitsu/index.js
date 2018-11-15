const { loadTypeDefs, loadResolvers } = require('@openapi/core/utils');
const queue = require('./queue');
const { login } = require('./auth');

async function init() {
  await login();
  await queue.init();

  return {
    typeDefs: await loadTypeDefs(__dirname, ['./kitsu.type.graphql']),
    resolvers: await loadResolvers(__dirname, ['./kitsu.resolver.js']),
    context: async () => {},
  };
}

module.exports = {
  init,
};
