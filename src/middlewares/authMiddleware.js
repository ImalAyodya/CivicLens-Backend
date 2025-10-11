const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = {
  // Verify JWT token middleware
  async protect(req, res, next) {
    try {
      let token;

      // Check if auth header exists and has the right format
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        // Extract token from Bearer token
        token = req.headers.authorization.split(' ')[1];
      }

      // Check if token exists
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, no token provided'
        });
      }

      try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user from decoded token
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Not authorized, user not found'
          });
        }

        // Add user object to request
        req.user = user;
        next();
      } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({
          success: false,
          message: 'Not authorized, token invalid'
        });
      }
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Role-based authorization middleware
  authorize(...roles) {
    return (req, res, next) => {
      // req.user is set by protect middleware
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized'
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `User role ${req.user.role} is not authorized to access this route`
        });
      }

      next();
    };
  },

  // Optional authentication - attaches user to req if token is valid
  // but doesn't block the request if no token or invalid token
  async optional(req, res, next) {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');

      if (!token) {
        // No token, continue without user
        next();
        return;
      }

      // Verify token and attach user to request
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        // Invalid user, continue without user
        next();
        return;
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      // Continue without user on any error
      next();
    }
  }
};

module.exports = authMiddleware;