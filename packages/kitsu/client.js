const axios = require('axios');
const fp = require('lodash/fp');
const { getTokenWrapper, login } = require('./auth');

const { getAccessToken } = require('./utils');

const client = axios.create({
  baseURL: 'https://kitsu.io/api/edge',
  headers: {
    Accept: 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
  },
});

client.interceptors.request.use(async config => {
  let accessToken = JSON.parse(await getTokenWrapper());
  if (fp.isNil(accessToken)) {
    accessToken = await login();
  } else {
    accessToken = getAccessToken(accessToken);
  }

  // eslint-disable-next-line no-param-reassign
  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

module.exports = client;
