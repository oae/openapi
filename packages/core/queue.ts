import * as Queue from 'bull';
import { getConfig } from './openApi';

let queues = [];
export const create = scope => {
  const { queue } = getConfig();

  const q = new Queue(scope, queue.redisUrl);
  queues.push(q);

  return q;
};

export const closeAll = async () => {
  await Promise.all(queues.map(q => q.close()));
  queues = [];
};

export default {
  create,
  closeAll,
};
