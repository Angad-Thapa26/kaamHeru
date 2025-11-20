const express = require('express');
const { body, validationResult } = require('express-validator');
const Update = require('../models/Update');
const Project = require('../models/Project');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/updates/project/:projectId
// @desc    Get all updates for a project
// @access  Public
router.get('/project/:projectId', async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    
    const filter = { project: req.params.projectId, isPublic: true };
    if (type) filter.updateType = type;

    const updates = await Update.find(filter)
      .populate('updatedBy', 'username fullName role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Update.countDocuments(filter);

    res.json({
      success: true,
      data: {
        updates,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalUpdates: total,
          hasMore: page < Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get updates error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching updates'
    });
  }
});

// @route   POST /api/updates
// @desc    Create a new project update
// @access  Private (Admin or assigned Contractor)
router.post('/', auth, [
  body('project').isMongoId(),
  body('updateType').isIn(['Status Change', 'Progress Update', 'Photo Update', 'Budget Update', 'Timeline Change', 'Issue Report']),
  body('title').notEmpty().trim().escape(),
  body('description').notEmpty().trim().escape()
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

    const { project, updateType, title, description, images, newStatus, newProgress, budgetUpdate, timelineUpdate } = req.body;

    // Check if project exists
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permissions
    if (req.user.role === 'contractor' && projectDoc.assignedContractor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only update your assigned projects'
      });
    }

    const updateData = {
      project,
      updatedBy: req.user._id,
      updateType,
      title,
      description,
      images: images || []
    };

    // Add specific update data based on type
    if (updateType === 'Status Change' && newStatus) {
      updateData.previousStatus = projectDoc.status;
      updateData.newStatus = newStatus;
    }

    if (updateType === 'Progress Update' && newProgress !== undefined) {
      updateData.previousProgress = projectDoc.progress.percentage;
      updateData.newProgress = newProgress;
    }

    if (updateType === 'Budget Update' && budgetUpdate) {
      updateData.budgetUpdate = budgetUpdate;
    }

    if (updateType === 'Timeline Change' && timelineUpdate) {
      updateData.timelineUpdate = timelineUpdate;
    }

    const update = new Update(updateData);
    await update.save();

    // Update project if necessary
    if (newStatus) {
      projectDoc.status = newStatus;
    }
    if (newProgress !== undefined) {
      projectDoc.progress.percentage = newProgress;
      projectDoc.progress.lastUpdated = new Date();
    }
    await projectDoc.save();

    await update.populate('updatedBy', 'username fullName role');

    res.status(201).json({
      success: true,
      message: 'Update created successfully',
      data: { update }
    });
  } catch (error) {
    console.error('Create update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating update'
    });
  }
});

// @route   PUT /api/updates/:id
// @desc    Update an update
// @access  Private (Creator or Admin)
router.put('/:id', auth, [
  body('title').optional().notEmpty().trim().escape(),
  body('description').optional().notEmpty().trim().escape()
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

    const update = await Update.findById(req.params.id);

    if (!update) {
      return res.status(404).json({
        success: false,
        message: 'Update not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && update.updatedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only update your own updates'
      });
    }

    const { title, description, isPublic, priority } = req.body;
    
    if (title) update.title = title;
    if (description) update.description = description;
    if (isPublic !== undefined) update.isPublic = isPublic;
    if (priority) update.priority = priority;

    await update.save();
    await update.populate('updatedBy', 'username fullName role');

    res.json({
      success: true,
      message: 'Update updated successfully',
      data: { update }
    });
  } catch (error) {
    console.error('Update update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating update'
    });
  }
});

// @route   DELETE /api/updates/:id
// @desc    Delete an update
// @access  Private (Creator or Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const update = await Update.findById(req.params.id);

    if (!update) {
      return res.status(404).json({
        success: false,
        message: 'Update not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && update.updatedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only delete your own updates'
      });
    }

    await Update.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Update deleted successfully'
    });
  } catch (error) {
    console.error('Delete update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting update'
    });
  }
});

// @route   GET /api/updates/user/:userId
// @desc    Get updates by a user
// @access  Private
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Users can only see their own updates unless they're admin
    if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updates = await Update.find({ updatedBy: userId })
      .populate('project', 'title municipality status')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { updates }
    });
  } catch (error) {
    console.error('Get user updates error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user updates'
    });
  }
});

module.exports = router;
