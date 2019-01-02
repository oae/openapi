import { GraphQLServer } from 'graphql-yoga';

import { openApi } from '@openapi/core';
import { config } from './config';

const log = require('@openapi/core/log').createLogger('@openapi/server');

(async () => {
  const { typeDefs, resolvers, context } = await openApi.init(config);

  log.info('creating graphql server');
  const server = new GraphQLServer({ typeDefs, resolvers, context });
  server.start(() => {
    // tslint:disable-next-line:no-console
    console.log(`Server is running at http://localhost:4000`);
  });
})();
