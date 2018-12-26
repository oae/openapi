import * as fs from 'fs-extra';
import * as fp from 'lodash/fp';
import { mergeResolvers, mergeTypes } from 'merge-graphql-schemas';
import * as path from 'path';

export const sleep = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

export const resolveAlias = key => (obj, args, context, info) => fp.get(key, obj);
export const resolveMultiplePaths = (rootPath, files): string[] =>
  files.map(relativePath => path.resolve(path.resolve(rootPath, relativePath)));

export const loadTypeDefs = async (rootPath, files) => {
  const absolutePaths = resolveMultiplePaths(rootPath, files);
  const fileContents: string[] = await Promise.all(
    absolutePaths.map(file => fs.readFile(file, 'utf8'))
  );

  return mergeTypes(fileContents);
};

export const loadResolvers = async (rootPath, files) => {
  const absolutePaths = resolveMultiplePaths(rootPath, files);
  const resolversArray = absolutePaths.map(file => require(file).default);

  return mergeResolvers(resolversArray);
};

// Sorry, but we really want syntax highlighting
export const gql = String.raw;

export default {
  gql,
  loadResolvers,
  loadTypeDefs,
  resolveAlias,
  resolveMultiplePaths,
  sleep,
};
