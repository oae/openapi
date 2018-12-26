import { openApi } from '@openapi/core';
import * as fp from 'lodash/fp';

export default {
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
