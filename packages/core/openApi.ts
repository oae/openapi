import * as fp from 'lodash/fp';
import { mergeResolvers, mergeTypes } from 'merge-graphql-schemas';

import * as pluginUtils from './pluginUtils';
import { sleep } from './utils';

const log = require('./log').default.child({ ns: '@openapi/core/openApi' });

export interface IConfig {
  db?: {
    redis?: {
      main?: any;
      queue?: any;
    };
    mongo?: any;
    postgresql: {};
  };
  queue?: {
    redisUrl: string;
  };
  enabledPlugins?: any[];
}

let openApiConfig: IConfig = {};
export const getConfig = () => openApiConfig;

export const init = async (config: IConfig) => {
  openApiConfig = config;

  const { enabledPlugins } = config;

  log.info('initializing openapi');
  try {
    // this is purely for debugging
    await sleep(process.env.NODE_ENV === 'development' ? 2000 : 0);

    log.info('initializing plugins');
    const plugins = await pluginUtils.initPlugins(enabledPlugins);
    const pluginsByName = plugins.reduce((acc, plugin) => {
      acc[plugin.name] = plugin;
      return acc;
    }, {});

    log.info('creating merged typeDefs');
    const typeDefs = mergeTypes(plugins.map(plugin => plugin.typeDefs));

    log.info('creating merged resolvers');
    const resolvers = mergeResolvers(plugins.map(plugin => plugin.resolvers));

    const context = () => (...contextArgs) => {
      const contextStore = {};

      return {
        async getContext(name) {
          if (!contextStore[name]) {
            const plugin = pluginsByName[name];
            if (!plugin) {
              throw new Error(`There is no plugin with name ${name}`);
            }

            const creator = plugin.context;
            if (!fp.isFunction(creator)) {
              throw new Error(`Plugin ${name} doesn't define any context`);
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

export default {
  init,
  getConfig,
};
