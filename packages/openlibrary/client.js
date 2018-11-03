const axios = require('axios');

const client = axios.create({
  baseURL: 'https://openlibrary.org',
});

module.exports = client;
