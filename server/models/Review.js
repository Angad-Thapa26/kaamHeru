const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Project reference is required']
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reviewer reference is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating cannot be less than 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  satisfaction: {
    type: String,
    enum: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
    required: [true, 'Satisfaction level is required']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  images: [{
    type: String,
    trim: true
  }],
  contractorResponse: {
    text: {
      type: String,
      maxlength: [1000, 'Response cannot exceed 1000 characters']
    },
    respondedAt: {
      type: Date
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
reviewSchema.index({ project: 1, reviewer: 1 });
reviewSchema.index({ project: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });

// Ensure one review per user per project
reviewSchema.index({ project: 1, reviewer: 1 }, { unique: true });

// Pre-save middleware to set response timestamp
reviewSchema.pre('save', function(next) {
  if (this.isModified('contractorResponse.text') && this.contractorResponse.text) {
    this.contractorResponse.respondedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Review', reviewSchema);
