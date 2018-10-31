const axios = require('axios');

const client = axios.create({
  baseURL: 'https://api.openrates.io',
});

module.exports = client;
