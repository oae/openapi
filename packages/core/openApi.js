const { mergeTypes, mergeResolvers } = require('merge-graphql-schemas');
const fp = require('lodash/fp');

const providerUtils = require('./providerUtils');
const { sleep } = require('./utils');

const log = require('./log').child({ ns: '@openapi/core/openApi' });

let openApiConfig = {};
const getConfig = () => openApiConfig;

const init = async config => {
  openApiConfig = config;

  const { enabledProviders } = config;

  log.info('starting server');
  try {
    // this is purely for debugging
    await sleep(process.env.NODE_ENV === 'development' ? 2000 : 0);

    log.info('initializing providers');
    const providers = await providerUtils.initProviders(enabledProviders);
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

    return { typeDefs, resolvers, context };
  } catch (err) {
    log.error('Error while starting application: ', err.stack);
  }

  return {};
};

module.exports = {
  init,
  getConfig,
};
