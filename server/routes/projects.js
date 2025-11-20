const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const { auth, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects (with optional filters)
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      municipality,
      status,
      category,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = { isVisible: true };
    
    if (municipality) filter.municipality = municipality;
    if (status) filter.status = status;
    if (category) filter.category = category;

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const projects = await Project.find(filter)
      .populate('assignedContractor', 'username fullName')
      .populate('assignedBy', 'username fullName')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Project.countDocuments(filter);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalProjects: total,
          hasMore: page < Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching projects'
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('assignedContractor', 'username fullName email phoneNumber address municipality contractorDetails')
      .populate('assignedBy', 'username fullName')
      .populate('compliance.approvedBy', 'username fullName');

    if (!project || !project.isVisible) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: { project }
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching project'
    });
  }
});

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private (Admin only)
router.post('/', auth, authorize('admin'), [
  body('projectId').notEmpty().trim().escape(),
  body('title').notEmpty().trim().escape(),
  body('description').notEmpty().trim().escape(),
  body('category').isIn([
    'Road Construction', 'Building Construction', 'Water Supply', 'Sanitation',
    'Electricity', 'Education', 'Health', 'Agriculture', 'Tourism', 'Other'
  ]),
  body('municipality').isIn([
    'Bharatpur', 'Ratnanagar', 'Kawasoti', 'Gaindakot', 'Madhyabindu',
    'Bharatpur Metropolitain', 'Ratnanagar Municipality', 'Kawasoti Municipality',
    'Gaindakot Municipality', 'Madhyabindu Municipality'
  ]),
  body('location').notEmpty().trim().escape(),
  body('budget.allocated').isNumeric().isFloat({ min: 0 }),
  body('timeline.startDate').isISO8601().toDate(),
  body('timeline.endDate').isISO8601().toDate()
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

    const projectData = {
      ...req.body,
      assignedBy: req.user._id
    };

    const project = new Project(projectData);
    await project.save();

    await project.populate('assignedBy', 'username fullName');
    await project.populate('assignedContractor', 'username fullName');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { project }
    });
  } catch (error) {
    console.error('Create project error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Project ID already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating project'
    });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update a project
// @access  Private (Admin or assigned Contractor)
router.put('/:id', auth, [
  body('title').optional().notEmpty().trim().escape(),
  body('description').optional().notEmpty().trim().escape(),
  body('status').optional().isIn(['Planned', 'In Progress', 'Delayed', 'Completed', 'Cancelled']),
  body('progress.percentage').optional().isInt({ min: 0, max: 100 })
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

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permissions
    if (req.user.role === 'contractor' && project.assignedContractor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only update your assigned projects'
      });
    }

    if (req.user.role === 'admin' || (req.user.role === 'contractor' && project.assignedContractor.toString() === req.user._id.toString())) {
      const updateData = { ...req.body };
      
      if (updateData.progress && updateData.progress.percentage !== undefined) {
        updateData.progress.lastUpdated = new Date();
      }

      Object.assign(project, updateData);
      await project.save();

      await project.populate('assignedContractor', 'username fullName');
      await project.populate('assignedBy', 'username fullName');

      res.json({
        success: true,
        message: 'Project updated successfully',
        data: { project }
      });
    } else {
      res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating project'
    });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project
// @access  Private (Admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting project'
    });
  }
});

// @route   PUT /api/projects/:id/assign-contractor
// @desc    Assign a contractor to a project
// @access  Private (Admin only)
router.put('/:id/assign-contractor', auth, authorize('admin'), [
  body('contractorId').isMongoId()
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

    const { contractorId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    project.assignedContractor = contractorId;
    await project.save();

    await project.populate('assignedContractor', 'username fullName contractorDetails');

    res.json({
      success: true,
      message: 'Contractor assigned successfully',
      data: { project }
    });
  } catch (error) {
    console.error('Assign contractor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while assigning contractor'
    });
  }
});

// @route   GET /api/projects/contractor/:contractorId
// @desc    Get projects assigned to a specific contractor
// @access  Private
router.get('/contractor/:contractorId', auth, async (req, res) => {
  try {
    const { contractorId } = req.params;

    // Check if user is requesting their own projects or is admin
    if (req.user.role !== 'admin' && req.user._id.toString() !== contractorId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const projects = await Project.find({ assignedContractor: contractorId })
      .populate('assignedBy', 'username fullName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { projects }
    });
  } catch (error) {
    console.error('Get contractor projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching contractor projects'
    });
  }
});

module.exports = router;
