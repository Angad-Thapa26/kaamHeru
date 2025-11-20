const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Review = require('../models/Review');
const Project = require('../models/Project');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Test route to verify the reviews API is working
router.get('/test', (req, res) => {
  console.log('Reviews API test route hit');
  res.json({
    success: true,
    message: 'Reviews API is working',
    timestamp: new Date().toISOString()
  });
});

// @route   GET /api/reviews/project/:projectId
// @desc    Get all reviews for a project
// @access  Public
router.get('/project/:projectId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    console.log('Fetching reviews for project:', req.params.projectId);
    console.log('Query params:', { page, limit });
    
    // First check if the projectId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.projectId)) {
      console.log('Invalid project ID:', req.params.projectId);
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID format'
      });
    }
    
    const reviews = await Review.find({ project: req.params.projectId, isPublic: true })
      .populate('reviewer', 'username fullName')
      .populate('contractorResponse.respondedBy', 'username fullName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    console.log('Found reviews:', reviews.length);
    console.log('Sample review:', reviews[0]);

    const total = await Review.countDocuments({ project: req.params.projectId, isPublic: true });

    // Calculate average rating
    const avgRating = await Review.aggregate([
      { $match: { project: new mongoose.Types.ObjectId(req.params.projectId), isPublic: true } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
    ]);

    const responseData = {
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalReviews: total,
          hasMore: page < Math.ceil(total / limit)
        },
        stats: avgRating[0] || { avgRating: 0, totalReviews: 0 }
      }
    };

    console.log('Sending response:', JSON.stringify(responseData, null, 2));
    res.json(responseData);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews',
      error: error.message
    });
  }
});

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private (Any authenticated user)
router.post('/', auth, [
  body('project').isMongoId(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('satisfaction').isIn(['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied']),
  body('comment').notEmpty().trim().escape()
], async (req, res) => {
  try {
    console.log('Creating review with data:', req.body);
    console.log('User:', req.user._id, 'Role:', req.user.role);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { project, rating, satisfaction, comment, images } = req.body;

    // Check if project exists
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      console.log('Project not found:', project);
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user already reviewed this project
    const existingReview = await Review.findOne({ project, reviewer: req.user._id });
    if (existingReview) {
      console.log('User already reviewed this project');
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this project'
      });
    }

    const review = new Review({
      project,
      reviewer: req.user._id,
      rating,
      satisfaction,
      comment,
      images: images || []
    });

    console.log('Saving review:', review);
    await review.save();
    await review.populate('reviewer', 'username fullName');

    console.log('Review saved successfully:', review);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: { review }
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting review'
    });
  }
});

// @route   PUT /api/reviews/:id/respond
// @desc    Respond to a review (contractor only)
// @access  Private (Contractor only)
router.put('/:id/respond', auth, authorize('contractor'), [
  body('response').notEmpty().trim().escape()
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

    const review = await Review.findById(req.params.id).populate('project');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if contractor is assigned to the project
    if (review.project.assignedContractor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only respond to reviews of your assigned projects'
      });
    }

    review.contractorResponse = {
      text: req.body.response,
      respondedBy: req.user._id,
      respondedAt: new Date()
    };

    await review.save();
    await review.populate('contractorResponse.respondedBy', 'username fullName');

    res.json({
      success: true,
      message: 'Response added successfully',
      data: { review }
    });
  } catch (error) {
    console.error('Respond to review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while responding to review'
    });
  }
});

// @route   PUT /api/reviews/:id/verify
// @desc    Verify a review (admin only)
// @access  Private (Admin only)
router.put('/:id/verify', auth, authorize('admin'), async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.isVerified = true;
    review.verifiedBy = req.user._id;
    review.verifiedAt = new Date();

    await review.save();

    res.json({
      success: true,
      message: 'Review verified successfully',
      data: { review }
    });
  } catch (error) {
    console.error('Verify review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying review'
    });
  }
});

// @route   GET /api/reviews/user/:userId
// @desc    Get reviews by a user
// @access  Private
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Users can only see their own reviews unless they're admin
    if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const reviews = await Review.find({ reviewer: userId })
      .populate('project', 'title municipality status')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { reviews }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user reviews'
    });
  }
});

// @route   GET /api/reviews/contractor-reviews
// @desc    Get all reviews for contractor's projects
// @access  Private (Contractor only)
router.get('/contractor-reviews', auth, authorize('contractor'), async (req, res) => {
  try {
    // Find all projects assigned to this contractor
    const contractorProjects = await Project.find({ assignedContractor: req.user._id });
    const projectIds = contractorProjects.map(p => p._id);

    // Find all reviews for these projects
    const reviews = await Review.find({ project: { $in: projectIds } })
      .populate('reviewer', 'username fullName')
      .populate('project', 'title municipality status')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { reviews }
    });
  } catch (error) {
    console.error('Get contractor reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching contractor reviews'
    });
  }
});

// @route   GET /api/reviews/all
// @desc    Get all reviews (admin only)
// @access  Private (Admin only)
router.get('/all', auth, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, project, contractor, rating } = req.query;
    
    // Build filter
    const filter = {};
    if (project) filter.project = project;
    if (rating) filter.rating = parseInt(rating);
    
    let reviews = await Review.find(filter)
      .populate('reviewer', 'username fullName email role')
      .populate('project', 'title municipality assignedContractor')
      .populate('contractorResponse.respondedBy', 'username fullName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // If contractor filter is applied, filter by assigned contractor
    if (contractor) {
      reviews = reviews.filter(review => 
        review.project.assignedContractor && 
        review.project.assignedContractor.toString() === contractor
      );
    }

    const total = await Review.countDocuments(filter);

    res.json({
      success: true,
      data: { reviews },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
        hasMore: page < Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put('/:id', auth, [
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('satisfaction').optional().isIn(['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied']),
  body('comment').optional().notEmpty().trim().escape()
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

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review or is admin
    if (review.reviewer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { rating, satisfaction, comment, images } = req.body;

    if (rating !== undefined) review.rating = rating;
    if (satisfaction !== undefined) review.satisfaction = satisfaction;
    if (comment !== undefined) review.comment = comment;
    if (images !== undefined) review.images = images;

    await review.save();
    await review.populate('reviewer', 'username fullName');

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: { review }
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating review'
    });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review or is admin
    if (review.reviewer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting review'
    });
  }
});

module.exports = router;
