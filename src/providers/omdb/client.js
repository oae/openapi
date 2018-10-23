const axios = require('axios');

const { OMDB_API_KEY } = require('../../env');

const client = axios.create({
  baseURL: 'http://www.omdbapi.com',
  params: {
    apikey: OMDB_API_KEY,
    type: 'movie', // tv series are provided from another provider
  },
});

module.exports = client;
