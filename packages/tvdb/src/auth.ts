import { openApi, pluginUtils } from '@openapi/core';
import axios from 'axios';
import { name as pluginName } from '../package.json';

const log = require('@openapi/core').createLogger('tvdb:auth');

const {
  auth: { apikey },
} = pluginUtils.getOptions(pluginName);

const { getConfig } = openApi;
const {
  db: {
    redis: { main: redis },
  },
} = getConfig();

const APP_KEY = 'oa:tvdb';
const TOKEN_KEY = `${APP_KEY}:token`;

const setToken = async token => redis.set(TOKEN_KEY, token);
export const getToken = async () => redis.get(TOKEN_KEY);

export const login = async () => {
  try {
    log.info('authenticating');
    const res = await axios.post('https://api.thetvdb.com/login', {
      apikey,
    });

    if (!res.data) {
      throw new Error('Request error while authenticating');
    }

    const { token } = res.data;
    if (!token) {
      throw new Error('Did not receive token when authenticating');
    }

    log.info('authenticated successfully, saving token to redis');
    await setToken(token);

    return token;
  } catch (err) {
    log.error('error while authenticating: ', err.stack);
    throw err;
  }
};
