const { GraphQLServer } = require('graphql-yoga');

const { openApi } = require('@openapi/core');
const log = require('@openapi/core/log').child({ ns: '@openapi/server' });

const config = require('./config');

(async () => {
  const { typeDefs, resolvers, context } = await openApi.init(config);

  log.info('creating graphql server');
  const server = new GraphQLServer({ typeDefs, resolvers, context });
  server.start(() => {
    // eslint-disable-next-line no-console
    console.log(`Server is running at http://localhost:4000`);
  });
})();
