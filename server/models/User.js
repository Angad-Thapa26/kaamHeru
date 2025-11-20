const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: ['public', 'contractor', 'admin'],
    default: 'public'
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  phoneNumber: {
    type: String,
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  address: {
    type: String,
    trim: true,
    maxlength: [200, 'Address cannot exceed 200 characters']
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
  profileImage: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  contractorDetails: {
    contractorId: {
      type: String,
      unique: true,
      sparse: true // Allow multiple null values for non-contractors
    },
    companyName: String,
    licenseNumber: String,
    specialization: [String],
    experience: Number,
    completedProjects: {
      type: Number,
      default: 0
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: String,
      default: null
    },
    verifiedAt: {
      type: Date,
      default: null
    }
  },
  oauthProviders: {
    google: {
      id: String,
      email: String
    }
  },
  isOAuthUser: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get public profile method
userSchema.methods.getPublicProfile = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
