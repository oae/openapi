const fp = require('lodash/fp');

const log = require('./log').child({ ns: '@openapi/core/providers' });

let providersByName = [];

const initProvider = async ({ providerManifest, name }) => {
  try {
    log.info({ provider: name }, 'initializing provider');
    const provider = await providerManifest.init();
    return {
      name,
      ...provider,
    };
  } catch (err) {
    err.provider = name;
    throw err;
  }
};

const initProviders = async providerList => {
  providersByName = fp.flow(
    fp.map(fp.castArray),
    fp.map(([provider, options = {}]) => ({
      name: provider,
      options,
    })),
    fp.reduce(
      (acc, provider) => ({
        ...acc,
        [provider.name]: provider.options,
      }),
      {}
    )
  )(providerList);

  const providers = Object.keys(providersByName).map(provider => ({
    providerManifest: require(provider),
    name: provider,
  }));

  try {
    return Promise.all(providers.map(initProvider));
  } catch (err) {
    log.error(`Error while initializing provider ${err.provider} `, err.stack);
    throw err;
  }
};

const getOptions = name => providersByName[name];

module.exports = {
  initProviders,
  getOptions,
};
