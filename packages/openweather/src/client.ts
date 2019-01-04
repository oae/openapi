import { pluginUtils } from '@openapi/core';
import axios from 'axios';

import { name as pluginName } from '../package.json';

const {
  auth: { appId },
} = pluginUtils.getOptions(pluginName);

export default axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5/weather',
  params: {
    appId,
  },
});
