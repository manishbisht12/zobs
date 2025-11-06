import jwt from 'jsonwebtoken';
import Employer from '../models/Employer.js';

// Protect employer routes - verify JWT token and ensure user is an employer
export const protectEmployer = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get employer from token
      const employer = await Employer.findById(decoded.id).select('-password');

      if (!employer) {
        return res.status(401).json({
          success: false,
          message: 'Employer not found',
        });
      }

      // Check if employer is active
      if (!employer.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Your account has been deactivated. Please contact support.',
        });
      }

      // Attach employer to request
      req.user = employer;
      req.employer = employer;

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
      });
    }
  } catch (error) {
    console.error('Employer auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

