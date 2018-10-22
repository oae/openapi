const axios = require('axios');

const { TVDB_API_KEY } = require('../../env');

const client = axios.create({
  baseURL: 'https://api.thetvdb.com',
  headers: {
    Authorization: `Bearer ${TVDB_API_KEY}`,
  },
});

module.exports = client;
