const axios = require('axios');

const log = require('../../log').child({ namespace: 'tvdb:auth' });
const redis = require('../../redis');

const APP_KEY = 'oa:tvdb';
const TOKEN_KEY = `${APP_KEY}:token`;

const setToken = async token => redis.set(TOKEN_KEY, token);
const getToken = async () => redis.get(TOKEN_KEY);

const login = async apiKey => {
  try {
    log.info('authenticating');
    const res = await axios.post('https://api.thetvdb.com/login', {
      apikey: apiKey,
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
    log.error(err);
    throw err;
  }
};

module.exports = {
  login,
  getToken,
};
