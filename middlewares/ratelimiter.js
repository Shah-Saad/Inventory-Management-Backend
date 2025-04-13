const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // max 30 requests per IP
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later."
  }
});

module.exports = apiLimiter;
