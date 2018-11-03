const fp = require('lodash/fp');

const log = require('./log').child({ ns: '@openapi/core/pluginUtils' });

let pluginsByName = [];

const initPlugin = async ({ pluginManifest, name }) => {
  try {
    log.info({ plugin: name }, 'initializing plugin');
    const plugin = await pluginManifest.init();
    return {
      name,
      ...plugin,
    };
  } catch (err) {
    err.plugin = name;
    throw err;
  }
};

const initPlugins = async pluginList => {
  pluginsByName = fp.flow(
    fp.map(fp.castArray),
    fp.map(([plugin, options = {}]) => ({
      name: plugin,
      options,
    })),
    fp.reduce(
      (acc, plugin) => ({
        ...acc,
        [plugin.name]: plugin.options,
      }),
      {}
    )
  )(pluginList);

  const plugins = Object.keys(pluginsByName).map(plugin => ({
    pluginManifest: require(plugin),
    name: plugin,
  }));

  try {
    return Promise.all(plugins.map(initPlugin));
  } catch (err) {
    log.error(`Error while initializing plugin ${err.plugin} `, err.stack);
    throw err;
  }
};

const getOptions = name => pluginsByName[name];

module.exports = {
  initPlugins,
  getOptions,
};
