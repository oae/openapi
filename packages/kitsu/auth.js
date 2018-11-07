const axios = require('axios');
const querystring = require('querystring');
const { openApi, pluginUtils } = require('@openapi/core');
const log = require('@openapi/core/log').child({ ns: 'kitsu:auth' });
const { name: pluginName } = require('./package.json');

const {
  auth: { clientId, clientSecret },
} = pluginUtils.getOptions(pluginName);

const { getConfig } = openApi;
const {
  db: {
    redis: { main: redis },
  },
} = getConfig();

const APP_KEY = 'oa:kitsu';
const TOKEN_KEY = `${APP_KEY}:token`;

const setAccessToken = async accessToken => redis.set(TOKEN_KEY, accessToken);
const getAccessToken = async () => redis.get(TOKEN_KEY);

const data = {
  grant_type: 'authorization_code',
  client_id: clientId,
  client_secret: clientSecret,
  scope: 'public',
  username: 'hltognc@gmail.com',
  password: '12345678',
};

const login = async () => {
  try {
    log.info('authenticating');
    const res = await axios.post('https://kitsu.io/api/oauth/token', querystring.stringify(data));

    if (!res.data) {
      throw new Error('Request error while authenticating');
    }

    const { access_token: accessToken } = res.data;
    if (!accessToken) {
      throw new Error('Did not receive token when authenticating');
    }

    log.info('authenticated successfully, saving token to redis');
    await setAccessToken(accessToken);

    return accessToken;
  } catch (err) {
    log.error('error while authenticating: ', err.stack);
    throw err;
  }
};

module.exports = {
  login,
  getAccessToken,
};
