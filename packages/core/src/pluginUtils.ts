import * as fp from 'lodash/fp';
import { PluginConfig } from './config';

const log = require('./log').createLogger('@openapi/core/pluginUtils');

let pluginsByName: { [key: string]: PluginConfig } = {};

const initPlugin = async ({ init, name }) => {
  try {
    log.info({ plugin: name }, 'initializing plugin');
    const plugin = await init();
    return {
      name,
      ...plugin,
    };
  } catch (err) {
    err.plugin = name;
    throw err;
  }
};

export const initPlugins = async (pluginList: PluginConfig[]) => {
  pluginsByName = fp.flow(
    fp.map(fp.castArray),
    fp.map(([plugin, options = {}]) => ({
      name: plugin,
      options,
    })),
    fp.reduce(
      (acc, plugin) => ({
        ...acc,
        [plugin.name as string]: plugin.options,
      }),
      {}
    )
  )(pluginList);

  const plugins = Object.keys(pluginsByName).map(plugin => ({
    init: require(plugin).init,
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
