const Queue = require('bull');
const { getConfig } = require('./server');

const create = scope => {
  const { queue } = getConfig();

  return new Queue(scope, queue.redisUrl);
};

module.exports = {
  create,
};
