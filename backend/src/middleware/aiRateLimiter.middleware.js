const cache = require('../utils/cache');

// In-memory usage store as fallback
const dailyUsageMap = new Map();

/**
 * Get the current calendar day key in YYYY-MM-DD format (IST / UTC)
 */
function getTodayKey() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

/**
 * Calculate midnight reset time in milliseconds and ISO string
 */
function getMidnightReset() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCHours(23, 59, 59, 999);
  return {
    resetTimestamp: tomorrow.getTime(),
    resetISO: tomorrow.toISOString(),
    secondsRemaining: Math.max(1, Math.floor((tomorrow.getTime() - now.getTime()) / 1000))
  };
}

/**
 * Get current usage count for a user
 */
async function getUserUsage(userId) {
  const today = getTodayKey();
  const cacheKey = `ai_usage_${userId}_${today}`;
  
  try {
    const cached = await cache.get(cacheKey);
    if (typeof cached === 'number') return cached;
    if (cached && typeof cached.count === 'number') return cached.count;
  } catch (e) {
    // Ignore cache error, fallback to memory
  }

  const mem = dailyUsageMap.get(cacheKey);
  return mem ? mem.count : 0;
}

/**
 * Increment usage count for a user
 */
async function incrementUserUsage(userId) {
  const today = getTodayKey();
  const cacheKey = `ai_usage_${userId}_${today}`;
  const { secondsRemaining } = getMidnightReset();

  let current = await getUserUsage(userId);
  const nextCount = current + 1;

  try {
    await cache.set(cacheKey, { count: nextCount }, secondsRemaining);
  } catch (e) {
    // Fallback to memory
  }

  dailyUsageMap.set(cacheKey, { count: nextCount, expireAt: Date.now() + secondsRemaining * 1000 });
  return nextCount;
}

/**
 * AI Daily Rate Limiter Middleware
 * - Registered Users: 20 requests per day across Chatbot & Voice Assistant
 * - Admins: Unlimited requests
 */
async function aiDailyRateLimiter(req, res, next) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const isAdmin = Boolean(
      user.isAdmin === true || 
      user.role === 'admin' || 
      user.is_admin === true
    );

    // Admins have unlimited access
    if (isAdmin) {
      res.setHeader('X-RateLimit-Limit', 'unlimited');
      res.setHeader('X-RateLimit-Remaining', 'unlimited');
      return next();
    }

    const userId = user.userId || user.id;
    if (!userId) {
      return res.status(401).json({ message: 'Invalid user session' });
    }

    const { resetISO, secondsRemaining } = getMidnightReset();
    const DAILY_LIMIT = 20;

    const currentUsage = await getUserUsage(userId);

    if (currentUsage >= DAILY_LIMIT) {
      res.setHeader('X-RateLimit-Limit', DAILY_LIMIT);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', resetISO);
      res.setHeader('Retry-After', secondsRemaining);

      return res.status(429).json({
        success: false,
        message: `Daily AI limit reached (${DAILY_LIMIT} requests/day). Please try again tomorrow.`,
        error: 'DAILY_LIMIT_EXCEEDED',
        limit: DAILY_LIMIT,
        used: currentUsage,
        remaining: 0,
        resetTime: resetISO
      });
    }

    // Increment count and proceed
    const newCount = await incrementUserUsage(userId);
    const remaining = Math.max(0, DAILY_LIMIT - newCount);

    res.setHeader('X-RateLimit-Limit', DAILY_LIMIT);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', resetISO);

    next();
  } catch (error) {
    console.error('AI Rate Limiter Error:', error);
    // Allow request to proceed if rate limiter itself errors out
    next();
  }
}

/**
 * Controller helper to get user status
 */
async function getAiUsageStatus(req, res) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Authentication required' });

    const isAdmin = Boolean(
      user.isAdmin === true || 
      user.role === 'admin' || 
      user.is_admin === true
    );

    const { resetISO } = getMidnightReset();

    if (isAdmin) {
      return res.json({
        success: true,
        isAdmin: true,
        limit: 'unlimited',
        used: 0,
        remaining: 'unlimited',
        resetTime: resetISO
      });
    }

    const userId = user.userId || user.id;
    const used = await getUserUsage(userId);
    const limit = 20;

    res.json({
      success: true,
      isAdmin: false,
      limit,
      used,
      remaining: Math.max(0, limit - used),
      resetTime: resetISO
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve AI usage status' });
  }
}

module.exports = {
  aiDailyRateLimiter,
  getAiUsageStatus,
  getUserUsage
};
