import axios from 'axios';

import { pluginUtils } from '@openapi/core';

import { name as pluginName } from '../package.json';

const {
  auth: { apiKey },
} = pluginUtils.getOptions(pluginName);

const client = axios.create({
  baseURL: 'http://www.omdbapi.com',
  params: {
    apiKey,
    type: 'movie', // tv series are provided from another plugin
  },
});

export default client;
