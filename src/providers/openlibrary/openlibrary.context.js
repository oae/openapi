const DataLoader = require('dataloader');
const fp = require('lodash/fp');

const client = require('./client');

const extractKeys = fp.flow(
  fp.map(key => {
    if (fp.isObject(key) && !fp.isEmpty(key.key)) {
      return key.key;
    }

    if (!fp.isEmpty(key)) {
      return key;
    }

    return null;
  }),
  fp.compact
);

const loadKeys = async inputKeys => {
  const keys = extractKeys(inputKeys);

  return Promise.all(keys.map(key => client.get(key)));
};

module.exports = async function createContext() {
  return {
    keyLoader: new DataLoader(loadKeys),
  };
};
