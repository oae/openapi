/* eslint-disable global-require, import/no-dynamic-require */

const { GraphQLServer } = require('graphql-yoga');
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas');
const path = require('path');
const util = require('util');
const glob = util.promisify(require('glob'));

const PROVIDER_PATH = path.resolve(__dirname, './providers');

async function loadContextCreators() {
  const files = await glob(path.resolve(PROVIDER_PATH, `./**/*.context.js`));
  const reContextName = new RegExp(`${PROVIDER_PATH}/(.*).context.js`);
  const filesWithNames = files.map(filePath => ({
    path: filePath,
    name: filePath.match(reContextName)[1],
  }));

  return filesWithNames.reduce((acc, file) => {
    acc[file.name] = require(file.path);
    return acc;
  }, {});
}

(async () => {
  // await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    const contextCreators = await loadContextCreators();

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

    const context = () => (...contextArgs) => {
      const contextStore = {};

      return {
        async getContext(name) {
          if (!contextStore[name]) {
            const creator = contextCreators[name];
            if (!creator) {
              throw new Error(`There is no context with name ${name}`);
            }
            contextStore[name] = await creator(...contextArgs);
          }

          return contextStore[name];
        },
      };
    };

    const server = new GraphQLServer({ typeDefs, resolvers, context });
    server.start(() => console.log(`Server is running at http://localhost:4000`));
  } catch (err) {
    console.error('Error while starting application: ', err.stack);
  }
})();
