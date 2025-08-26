const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const ms = require('ms');
const { redis } = require('../../config/redis.js');
const User = require('./auth.model.js');
const { env } = require('../../config/env.js');

/**
 * Store a refresh session in Redis
 */
async function storeRefresh(jti, userId, ttlSec) {
  await redis.set(
    `refresh:${jti}`,
    JSON.stringify({ userId }),
    'EX',
    ttlSec
  );
}

/**
 * Consume (validate + remove) a refresh token by jti
 */
async function consumeRefresh(jti) {
  const data = await redis.get(`refresh:${jti}`);
  if (!data) return null;

  await redis.del(`refresh:${jti}`);
  return JSON.parse(data);
}

/**
 * Revoke a refresh token (invalidate without consuming)
 */
async function revokeRefresh(jti) {
  const result = await redis.del(`refresh:${jti}`);
  return result > 0;
}

/**
 * Create a new session for a user
 */
async function createSession(user) {
  const jti = crypto.randomUUID();
  const payload = { userId: user._id, role: user.role, jti };

  const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.jwt.refreshTtl || '7d',
  });

  const ttlSec = Math.floor(ms(env.jwt.refreshTtl || '7d') / 1000);
  await storeRefresh(jti, user._id.toString(), ttlSec);

  return { accessToken, refreshToken };
}

/**
 * Verify access token
 */
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Verify refresh token and generate new session
 */
async function refreshSession(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);

    const session = await consumeRefresh(decoded.jti);
    if (!session || session.userId !== decoded.userId) {
      throw new Error('Invalid or reused refresh token');
    }

    const user = await User.findById(decoded.userId);
    if (!user) throw new Error('User not found');

    return createSession(user);
  } catch {
    throw new Error('Session refresh failed');
  }
}

/**
 * Destroy a refresh token session
 */
async function destroySession(jti) {
  await revokeRefresh(jti);
  return true;
}

module.exports = {
  storeRefresh,
  consumeRefresh,
  revokeRefresh,
  createSession,
  verifyAccessToken,
  refreshSession,
  destroySession,
};
