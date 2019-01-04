import * as pino from 'pino';

export const log = pino({ name: 'openapi' });

export const createLogger = (ns = 'openapi', options = {}) =>
  log.child({
    ...options,
    ns,
  });
