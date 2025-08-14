const jwt = require('jsonwebtoken');
const { env } = require('./env.js'); // assuming you have env variables loaded here

const signToken = (payload, options = {}) =>
  jwt.sign(payload, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRES_IN || '7d', 
    ...options 
  });

const verifyToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);

const signAccess = (payload) =>
  jwt.sign(payload, env.jwt.accessSecret, { expiresIn: env.jwt.accessTtl });

const signRefresh = (payload) =>
  jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshTtl });

const verifyAccess = (token) =>
  jwt.verify(token, env.jwt.accessSecret);

const verifyRefresh = (token) =>
  jwt.verify(token, env.jwt.refreshSecret);

module.exports = {
  signToken,
  verifyToken,
  signAccess,
  signRefresh,
  verifyAccess,
  verifyRefresh
};
