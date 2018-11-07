const axios = require('axios');
const fp = require('lodash/fp');
const { getAccessToken, login } = require('./auth');

const client = axios.create({
  baseURL: 'https://kitsu.io/api/oauth/token',
  headers: {
    Accept: 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
  },
});

client.interceptors.request.use(async config => {
  let token = await getAccessToken();
  if (fp.isEmpty(token)) {
    token = await login();
  }
  // eslint-disable-next-line no-param-reassign
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

module.exports = client;
