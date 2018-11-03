const axios = require('axios');

const { openApi, providerUtils } = require('@openapi/core');
const log = require('@openapi/core/log').child({ ns: 'tvdb:auth' });

const { name: pluginName } = require('./package.json');

const {
  auth: { apikey },
} = providerUtils.getOptions(pluginName);

const { getConfig } = openApi;
const {
  db: {
    redis: { main: redis },
  },
} = getConfig();

const APP_KEY = 'oa:tvdb';
const TOKEN_KEY = `${APP_KEY}:token`;

const setToken = async token => redis.set(TOKEN_KEY, token);
const getToken = async () => redis.get(TOKEN_KEY);

const login = async () => {
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

module.exports = {
  login,
  getToken,
};
