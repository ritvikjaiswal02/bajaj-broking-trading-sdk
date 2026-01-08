const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error('Request error', { 
    path: req.path, 
    method: req.method,
    message: err.message,
    stack: err.stack 
  });

  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: {
      code: statusCode,
      message: message
    }
  });
};
