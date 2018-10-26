const fp = require('lodash/fp');
const path = require('path');
const fs = require('fs-extra');
const { mergeTypes, mergeResolvers } = require('merge-graphql-schemas');

const resolveAlias = key => (obj, args, context, info) => fp.get(key, obj);
const resolveMultiplePaths = (rootPath, files) =>
  files.map(relativePath => path.resolve(path.resolve(rootPath, relativePath)));

const loadTypeDefs = async (rootPath, files) => {
  const absolutePaths = resolveMultiplePaths(rootPath, files);
  const fileContents = await Promise.all(absolutePaths.map(file => fs.readFile(file, 'utf8')));

  return mergeTypes(fileContents);
};

const loadResolvers = async (rootPath, files) => {
  const absolutePaths = resolveMultiplePaths(rootPath, files);
  const resolversArray = absolutePaths.map(file => require(file));

  return mergeResolvers(resolversArray);
};

module.exports = {
  resolveAlias,
  resolveMultiplePaths,
  loadTypeDefs,
  loadResolvers,
};
