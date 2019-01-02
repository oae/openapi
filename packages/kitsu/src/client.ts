import axios from 'axios';
import * as fp from 'lodash/fp';
import { getTokenWrapper, login } from './auth';

import { getAccessToken } from './utils';

const client = axios.create({
  baseURL: 'https://kitsu.io/api/edge',
  headers: {
    Accept: 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
  },
});

export default client;

client.interceptors.request.use(async config => {
  let accessToken = JSON.parse(await getTokenWrapper());
  // tslint:disable-next-line:prefer-conditional-expression
  if (fp.isNil(accessToken)) {
    accessToken = await login();
  } else {
    accessToken = getAccessToken(accessToken);
  }

  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});
