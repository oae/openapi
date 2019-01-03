import * as DataLoader from 'dataloader';

import client from './client';
import { extractKeys } from './utils';

const loadKeys = async inputKeys => {
  const keys = extractKeys(inputKeys);

  return Promise.all(keys.map(key => client.get(key).then(res => res.data)));
};

export default async function createContext() {
  return {
    keyLoader: new DataLoader(loadKeys),
  };
}
