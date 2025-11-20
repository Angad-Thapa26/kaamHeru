const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: [true, 'Project ID is required'],
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Project category is required'],
    enum: [
      'Road Construction',
      'Building Construction',
      'Water Supply',
      'Sanitation',
      'Electricity',
      'Education',
      'Health',
      'Agriculture',
      'Tourism',
      'Other'
    ]
  },
  municipality: {
    type: String,
    required: [true, 'Municipality is required'],
    enum: [
      'Bharatpur', 'Ratnanagar', 'Kawasoti', 'Gaindakot', 'Madhyabindu',
      'Bharatpur Metropolitain', 'Ratnanagar Municipality', 'Kawasoti Municipality',
      'Gaindakot Municipality', 'Madhyabindu Municipality'
    ]
  },
  location: {
    type: String,
    required: [true, 'Project location is required'],
    trim: true,
    maxlength: [300, 'Location cannot exceed 300 characters']
  },
  status: {
    type: String,
    enum: ['Planned', 'In Progress', 'Delayed', 'Completed', 'Cancelled'],
    default: 'Planned'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  budget: {
    allocated: {
      type: Number,
      required: [true, 'Allocated budget is required'],
      min: [0, 'Budget cannot be negative']
    },
    spent: {
      type: Number,
      default: 0,
      min: [0, 'Spent budget cannot be negative']
    }
  },
  timeline: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    actualStartDate: {
      type: Date
    },
    actualEndDate: {
      type: Date
    }
  },
  assignedContractor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  progress: {
    percentage: {
      type: Number,
      default: 0,
      min: [0, 'Progress cannot be less than 0'],
      max: [100, 'Progress cannot exceed 100']
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  images: [{
    type: String,
    trim: true
  }],
  documents: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isVisible: {
    type: Boolean,
    default: true
  },
  compliance: {
    approved: {
      type: Boolean,
      default: false
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: {
      type: Date
    },
    notes: {
      type: String,
      maxlength: [500, 'Compliance notes cannot exceed 500 characters']
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
projectSchema.index({ municipality: 1, status: 1 });
projectSchema.index({ assignedContractor: 1 });
projectSchema.index({ projectId: 1 });

// Validation to ensure end date is after start date
projectSchema.pre('save', function(next) {
  if (this.timeline.endDate <= this.timeline.startDate) {
    return next(new Error('End date must be after start date'));
  }
  next();
});

// Method to calculate project duration in days
projectSchema.methods.getDuration = function() {
  const start = new Date(this.timeline.startDate);
  const end = new Date(this.timeline.endDate);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
};

// Method to check if project is delayed
projectSchema.methods.isDelayed = function() {
  if (this.status === 'Completed' || this.status === 'Cancelled') return false;
  const now = new Date();
  return now > this.timeline.endDate && this.status !== 'Completed';
};

module.exports = mongoose.model('Project', projectSchema);
