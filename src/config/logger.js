const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const { nodeEnv } = require('./env');

// ─── Custom log format ────────────────────────────────────────────────────────
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),  // include stack traces on errors
  winston.format.json()                    // structured JSON — machine readable
);

// ─── Human-readable format for development console ───────────────────────────
const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length
      ? '\n' + JSON.stringify(meta, null, 2)
      : '';
    return `${timestamp} [${level}]: ${message}${metaStr}`;
  })
);

// ─── Transports (where logs go) ───────────────────────────────────────────────
const transports = [];

// Console: always on, format depends on environment
transports.push(
  new winston.transports.Console({
    format: nodeEnv === 'development' ? devFormat : logFormat,
    // In production only log warnings and errors to console
    // Info and debug go to files only
    level: nodeEnv === 'development' ? 'debug' : 'warn',
  })
);

// File transport: only in production
if (nodeEnv === 'production') {
  // Error log — errors only, kept for 30 days
  transports.push(
    new DailyRotateFile({
      filename:     path.join('logs', 'error-%DATE%.log'),
      datePattern:  'YYYY-MM-DD',
      level:        'error',
      maxFiles:     '30d',
      zippedArchive: true,  // compress old logs
    })
  );

  // Combined log — all levels, kept for 14 days
  transports.push(
    new DailyRotateFile({
      filename:     path.join('logs', 'combined-%DATE%.log'),
      datePattern:  'YYYY-MM-DD',
      maxFiles:     '14d',
      zippedArchive: true,
    })
  );
}

// ─── Create logger instance ───────────────────────────────────────────────────
const logger = winston.createLogger({
  level:            nodeEnv === 'development' ? 'debug' : 'info',
  format:           logFormat,
  transports,
  // Don't crash the process on logger errors
  exitOnError: false,
  // Service name appears in every log line
  defaultMeta: { service: 'luxury-travel-api' },
});

module.exports = logger;