const fp = require('lodash/fp');

const log = require('./log').child({ ns: '@openapi/core/providers' });

async function initProvider({ providerManifest, options }) {
  try {
    log.info({ provider: providerManifest.name }, 'initializing provider');
    const provider = await providerManifest.init();
    return {
      name: providerManifest.name,
      ...provider,
    };
  } catch (err) {
    err.provider = providerManifest.name;
    throw err;
  }
}

async function initProviders(providerList) {
  const providers = fp.flow(
    fp.map(fp.castArray),
    fp.map(([provider, options = {}]) => ({ providerManifest: require(provider), options }))
  )(providerList);

  try {
    return Promise.all(providers.map(initProvider));
  } catch (err) {
    log.error(`Error while initializing provider ${err.provider} `, err.stack);
    throw err;
  }
}

module.exports = {
  initProviders,
};
