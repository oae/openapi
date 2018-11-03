const axios = require('axios');
const { getOptions } = require('@openapi/core/providerUtils');

const { name: pluginName } = require('./package.json');

const {
  auth: { appId },
} = getOptions(pluginName);

const client = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5/weather',
  params: {
    appId,
  },
});
module.exports = client;
