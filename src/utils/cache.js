const { getRedis } = require('../config/redis');
const logger       = require('../config/logger');

const DEFAULT_TTL = parseInt(process.env.CACHE_TTL_SECONDS) || 300; // 5 minutes

// ─── Get from cache ───────────────────────────────────────────────────────────
const getCache = async (key) => {
  const redis = getRedis();
  if (!redis) return null; // Redis not available — skip cache

  try {
    const cached = await redis.get(key);
    if (cached) {
      logger.debug('Cache HIT', { key });
      return JSON.parse(cached);
    }
    logger.debug('Cache MISS', { key });
    return null;
  } catch (err) {
    // CRITICAL: cache failures must never break the app
    // Log the error and fall through to the DB query
    logger.error('Cache get error', { key, error: err.message });
    return null;
  }
};

// ─── Set in cache ─────────────────────────────────────────────────────────────
const setCache = async (key, data, ttl = DEFAULT_TTL) => {
  const redis = getRedis();
  if (!redis) return;

  try {
    // EX = expire in N seconds
    await redis.set(key, JSON.stringify(data), 'EX', ttl);
    logger.debug('Cache SET', { key, ttl });
  } catch (err) {
    logger.error('Cache set error', { key, error: err.message });
  }
};

// ─── Delete from cache ────────────────────────────────────────────────────────
const deleteCache = async (key) => {
  const redis = getRedis();
  if (!redis) return;

  try {
    await redis.del(key);
    logger.debug('Cache DELETE', { key });
  } catch (err) {
    logger.error('Cache delete error', { key, error: err.message });
  }
};

// ─── Delete multiple keys by pattern ─────────────────────────────────────────
// e.g. deleteByPattern('destinations:*') clears all destination cache entries
const deleteByPattern = async (pattern) => {
  const redis = getRedis();
  if (!redis) return;

  try {
    // SCAN is safe for production — never use KEYS in production (blocks Redis)
    const stream = redis.scanStream({ match: pattern, count: 100 });
    stream.on('data', async (keys) => {
      if (keys.length > 0) {
        await redis.del(...keys);
        logger.debug('Cache pattern DELETE', { pattern, count: keys.length });
      }
    });
  } catch (err) {
    logger.error('Cache pattern delete error', { pattern, error: err.message });
  }
};

// ─── Cache key factory — centralised, consistent naming ──────────────────────
// Never write raw strings as cache keys — use this factory
// Consistent naming prevents typos and key collisions
const cacheKeys = {
  featured:          (limit)    => `destinations:featured:${limit}`,
  destination:       (slug)     => `destinations:slug:${slug}`,
  destinationList:   (query)    => `destinations:list:${JSON.stringify(query)}`,
  destinationReviews:(id, page) => `reviews:destination:${id}:page:${page}`,
  packagesByDest:    (destId)   => `packages:destination:${destId}`,
  adminStats:        ()         => `admin:stats`,
};

module.exports = { getCache, setCache, deleteCache, deleteByPattern, cacheKeys };