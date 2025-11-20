const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Project reference is required']
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Updater reference is required']
  },
  updateType: {
    type: String,
    enum: ['Status Change', 'Progress Update', 'Photo Update', 'Budget Update', 'Timeline Change', 'Issue Report'],
    required: [true, 'Update type is required']
  },
  title: {
    type: String,
    required: [true, 'Update title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Update description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  images: [{
    type: String,
    trim: true
  }],
  previousStatus: {
    type: String
  },
  newStatus: {
    type: String,
    enum: ['Planned', 'In Progress', 'Delayed', 'Completed', 'Cancelled']
  },
  previousProgress: {
    type: Number,
    min: 0,
    max: 100
  },
  newProgress: {
    type: Number,
    min: 0,
    max: 100
  },
  budgetUpdate: {
    allocated: Number,
    spent: Number,
    description: String
  },
  timelineUpdate: {
    newStartDate: Date,
    newEndDate: Date,
    reason: String
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for efficient queries
updateSchema.index({ project: 1, createdAt: -1 });
updateSchema.index({ updatedBy: 1 });
updateSchema.index({ updateType: 1 });
updateSchema.index({ isPublic: 1 });

// Method to get update summary
updateSchema.methods.getSummary = function() {
  return {
    id: this._id,
    title: this.title,
    type: this.updateType,
    date: this.createdAt,
    project: this.project,
    hasImages: this.images && this.images.length > 0
  };
};

module.exports = mongoose.model('Update', updateSchema);
