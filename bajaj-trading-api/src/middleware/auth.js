require('dotenv').config();

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.AUTH_TOKEN;

  // Expected format: "Bearer <token>"
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    
    if (token === expectedToken) {
      req.userId = "USER001"; // Mock User ID
      return next();
    }
  }

  // Invalid or missing token
  return res.status(401).json({
    success: false,
    error: {
      code: 401,
      message: "Unauthorized: Invalid or missing token"
    }
  });
};
