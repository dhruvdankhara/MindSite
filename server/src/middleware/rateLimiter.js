const rateLimit = require("express-rate-limit");
const config = require("../config");

// General API rate limiting
const apiLimiter = rateLimit({
  windowMs: config.security.rateLimitWindowMs,
  max: config.security.rateLimitMax,
  message: {
    error: "Too many requests from this IP",
    retryAfter: Math.ceil(config.security.rateLimitWindowMs / 1000),
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for AI generation
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit to 20 AI requests per 15 minutes
  message: {
    error: "AI generation rate limit exceeded",
    retryAfter: 900,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Export rate limiting
const exportLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Limit to 10 exports per 5 minutes
  message: {
    error: "Export rate limit exceeded",
    retryAfter: 300,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  aiLimiter,
  exportLimiter,
};
