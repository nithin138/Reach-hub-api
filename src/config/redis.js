import { createClient } from 'redis';
import { env } from './env.js';

export const redis = createClient({ url: env.redisUrl });
redis.on('error', (err) => console.error('[Redis]', err));

export const connectRedis = async () => {
  if (!redis.isOpen) await redis.connect();
  console.log('Redis connected');
};
