const Queue = require('bull');
const { getConfig } = require('./openApi');

let queues = [];
const create = scope => {
  const { queue } = getConfig();

  const q = new Queue(scope, queue.redisUrl);
  queues.push(q);

  return q;
};

const closeAll = async () => {
  await Promise.all(queues.map(q => q.close()));
  queues = [];
};

module.exports = {
  create,
  closeAll,
};
