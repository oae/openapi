import axios from 'axios';
import * as fp from 'lodash/fp';

import { getToken, login } from './auth';

const client = axios.create({
  baseURL: 'https://api.thetvdb.com',
});

client.interceptors.request.use(async config => {
  let token = await getToken();
  if (fp.isEmpty(token)) {
    token = await login();
  }
  // eslint-disable-next-line no-param-reassign
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;
