import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't return password by default
  },
  role: {
    type: String,
    enum: ['admin', 'jobseeker'],
    default: 'jobseeker',
  },
  // Job Seeker specific fields
  phone: {
    type: String,
    trim: true,
    default: '',
  },
  address: {
    street: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, default: '' },
    state: { type: String, trim: true, default: '' },
    zipCode: { type: String, trim: true, default: '' },
    country: { type: String, trim: true, default: '' },
  },
  dateOfBirth: {
    type: Date,
    default: null,
  },
  profileImage: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    trim: true,
    default: '',
    maxlength: [500, 'Bio cannot exceed 500 characters'],
  },
  skills: {
    type: [String],
    default: [],
  },
  experience: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'lead'],
    default: 'entry',
  },
  education: [{
    degree: { type: String, trim: true },
    institution: { type: String, trim: true },
    field: { type: String, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },
  }],
  workExperience: [{
    title: { type: String, trim: true },
    company: { type: String, trim: true },
    location: { type: String, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },
    description: { type: String, trim: true },
  }],
  resume: {
    type: String,
    default: '',
  },
  linkedIn: {
    type: String,
    trim: true,
    default: '',
  },
  portfolio: {
    type: String,
    trim: true,
    default: '',
  },
  // Status fields
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  // Admin specific fields (only used when role is 'admin')
  permissions: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;

