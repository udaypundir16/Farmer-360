const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler.middleware');

// Route imports
const authRoutes = require('./routes/auth.routes');
const marketRoutes = require('./routes/market.routes');
const schemesRoutes = require('./routes/schemes.routes');
const alertRoutes = require('./routes/alert.routes');
const aiRoutes = require('./routes/ai.routes');
const searchRoutes = require('./routes/search.routes');
const userRoutes = require('./routes/user.routes');
const notificationRoutes = require('./routes/notification.routes');
const weatherRoutes = require('./routes/weather.routes');
const cropRoutes = require('./routes/crop.routes');
const shipmentRoutes = require('./routes/shipment.routes');
const profitCalculatorRoutes = require('./routes/profit-calculator.routes');
const forumRoutes = require('./routes/forum.routes');
const cropTradeRoutes = require('./routes/cropTrade.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging middleware
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    path: req.path,
    timestamp: new Date().toISOString(),
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API v1 Routes
const apiPrefix = '/api/v1';

app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/market`, marketRoutes);
app.use(`${apiPrefix}/shipments`, shipmentRoutes);
app.use(`${apiPrefix}/profit-calculator`, profitCalculatorRoutes);
app.use(`${apiPrefix}/forum`, forumRoutes);
app.use(`${apiPrefix}/schemes`, schemesRoutes);
app.use(`${apiPrefix}/alerts`, alertRoutes);
app.use(`${apiPrefix}/ai`, aiRoutes);
app.use(`${apiPrefix}/search`, searchRoutes);
app.use(`${apiPrefix}/user`, userRoutes);
app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/notifications`, notificationRoutes);
app.use(`${apiPrefix}/weather`, weatherRoutes);
app.use(`${apiPrefix}/crop`, cropRoutes);
app.use(`${apiPrefix}/crop-trade`, cropTradeRoutes);
app.use(`${apiPrefix}/admin`, adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
