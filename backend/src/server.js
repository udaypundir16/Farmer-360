const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const app = require('./app');
const logger = require('./utils/logger');
const { startMarketPriceService } = require('../scripts/fetchMarketPrices');

const PORT = process.env.PORT || 5002;
const NODE_ENV = process.env.NODE_ENV || 'development';

const { startMonitor } = require('./jobs/priceMonitor');

const server = app.listen(PORT, () => {
  logger.info({
    message: `Server running in ${NODE_ENV} mode`,
    port: PORT,
    timestamp: new Date().toISOString(),
  });
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${NODE_ENV}`);
  startMonitor(); // Start the background job
  // startMarketPriceService();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info({ message: 'SIGTERM signal received: closing HTTP server' });
  server.close(() => {
    logger.info({ message: 'HTTP server closed' });
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info({ message: 'SIGINT signal received: closing HTTP server' });
  server.close(() => {
    logger.info({ message: 'HTTP server closed' });
    process.exit(0);
  });
});

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error({
    message: 'Unhandled Rejection at:',
    promise: promise,
    reason: reason,
  });
});
