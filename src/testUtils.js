const { GraphQLServer } = require('graphql-yoga');
const { promisify } = require('util');
const fp = require('lodash/fp');
const { mergeTypes, mergeResolvers } = require('merge-graphql-schemas');

const commonManifest = require('./providers/common');

const initProvider = async providerManifest => {
  try {
    const provider = await providerManifest.init();
    return {
      name: providerManifest.name,
      ...provider,
    };
  } catch (err) {
    err.provider = providerManifest.name;
    throw err;
  }
};

const initProviders = async providers => Promise.all(providers.map(initProvider));

const createConfig = async providerManifests => {
  const providers = await initProviders(providerManifests);
  const providersByName = providers.reduce((acc, provider) => {
    acc[provider.name] = provider;
    return acc;
  }, {});

  const typeDefs = mergeTypes(providers.map(provider => provider.typeDefs));
  const resolvers = mergeResolvers(providers.map(provider => provider.resolvers));
  const context = () => (...contextArgs) => {
    const contextStore = {};

    return {
      async getContext(name) {
        if (!contextStore[name]) {
          const provider = providersByName[name];
          if (!provider) {
            throw new Error(`There is no provider with name ${name}`);
          }

          const creator = provider.context;
          if (!fp.isFunction(creator)) {
            throw new Error(`Provider ${name} doesn't define any context`);
          }
          contextStore[name] = await creator(...contextArgs);
        }

        return contextStore[name];
      },
    };
  };

  return { typeDefs, resolvers, context };
};

const createServer = async providerManifests => {
  // this will be better when we merge with workspaces branch
  const serverConfig = await createConfig([commonManifest, ...providerManifests]);
  const server = new GraphQLServer(serverConfig);

  // create a server on a random port
  const http = await server.start({
    port: 0,
  });
  const { port } = http.address();
  const endpoint = `http://localhost:${port}/`;

  return { http, endpoint };
};

const destroyServer = async ({ http }) => {
  if (http && http.close) {
    await promisify(http.close).call(http);
  }
};

module.exports = {
  createServer,
  destroyServer,
};
