const axios = require('axios');
const fp = require('lodash/fp');
const { getAccessToken, login } = require('./auth');

const client = axios.create({
  baseURL: 'https://kitsu.io/api/edge',
  headers: {
    Accept: 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
  },
});

client.interceptors.request.use(async config => {
  let accessToken = await getAccessToken();
  if (fp.isEmpty(accessToken)) {
    accessToken = await login();
  }
  // eslint-disable-next-line no-param-reassign
  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

module.exports = client;
