const axios = require('axios');

const client = axios.create({
  baseURL: 'https://api.thetvdb.com',
  headers: {
    Authorization: 'Bearer xxxx',
  },
});

module.exports = client;
