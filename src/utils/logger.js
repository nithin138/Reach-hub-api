const pino = require('pino');
const pinoHttp = require('pino-http');

export const logger = pino({
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty', options: { colorize: true, translateTime: true } }
    : undefined,
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info'
});

export const httpLogger = pinoHttp({ logger, autoLogging: true });
