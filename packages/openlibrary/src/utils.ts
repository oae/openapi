import * as fp from 'lodash/fp';

const RE_ID_EXTRACT = /^(.*?)(\.?)(?:json)?$/;

export const normalizeKey = fp.curry((type, rawKey) => {
  const splits = rawKey.split('/');
  const latest = splits[splits.length - 1];
  const id = latest.match(RE_ID_EXTRACT)[1];

  return `/${type}/${id}.json`;
});

export const extractKeys = (keys: Array<string | { key: string }>): string[] => {
  const extractedKeys = fp.flow(
    fp.map((key: string | { key: string }) => {
      if (!key) {
        return null;
      }

      if (typeof key === 'string') {
        return key;
      }

      if (!fp.isEmpty(key.key)) {
        return key.key;
      }

      return null;
    }),
    fp.compact
  )(keys);

  return extractedKeys as string[];
};
