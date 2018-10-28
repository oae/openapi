const providers = require('../');

module.exports = {
  Query: {
    providers: (obj, args, context, info) => providers,
  },
};
