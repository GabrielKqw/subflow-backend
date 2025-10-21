import Redis from 'ioredis';
import { logger } from './logger';

const REDIS_ENABLED = process.env.REDIS_ENABLED !== 'false';

let redis: Redis | null = null;

if (REDIS_ENABLED) {
  redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    retryStrategy: (times) => {
      if (times > 3) {
        logger.warn('Redis not available, running without cache');
        return null;
      }
      return Math.min(times * 50, 2000);
    },
    maxRetriesPerRequest: 3,
  });

  redis.on('connect', () => {
    logger.info('Redis connected successfully');
  });

  redis.on('error', () => {
    logger.warn('Redis connection error, running without cache');
  });

  process.on('beforeExit', () => {
    if (redis) {
      redis.disconnect();
      logger.info('Redis disconnected');
    }
  });
} else {
  logger.info('Redis disabled, running without cache');
}

export default redis;

