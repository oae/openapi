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
const ACCESS_TOKEN_KEY = `${APP_KEY}:accesstoken`;
const REFRESH_TOKEN_KEY = `${APP_KEY}:refreshtoken`;

const setTokens = async (accessToken, refreshToken, expire) =>
  redis
    .multi()
    .set(ACCESS_TOKEN_KEY, accessToken)
    .set(REFRESH_TOKEN_KEY, refreshToken)
    .expire(ACCESS_TOKEN_KEY, expire)
    .expire(REFRESH_TOKEN_KEY, expire)
    .exec();
const getAccessToken = async () => redis.get(ACCESS_TOKEN_KEY);
const getRefreshToken = async () => redis.get(REFRESH_TOKEN_KEY);

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

    log.info('authenticated successfully, saving token to redis');
    await setTokens(accessToken, refreshToken, expiresIn);

    return accessToken;
  } catch (err) {
    log.error('error while authenticating: ', err.stack);
    throw err;
  }
};

module.exports = {
  login,
  getAccessToken,
  getRefreshToken,
};
