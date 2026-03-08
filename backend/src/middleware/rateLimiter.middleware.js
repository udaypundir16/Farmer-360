const rateLimit = require('express-rate-limit');

const rateLimiter = (options) => rateLimit({
  windowMs: options.windowMs || 60 * 1000,
  max: options.max || 5,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = rateLimiter;