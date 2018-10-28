const path = require('path');
const fs = require('fs');
const log = require('../log').child({ ns: 'providers' });

const providers = fs
  .readdirSync(__dirname)
  .map(dir => path.resolve(__dirname, dir))
  .filter(provider => fs.statSync(provider).isDirectory())
  .map(provider => require(provider));

async function initProvider(providerManifest) {
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

async function initProviders() {
  try {
    const enabledProviders = providers.filter(providerManifest => providerManifest.enabled);
    return Promise.all(enabledProviders.map(initProvider));
  } catch (err) {
    log.error(`Error while initializing provider ${err.provider} `, err.stack);
    throw err;
  }
}

module.exports = providers;
module.exports.initProviders = initProviders;
