require('dotenv').config();

const app                = require('./src/app');
const connectDB          = require('./src/config/db');
const { connectRedis }   = require('./src/config/redis');
const logger             = require('./src/config/logger');
const { gracefulShutdown } = require('./src/utils/processHandlers');
const { port, nodeEnv }  = require('./src/config/env');

const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Connect to Redis (optional — app works without it)
    connectRedis();

    // 3. Start HTTP server
    const server = app.listen(port, () => {
      logger.info(`🚀 Server started`, {
        port,
        environment: nodeEnv,
        pid:         process.pid,
      });
    });

    // 4. Register graceful shutdown handlers
    process.on('SIGTERM', () => gracefulShutdown(server, 'SIGTERM'));
    process.on('SIGINT',  () => gracefulShutdown(server, 'SIGINT'));

    return server;
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
};

startServer();