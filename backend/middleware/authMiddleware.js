const jwt = require('jsonwebtoken');

// Ensure JWT_SECRET is loaded. It should be set in your environment or .env file.
// Fallback for development, but strongly recommend setting it externally for production.
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secret-key-for-dev-only';

const protect = (req, res, next) => {
  let token;

  // Check for Authorization header and if it starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (e.g., "Bearer <token>" -> "<token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Attach user info to request object (excluding password or sensitive data if present in token)
      // Assuming your JWT payload has 'userId' and 'username' as set in authController.js
      req.user = {
        id: decoded.userId, // Ensure this matches the payload key from jwt.sign
        username: decoded.username // Ensure this matches the payload key
      };

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
