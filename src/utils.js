const fp = require('lodash/fp');

exports.resolveAlias = key => (obj, args, context, info) => fp.get(key, obj);
