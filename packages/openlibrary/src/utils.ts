import * as fp from 'lodash/fp';

const RE_ID_EXTRACT = /^(.*?)(\.?)(?:json)?$/;

export const normalizeKey = fp.curry((type, rawKey) => {
  const splits = rawKey.split('/');
  const latest = splits[splits.length - 1];
  const id = latest.match(RE_ID_EXTRACT)[1];

  return `/${type}/${id}.json`;
});

export const extractKeys = fp.flow(
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
