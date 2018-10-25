const axios = require('axios');
const { OW_API_KEY } = require('../../env');

const client = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5/weather',
  params: {
    appId: `${OW_API_KEY}`,
  },
});
module.exports = client;
