/* eslint-disable global-require, import/no-dynamic-require */

const { GraphQLServer } = require('graphql-yoga');
const fp = require('lodash/fp');
const { mergeTypes, mergeResolvers } = require('merge-graphql-schemas');
const { sleep } = require('./utils');
const { initProviders } = require('./providers');

const log = require('./log').child({ ns: 'index' });

(async () => {
  try {
    // this is purely for debugging
    await sleep(process.env.NODE_ENV === 'development' ? 2000 : 0);

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
    server.start(() => {
      // eslint-disable-next-line no-console
      console.log(`Server is running at http://localhost:4000`);
    });
  } catch (err) {
    log.error('Error while starting application: ', err.stack);
  }
})();
