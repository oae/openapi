const { create } = require('simple-oauth2');
const { openApi, pluginUtils } = require('@openapi/core');
const log = require('@openapi/core/log').child({ ns: 'kitsu:auth' });
const { name: pluginName } = require('./package.json');

const {
  auth: { clientId, clientSecret, username, password },
} = pluginUtils.getOptions(pluginName);

const { getConfig } = openApi;
const {
  db: {
    redis: { main: redis },
  },
} = getConfig();

const oauth2 = create({
  client: {
    id: clientId,
    secret: clientSecret,
  },
  auth: {
    tokenHost: 'https://kitsu.io',
    tokenPath: '/api/oauth/token',
    revokePath: '/api/oauth/revoke',
  },
});

const APP_KEY = 'oa:kitsu';
const TOKEN_WRAPPER = `${APP_KEY}:tokenwrapper`;

const setTokenWrapper = async tokenWrapper => redis.set(TOKEN_WRAPPER, tokenWrapper);
const getTokenWrapper = async () => redis.get(TOKEN_WRAPPER);

const login = async () => {
  try {
    log.info('authenticating');

    const res = await oauth2.ownerPassword.getToken({ username, password });

    if (!res) {
      throw new Error('Request error while authenticating');
    }

    const { access_token: accessToken, refresh_token: refreshToken, expires_in: expiresIn } = res;

    if (!accessToken || !refreshToken) {
      throw new Error('Did not receive token when authenticating');
    }

    const tokenObj = {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
    };

    log.info('authenticated successfully, saving token to redis');

    // access token wrapper
    await setTokenWrapper(JSON.stringify(oauth2.accessToken.create(tokenObj)));

    return accessToken;
  } catch (err) {
    log.error('error while authenticating: ', err.stack);
    throw err;
  }
};

module.exports = {
  login,
  getTokenWrapper,
};
