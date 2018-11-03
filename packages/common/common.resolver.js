const fp = require('lodash/fp');

const { openApi } = require('@openapi/core');

module.exports = {
  Query: {
    plugins: (obj, args, context, info) => {
      const { enabledPlugins } = openApi.getConfig();
      return fp.flow(
        fp.map(fp.castArray),
        fp.map(([plugin, options = {}]) => ({
          name: plugin,
        }))
      )(enabledPlugins);
    },
  },
};
