// Simple in-memory cache fallback if Redis is not available
const memoryCache = new Map();

let redisClient = null;
let useRedis = false;

// Try to initialize Redis, fallback to memory cache
try {
  if (process.env.REDIS_URL && process.env.REDIS_URL !== 'redis://localhost:6379') {
    const redis = require('redis');
    redisClient = redis.createClient({ url: process.env.REDIS_URL });
    redisClient.on('error', (err) => {
      console.warn('Redis error, using memory cache:', err.message);
      useRedis = false;
    });
    redisClient.connect().then(() => {
      useRedis = true;
      console.log('✓ Redis cache connected');
    }).catch(() => {
      useRedis = false;
      console.log('⚠ Using in-memory cache (Redis unavailable)');
    });
  }
} catch (error) {
  console.log('⚠ Using in-memory cache (Redis not configured)');
}

exports.get = async (key) => {
  if (useRedis && redisClient) {
    try {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      // Fallback to memory cache
      return memoryCache.get(key) || null;
    }
  }
  return memoryCache.get(key) || null;
};

exports.set = async (key, value, ttlSeconds) => {
  if (useRedis && redisClient) {
    try {
      await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
      return;
    } catch (error) {
      // Fallback to memory cache
    }
  }
  // Memory cache with TTL simulation
  memoryCache.set(key, value);
  setTimeout(() => memoryCache.delete(key), ttlSeconds * 1000);
};