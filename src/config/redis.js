const { createClient } = require('redis');
const { env } = require('./env.js');

const redis = createClient({ url: env.redisUrl });

redis.on('error', (err) => console.error('[Redis]', err));

const connectRedis = async () => {
  if (!redis.isOpen) {
    await redis.connect();
    console.log('Redis connected');
  }
};

module.exports = { redis, connectRedis };
