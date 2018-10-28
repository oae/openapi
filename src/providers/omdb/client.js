const axios = require('axios');

const { apiKey } = require('./env');

const client = axios.create({
  baseURL: 'http://www.omdbapi.com',
  params: {
    apiKey,
    type: 'movie', // tv series are provided from another provider
  },
});

module.exports = client;
