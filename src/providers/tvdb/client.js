const axios = require('axios');
const fp = require('lodash/fp');

const { getToken, login } = require('./auth');

const client = axios.create({
  baseURL: 'https://api.thetvdb.com',
});

client.interceptors.request.use(async config => {
  let token = await getToken();
  if (fp.isEmpty(token)) {
    token = await login();
  }
  // eslint-disable-next-line no-param-reassign
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

module.exports = client;
