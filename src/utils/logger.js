const pino = require('pino');
const pinoHttp = require('pino-http');

const logger = pino({
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty', options: { colorize: true, translateTime: true } }
    : undefined,
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info'
});

const httpLogger = pinoHttp({ logger, autoLogging: true });

module.exports = { logger, httpLogger };
