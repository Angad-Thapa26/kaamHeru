const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('username').isLength({ min: 3 }).trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('fullName').notEmpty().trim().escape(),
  body('municipality').isIn([
    'Bharatpur', 'Ratnanagar', 'Kawasoti', 'Gaindakot', 'Madhyabindu',
    'Bharatpur Metropolitain', 'Ratnanagar Municipality', 'Kawasoti Municipality',
    'Gaindakot Municipality', 'Madhyabindu Municipality'
  ]),
  body('role').optional().isIn(['public', 'contractor', 'admin'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { 
      username, 
      email, 
      password, 
      fullName, 
      municipality, 
      role = 'public', 
      phoneNumber, 
      address,
      firstName,
      lastName,
      companyName,
      licenseNumber,
      specialization,
      experience,
      contractorId,
      isVerified,
      verifiedBy,
      verifiedAt
    } = req.body;

    // Combine firstName and lastName if provided
    const finalFullName = firstName && lastName ? `${firstName} ${lastName}` : fullName;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Prevent creating multiple admin accounts
    if (role === 'admin') {
      const existingAdmin = await User.findOne({ role: 'admin' });
      if (existingAdmin) {
        return res.status(403).json({
          success: false,
          message: 'An admin account already exists. Please log in or contact support.'
        });
      }
    }

    // Create new user
    const userData = {
      username,
      email,
      password,
      fullName: finalFullName,
      municipality,
      role,
      phoneNumber,
      address
    };

    // Add contractor details if role is contractor
    if (role === 'contractor') {
      userData.contractorDetails = {
        contractorId: contractorId || `CTR${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        companyName,
        licenseNumber,
        specialization: Array.isArray(specialization) ? specialization : [specialization].filter(Boolean),
        experience: parseInt(experience) || 0,
        isVerified: isVerified || false,
        verifiedBy: verifiedBy || null,
        verifiedAt: verifiedAt || null
      };
    }

    const user = new User(userData);

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/auth/update-profile
// @desc    Update user profile
// @access  Private
router.put('/update-profile', auth, [
  body('fullName').optional().notEmpty().trim().escape(),
  body('phoneNumber').optional().matches(/^[0-9]{10}$/),
  body('address').optional().trim().escape()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { fullName, phoneNumber, address } = req.body;
    const updateData = {};

    if (fullName) updateData.fullName = fullName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (address) updateData.address = address;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during profile update'
    });
  }
});

// Google OAuth Routes
// @route   GET /api/auth/google
// @desc    Authenticate with Google
// @access  Public
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      // Generate JWT token for the authenticated user
      const token = generateToken(req.user._id);
      
      // Redirect to frontend with token
      const redirectUrl = `${process.env.CLIENT_URL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user.getPublicProfile()))}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
    }
  }
);

// @route   GET /api/auth/admin-exists
// @desc    Check if an admin account already exists
// @access  Public (non-sensitive boolean)
router.get('/admin-exists', async (req, res) => {
  try {
    const exists = await User.exists({ role: 'admin' });
    res.json({
      success: true,
      data: { exists: !!exists }
    });
  } catch (error) {
    console.error('Admin exists check error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/auth/google/success
// @desc    Handle successful Google authentication
// @access  Public
router.get('/google/success', async (req, res) => {
  try {
    const { token, user } = req.query;
    
    if (!token || !user) {
      return res.status(400).json({
        success: false,
        message: 'Missing authentication data'
      });
    }
    
    res.json({
      success: true,
      message: 'Google authentication successful',
      data: {
        token,
        user: JSON.parse(user)
      }
    });
  } catch (error) {
    console.error('Google success handler error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
});

module.exports = router;
