require('dotenv').config();

const express          = require('express');
const cors             = require('cors');
const helmet           = require('helmet');
const rateLimit        = require('express-rate-limit');
const { frontendUrl, nodeEnv } = require('./config/env');

// Middleware
const requestLogger        = require('./middleware/requestLogger.middleware');
const errorMiddleware      = require('./middleware/error.middleware');
const {
  sanitizeMongo, sanitizeXss, preventParamPollution,
  authLimiter, uploadLimiter, reviewLimiter, bookingLimiter,
} = require('./middleware/security.middleware');

// Routes
const authRoutes        = require('./routes/auth.routes');
const userRoutes        = require('./routes/user.routes');
const destinationRoutes = require('./routes/destination.routes');
const bookingRoutes     = require('./routes/booking.routes');
const reviewRoutes      = require('./routes/review.routes');
const uploadRoutes      = require('./routes/upload.routes');
const adminRoutes       = require('./routes/admin.routes');

const app = express();

// ─── Trust proxy ──────────────────────────────────────────────────────────────
// Required when running behind Nginx, Railway, Render, or any reverse proxy
// Without this, req.ip shows the proxy IP, not the real client IP
app.set('trust proxy', 1);

// ─── Security headers ─────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow CDN images
  contentSecurityPolicy: nodeEnv === 'production'
    ? undefined  // use defaults in production
    : false,     // disable CSP in development (easier debugging)
}));

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  frontendUrl,
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials:  true,
  methods:      ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Global rate limiter ──────────────────────────────────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      100,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
}));

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// ─── Security sanitizers ──────────────────────────────────────────────────────
app.use(sanitizeMongo);          // prevent MongoDB injection
app.use(sanitizeXss);            // strip XSS from body/query
app.use(preventParamPollution);  // prevent HTTP param pollution

// ─── Request logging ──────────────────────────────────────────────────────────
app.use(requestLogger);

// ─── Health check ─────────────────────────────────────────────────────────────
// No auth, no rate limiting — must always respond
// Used by Render, Railway, Docker healthchecks, uptime monitors
app.get('/health', (req, res) => {
  res.status(200).json({
    success:   true,
    message:   'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime:    `${Math.floor(process.uptime())}s`,
    environment: nodeEnv,
  });
});

// ─── API Routes with route-level rate limiting ────────────────────────────────
app.use('/api/v1/auth',         authLimiter,   authRoutes);
app.use('/api/v1/users',        userRoutes);
app.use('/api/v1/destinations', destinationRoutes);
app.use('/api/v1/destinations/:destinationId/reviews', reviewLimiter, reviewRoutes);
app.use('/api/v1/bookings',     bookingLimiter, bookingRoutes);
app.use('/api/v1/upload',       uploadLimiter,  uploadRoutes);
app.use('/api/v1/admin',        adminRoutes);

// ─── API documentation route ──────────────────────────────────────────────────
app.get('/api/v1', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Luxury Travel API',
    version: '1.0.0',
    endpoints: {
      auth:         '/api/v1/auth',
      users:        '/api/v1/users',
      destinations: '/api/v1/destinations',
      bookings:     '/api/v1/bookings',
      reviews:      '/api/v1/destinations/:destinationId/reviews',
      uploads:      '/api/v1/upload',
      admin:        '/api/v1/admin',
    },
  });
});

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// ─── Global error handler (always last) ───────────────────────────────────────
app.use(errorMiddleware);

module.exports = app;