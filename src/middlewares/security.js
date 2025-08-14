const helmet = require('helmet');
const hpp = require('hpp');
const compression = require('compression');
const rateLimit = require('express-rate-limit');


export const security = [
  helmet(),
  hpp(),
  compression(),
];

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300, // 300 req / 15min per IP
  standardHeaders: true,
  legacyHeaders: false
});
