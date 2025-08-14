const jwt= require('jsonwebtoken');

export const signToken = (payload, options = {}) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d', ...options });

export const verifyToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);
export const signAccess = (payload) =>
  jwt.sign(payload, env.jwt.accessSecret, { expiresIn: env.jwt.accessTtl });

export const signRefresh = (payload) =>
  jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshTtl });

export const verifyAccess = (token) =>
  jwt.verify(token, env.jwt.accessSecret);

export const verifyRefresh = (token) =>
  jwt.verify(token, env.jwt.refreshSecret);