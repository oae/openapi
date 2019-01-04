import { GraphQLServer } from 'graphql-yoga';

import { config, openApi } from '@openapi/core';

const log = require('@openapi/core').createLogger('@openapi/server');

(async () => {
  const { typeDefs, resolvers, context } = await openApi.init(config);

  log.info('creating graphql server');
  const server = new GraphQLServer({ typeDefs, resolvers, context });
  server.start(() => {
    // tslint:disable-next-line:no-console
    console.log(`Server is running at http://localhost:4000`);
  });
})();
