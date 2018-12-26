import * as fp from 'lodash/fp';

const log = require('./log').default.child({ ns: '@openapi/core/pluginUtils' });

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

export const initPlugins = async pluginList => {
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
    pluginManifest: require(plugin).default,
    name: plugin,
  }));

  try {
    return Promise.all(plugins.map(initPlugin));
  } catch (err) {
    log.error(`Error while initializing plugin ${err.plugin} `, err.stack);
    throw err;
  }
};

export const getOptions = name => pluginsByName[name];

export default {
  initPlugins,
  getOptions,
};
