const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (with filters)
// @access  Private (Admin only)
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      municipality,
      isActive,
      search
    } = req.query;

    const filter = {};
    
    if (role) filter.role = role;
    if (municipality) filter.municipality = municipality;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasMore: page < Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
});

// @route   GET /api/users/contractors
// @desc    Get all contractors
// @access  Public
router.get('/contractors', async (req, res) => {
  try {
    const { municipality, page = 1, limit = 10 } = req.query;

    const filter = { role: 'contractor', isActive: true };
    if (municipality) filter.municipality = municipality;

    const contractors = await User.find(filter)
      .select('username fullName municipality contractorDetails profileImage')
      .sort({ 'contractorDetails.completedProjects': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        contractors,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalContractors: total,
          hasMore: page < Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get contractors error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching contractors'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Users can only see full profile of themselves or contractors (public info)
    if (req.user.role !== 'admin' && 
        req.user._id.toString() !== req.params.id && 
        user.role !== 'contractor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // If requesting contractor info and not admin/self, return limited info
    if (user.role === 'contractor' && 
        req.user.role !== 'admin' && 
        req.user._id.toString() !== req.params.id) {
      const publicInfo = {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        municipality: user.municipality,
        contractorDetails: user.contractorDetails,
        profileImage: user.profileImage
      };
      return res.json({
        success: true,
        data: { user: publicInfo }
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user'
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Admin or self)
router.put('/:id', auth, [
  body('username').optional().isLength({ min: 3 }).trim().escape(),
  body('email').optional().isEmail().normalizeEmail(),
  body('fullName').optional().notEmpty().trim().escape(),
  body('phoneNumber').optional().matches(/^[0-9]{10}$/),
  body('municipality').optional().isIn([
    'Bharatpur', 'Ratnanagar', 'Kawasoti', 'Gaindakot', 'Madhyabindu',
    'Bharatpur Metropolitain', 'Ratnanagar Municipality', 'Kawasoti Municipality',
    'Gaindakot Municipality', 'Madhyabindu Municipality'
  ])
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

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const allowedUpdates = ['username', 'email', 'fullName', 'phoneNumber', 'address', 'municipality'];
    const updates = {};

    // Only admins can update role and contractor details
    if (req.user.role === 'admin') {
      allowedUpdates.push('role', 'isActive', 'contractorDetails');
    }

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Check if username or email already exists (if being updated)
    if (updates.username || updates.email) {
      const existingUser = await User.findOne({
        _id: { $ne: req.params.id },
        $or: [
          ...(updates.username ? [{ username: updates.username }] : []),
          ...(updates.email ? [{ email: updates.email }] : [])
        ]
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username or email already exists'
        });
      }
    }

    Object.assign(user, updates);
    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user: user.getPublicProfile() }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user'
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (soft delete - deactivate)
// @access  Private (Admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete by deactivating
    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deactivating user'
    });
  }
});

// @route   PUT /api/users/:id/activate
// @desc    Activate a user
// @access  Private (Admin only)
router.put('/:id/activate', auth, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = true;
    await user.save();

    res.json({
      success: true,
      message: 'User activated successfully',
      data: { user: user.getPublicProfile() }
    });
  } catch (error) {
    console.error('Activate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while activating user'
    });
  }
});

module.exports = router;
