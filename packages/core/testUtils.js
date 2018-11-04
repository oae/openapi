const { promisify } = require('util');
const { GraphQLServer } = require('graphql-yoga');
const config = require('@openapi/server/config');

const openApi = require('./openApi');
const queue = require('./queue');

const createServer = async plugins => {
  const { typeDefs, resolvers, context } = await openApi.init({
    ...config,
    enabledPlugins: ['@openapi/plugin-common', ...plugins],
  });

  const server = new GraphQLServer({ typeDefs, resolvers, context });

  // create a server on a random port
  const http = await server.start({
    port: 0,
  });
  const { port } = http.address();
  const endpoint = `http://localhost:${port}/`;

  return { http, endpoint };
};

const destroyServer = async server => {
  if (!server || !server.http) {
    return;
  }

  const { http } = server;

  if (http && http.close) {
    await promisify(http.close).call(http);
  }

  if (config.db && config.db.redis && config.db.redis.main) {
    await config.db.redis.main.disconnect();
  }

  if (config.db && config.db.redis && config.db.redis.queue) {
    await config.db.redis.queue.disconnect();
  }

  await queue.closeAll();
};

module.exports = {
  createServer,
  destroyServer,
};
