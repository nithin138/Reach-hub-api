const helmet = require('helmet');
const hpp = require('hpp');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const security = [
  helmet(),
  hpp(),
  compression(),
];

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300, // 300 req / 15min per IP
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { security, apiLimiter };
