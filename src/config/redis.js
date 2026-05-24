const Redis  = require('ioredis');
const logger = require('./logger');

let redis;

const connectRedis = () => {
  // If no Redis URL is configured, skip caching gracefully
  // This lets the app run locally without Redis installed
  if (!process.env.REDIS_URL) {
    logger.warn('REDIS_URL not set — caching disabled');
    return null;
  }

  redis = new Redis(process.env.REDIS_URL, {
    // Retry connecting up to 3 times with exponential backoff
    maxRetriesPerRequest:  3,
    retryStrategy: (times) => {
      if (times > 3) return null;  // stop retrying after 3 attempts
      return Math.min(times * 200, 2000); // wait 200ms, 400ms, 2000ms
    },
    lazyConnect: true, // don't connect immediately — wait for first command
  });

  redis.on('connect', () => logger.info('✅ Redis connected'));
  redis.on('error',   (err) => logger.error('Redis error', { error: err.message }));
  redis.on('close',   () => logger.warn('Redis connection closed'));

  return redis;
};

const getRedis = () => redis;

module.exports = { connectRedis, getRedis };