const { loadTypeDefs, loadResolvers } = require('@openapi/core/utils');
const context = require('./context');
const queue = require('./queue');
const { enabled } = require('./env');

const config = {};

async function init(options = {}) {
  config.options = options;

  await queue.init();

  return {
    typeDefs: await loadTypeDefs(__dirname, ['./tvdb.type.graphql']),
    resolvers: await loadResolvers(__dirname, ['./tvdb.resolver.js']),
    context,
  };
}

module.exports = {
  name: 'tvdb',
  enabled,
  init,
  config,
};
