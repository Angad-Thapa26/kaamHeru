const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// @route   GET /api/health
// @desc    Health check endpoint
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Check MongoDB connection
    const mongoState = mongoose.connection.readyState;
    const mongoStatus = mongoState === 1 ? 'connected' : 'disconnected';
    
    res.json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      database: {
        status: mongoStatus,
        state: mongoState
      },
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message
    });
  }
});

module.exports = router;
