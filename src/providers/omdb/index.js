const { loadTypeDefs, loadResolvers } = require('../../utils');
const context = require('./context');

async function init() {
  return {
    typeDefs: await loadTypeDefs(__dirname, ['./omdb.type.graphql']),
    resolvers: await loadResolvers(__dirname, ['./omdb.resolver.js']),
    context,
  };
}

module.exports = {
  name: 'omdb',
  init,
};
