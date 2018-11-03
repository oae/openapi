const fp = require('lodash/fp');

const { openApi } = require('@openapi/core');

module.exports = {
  Query: {
    providers: (obj, args, context, info) => {
      const { enabledProviders } = openApi.getConfig();
      return fp.flow(
        fp.map(fp.castArray),
        fp.map(([provider, options = {}]) => ({
          name: provider,
        }))
      )(enabledProviders);
    },
  },
};
