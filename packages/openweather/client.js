const axios = require('axios');
const { apiKey } = require('./env');

const client = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5/weather',
  params: {
    appId: apiKey,
  },
});
module.exports = client;
