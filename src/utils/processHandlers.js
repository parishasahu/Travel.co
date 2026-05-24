const logger = require('../config/logger');

// ─── Unhandled promise rejections ────────────────────────────────────────────
// Fires when a Promise rejects and there's no .catch() handler
// In older Node versions these were silently swallowed — dangerous
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection', {
    reason: reason?.message || reason,
    stack:  reason?.stack,
  });
  // Give the server time to finish in-flight requests, then exit
  // PM2 or your platform will restart the process automatically
  process.exit(1);
});

// ─── Uncaught exceptions ──────────────────────────────────────────────────────
// Fires when an exception is thrown and not caught anywhere
// These are always fatal — the process is in an unknown state
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception — shutting down', {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

// ─── Graceful shutdown ────────────────────────────────────────────────────────
// Called when the process receives SIGTERM (from Docker, Kubernetes, Render etc)
// or SIGINT (Ctrl+C in terminal)
const gracefulShutdown = (server, signal) => {
  logger.info(`${signal} received — initiating graceful shutdown`);

  server.close(async () => {
    logger.info('HTTP server closed — no new connections accepted');

    try {
      // Close database connection cleanly
      const mongoose = require('mongoose');
      await mongoose.connection.close();
      logger.info('MongoDB connection closed');

      // Close Redis connection
      const { getRedis } = require('../config/redis');
      const redis = getRedis();
      if (redis) {
        await redis.quit();
        logger.info('Redis connection closed');
      }

      logger.info('Graceful shutdown complete');
      process.exit(0);
    } catch (err) {
      logger.error('Error during shutdown', { error: err.message });
      process.exit(1);
    }
  });

  // Force shutdown after 30 seconds if graceful shutdown hangs
  setTimeout(() => {
    logger.error('Graceful shutdown timed out — forcing exit');
    process.exit(1);
  }, 30_000);
};

module.exports = { gracefulShutdown };