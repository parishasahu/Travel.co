const logger = require('../config/logger');

// Custom Morgan-style middleware using Winston
// Logs method, path, status, response time, and user context
const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Hook into res.finish event — fires when response is sent
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData  = {
      method:   req.method,
      path:     req.originalUrl,
      status:   res.statusCode,
      duration: `${duration}ms`,
      ip:       req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
    };

    // Attach userId if the user is authenticated
    if (req.user?.userId) {
      logData.userId = req.user.userId;
    }

    // Choose log level based on status code
    if (res.statusCode >= 500) {
      logger.error('Request completed', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('Request completed', logData);
    } else {
      logger.info('Request completed', logData);
    }
  });

  next();
};

module.exports = requestLogger;