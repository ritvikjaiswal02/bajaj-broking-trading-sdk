const logger = require('../utils/logger');
require('dotenv').config();

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.AUTH_TOKEN;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    
    if (token === expectedToken) {
      req.userId = "USER001";
      logger.info('Authentication successful', { userId: req.userId, path: req.path });
      return next();
    }
  }

  logger.warn('Authentication failed', { path: req.path, ip: req.ip });
  return res.status(401).json({
    success: false,
    error: {
      code: 401,
      message: "Unauthorized: Invalid or missing token"
    }
  });
};
