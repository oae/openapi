import { GraphQLServer } from 'graphql-yoga';
import { AddressInfo } from 'net';
import { promisify } from 'util';
import config from './config';

import * as openApi from './openApi';
import * as queue from './queue';

export const createServer = async plugins => {
  const { typeDefs, resolvers, context } = await openApi.init({
    ...config,
    enabledPlugins: ['@openapi/plugin-common', ...plugins],
  });

  const server = new GraphQLServer({ typeDefs, resolvers, context });

  // create a server on a random port
  const http = await server.start({
    port: 0,
  });
  const { port } = http.address() as AddressInfo;
  const endpoint = `http://localhost:${port}/`;

  return { http, endpoint };
};

export const destroyServer = async server => {
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
