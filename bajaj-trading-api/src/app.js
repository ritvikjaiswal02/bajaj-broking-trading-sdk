const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Add this route BEFORE other routes

// Import Routes
const instrumentsRouter = require('./routes/instruments');
const ordersRouter = require('./routes/orders');
const tradesRouter = require('./routes/trades');
const portfolioRouter = require('./routes/portfolio');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Add this route BEFORE other routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount Routes
app.use('/api/v1/instruments', instrumentsRouter);
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/trades', tradesRouter);
app.use('/api/v1/portfolio', portfolioRouter);

// Root Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Bajaj Broking Trading API",
    endpoints: {
      instruments: "/api/v1/instruments",
      orders: "/api/v1/orders",
      trades: "/api/v1/trades",
      portfolio: "/api/v1/portfolio"
    }
  });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: 404,
      message: "Route not found"
    }
  });
});

// Error Handler
app.use(errorHandler);

module.exports = app;
