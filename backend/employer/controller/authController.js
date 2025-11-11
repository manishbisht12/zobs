import Employer from '../../models/Employer.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new employer
// @route   POST /api/employer/auth/signup
// @access  Public
export const employerSignup = async (req, res) => {
  try {
    const { name, email, password, companyName } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, email, password)',
      });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Validate company name
    if (!companyName?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your company name',
      });
    }

    // Check if employer already exists
    const employerExists = await Employer.findOne({ email });
    if (employerExists) {
      return res.status(400).json({
        success: false,
        message: 'Employer already exists with this email',
      });
    }

    // Create employer
    const employer = await Employer.create({
      name,
      email,
      password,
      companyName: companyName.trim(),
    });

    // Generate token
    const token = generateToken(employer._id);

    res.status(201).json({
      success: true,
      message: 'Employer registered successfully',
      data: {
        user: {
          id: employer._id,
          name: employer.name,
          email: employer.email,
          role: 'employer',
          companyName: employer.companyName,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Employer signup error:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message,
    });
  }
};

// @desc    Login employer
// @route   POST /api/employer/auth/login
// @access  Public
export const employerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check if employer exists and get password field
    const employer = await Employer.findOne({ email }).select('+password');
    if (!employer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if employer is active
    if (!employer.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    // Check password
    const isPasswordMatch = await employer.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(employer._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: employer._id,
          name: employer.name,
          email: employer.email,
          role: 'employer',
          companyName: employer.companyName,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Employer login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
};

// @desc    Get current employer
// @route   GET /api/employer/auth/me
// @access  Private (Employer only)
export const getEmployer = async (req, res) => {
  try {
    const employer = await Employer.findById(req.user.id);
    
    if (!employer) {
      return res.status(404).json({
        success: false,
        message: 'Employer not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: employer._id,
          name: employer.name,
          email: employer.email,
          role: 'employer',
          companyName: employer.companyName,
          companyWebsite: employer.companyWebsite,
          phone: employer.phone,
          address: employer.address,
          isVerified: employer.isVerified,
          isActive: employer.isActive,
          profileImage: employer.profileImage,
          bio: employer.bio,
        },
      },
    });
  } catch (error) {
    console.error('Get employer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

