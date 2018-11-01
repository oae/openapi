const pino = require('pino');

const log = pino({ name: 'openapi' });

module.exports = log;
