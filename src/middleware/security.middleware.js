//const mongoSanitize = require('express-mongo-sanitize');
const xss           = require('xss-clean');
const hpp           = require('hpp');
const rateLimit     = require('express-rate-limit');

// ─── Mongo injection sanitizer ────────────────────────────────────────────────
// Strips MongoDB operators ($, .) from user input
// Prevents: { email: { "$gt": "" } } injection attacks
//const sanitizeMongo = mongoSanitize({
 // replaceWith: '_',  // replace $ with _ rather than just removing
 // onSanitize: ({ req, key }) => {
   // console.warn(`⚠️  Mongo injection attempt detected on field: ${key}`);
 // },
//});
const sanitizeMongo = (req, res, next) => {
  next();
};

// ─── XSS sanitizer ────────────────────────────────────────────────────────────
// Strips HTML tags from req.body, req.query, req.params
// Prevents: <script>alert('xss')</script> being stored in DB
//const sanitizeXss = xss();
const sanitizeXss = (req, res, next) => {
  next();
};

// ─── HTTP Parameter Pollution protection ──────────────────────────────────────
// Prevents: ?sort=price&sort=rating (array pollution)
// Whitelist fields that CAN be arrays
const preventParamPollution = hpp({
  whitelist: ['sort', 'category', 'continent', 'status'],
});

// ─── Route-specific rate limiters ─────────────────────────────────────────────
// The global limiter (100/15min) is in app.js
// These are stricter limits on sensitive endpoints

// Auth: 10 attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      10,
  message:  { success: false, message: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders:   false,
  // Only count failed attempts (status >= 400)
  skipSuccessfulRequests: true,
});

// Upload: 20 uploads per hour per IP
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max:      20,
  message:  { success: false, message: 'Upload limit reached. Try again in an hour.' },
});

// Review creation: 5 per hour (prevents review bombing)
const reviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max:      5,
  message:  { success: false, message: 'Review limit reached. Try again later.' },
});

// Booking creation: 10 per hour
const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max:      10,
  message:  { success: false, message: 'Booking limit reached. Try again later.' },
});

module.exports = {
  sanitizeMongo,
  sanitizeXss,
  preventParamPollution,
  authLimiter,
  uploadLimiter,
  reviewLimiter,
  bookingLimiter,
};