/* eslint-disable global-require, import/no-dynamic-require */

const { GraphQLServer } = require('graphql-yoga');
const fp = require('lodash/fp');
const { mergeTypes, mergeResolvers } = require('merge-graphql-schemas');
const path = require('path');
const fs = require('fs-extra');

const log = require('./log').child({ namespace: 'index' });

const PROVIDER_PATH = path.resolve(__dirname, './providers');

async function getProviders() {
  const relativePaths = await fs.readdir(PROVIDER_PATH);
  return relativePaths.map(relativePath => require(path.resolve(PROVIDER_PATH, relativePath)));
}

async function initProviders() {
  try {
    const providers = await getProviders();
    return Promise.all(
      providers.map(async providerManifest => {
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
      })
    );
  } catch (err) {
    log.error(`Error while initializing provider ${err.provider} `, err.stack);
    throw err;
  }
}

(async () => {
  try {
    log.info('initializing providers');
    const providers = await initProviders();
    const providersByName = providers.reduce((acc, provider) => {
      acc[provider.name] = provider;
      return acc;
    }, {});

    log.info('creating merged typeDefs');
    const typeDefs = mergeTypes(providers.map(provider => provider.typeDefs));

    log.info('creating merged resolvers');
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

    log.info('creating graphql server');
    const server = new GraphQLServer({ typeDefs, resolvers, context });
    server.start(() => log.info(`Server is running at http://localhost:4000`));
  } catch (err) {
    log.error('Error while starting application: ', err.stack);
  }
})();
