/* eslint-disable global-require, import/no-dynamic-require */

const { GraphQLServer } = require('graphql-yoga');
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas');
const path = require('path');

const PROVIDER_PATH = path.resolve(__dirname, './providers');

(async () => {
  const typeDefs = mergeTypes(
    fileLoader(path.resolve(PROVIDER_PATH, `./**/*.graphql`), {
      all: true,
    })
  );

  const resolvers = mergeResolvers(
    fileLoader(path.resolve(PROVIDER_PATH, `./**/*.resolver.js`), {
      all: true,
    })
  );

  const server = new GraphQLServer({ typeDefs, resolvers });
  server.start(() => console.log(`Server is running at http://localhost:4000`));
})();
