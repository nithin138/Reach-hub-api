const jwt = require('jsonwebtoken');
const { redis } = require('../../config/redis.js'); // your redis connection
const User = require('./auth.model.js'); // our user model
const { env } = require('../../config/env.js');

class SessionStore {
  /**
   * Create a new session for a user
   * @param {Object} user - Mongoose user document
   * @returns {Object} - { accessToken, refreshToken }
   */
  static async createSession(user) {
    const payload = { userId: user._id, role: user.role };

    // Generate tokens
    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: '15m',
    });

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    });

    // Save refresh token in Redis with expiry
    await redis.set(
      `refresh:${user._id}`,
      refreshToken,
      'EX',
      7 * 24 * 60 * 60 // 7 days
    );

    return { accessToken, refreshToken };
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      return null;
    }
  }

  /**
   * Verify refresh token and generate new session
   */
  static async refreshSession(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
      const storedToken = await redis.get(`refresh:${decoded.userId}`);

      if (!storedToken || storedToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

      // Find user
      const user = await User.findById(decoded.userId);
      if (!user) throw new Error('User not found');

      return this.createSession(user);
    } catch (err) {
      throw new Error('Session refresh failed');
    }
  }

  /**
   * Destroy a user session
   */
  static async destroySession(userId) {
    await redis.del(`refresh:${userId}`);
    return true;
  }
}

module.exports = SessionStore;
