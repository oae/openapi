const DataLoader = require('dataloader');

const { extractKeys } = require('./utils');
const client = require('./client');

const loadKeys = async inputKeys => {
  const keys = extractKeys(inputKeys);

  return Promise.all(keys.map(key => client.get(key).then(res => res.data)));
};

module.exports = async function createContext() {
  return {
    keyLoader: new DataLoader(loadKeys),
  };
};
