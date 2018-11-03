const axios = require('axios');

const { getOptions } = require('@openapi/core/providerUtils');
const { name: pluginName } = require('./package.json');

const {
  auth: { apiKey },
} = getOptions(pluginName);

const client = axios.create({
  baseURL: 'http://www.omdbapi.com',
  params: {
    apiKey,
    type: 'movie', // tv series are provided from another provider
  },
});

module.exports = client;
