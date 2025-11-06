import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employer',
    required: [true, 'Please provide an employer'],
  },
  jobTitle: {
    type: String,
    required: [true, 'Please provide a job title'],
    trim: true,
  },
  companyName: {
    type: String,
    required: [true, 'Please provide a company name'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Please provide a location'],
    trim: true,
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
    default: 'full-time',
  },
  workplaceType: {
    type: String,
    enum: ['on-site', 'remote', 'hybrid'],
    default: 'on-site',
  },
  experience: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
    default: 'entry',
  },
  salaryMin: {
    type: Number,
    default: null,
  },
  salaryMax: {
    type: Number,
    default: null,
  },
  currency: {
    type: String,
    enum: ['USD', 'EUR', 'GBP', 'INR'],
    default: 'USD',
  },
  category: {
    type: String,
    trim: true,
    default: '',
  },
  skills: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    required: [true, 'Please provide a job description'],
    trim: true,
  },
  responsibilities: {
    type: String,
    trim: true,
    default: '',
  },
  requirements: {
    type: String,
    trim: true,
    default: '',
  },
  benefits: {
    type: String,
    trim: true,
    default: '',
  },
  contactEmail: {
    type: String,
    required: [true, 'Please provide a contact email'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  contactPhone: {
    type: String,
    trim: true,
    default: '',
  },
  companyWebsite: {
    type: String,
    trim: true,
    default: '',
  },
  applicationDeadline: {
    type: Date,
    default: null,
  },
  numberOfOpenings: {
    type: Number,
    default: 1,
    min: 1,
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'closed', 'pending'],
    default: 'active',
  },
  views: {
    type: Number,
    default: 0,
  },
  applications: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Index for better search performance
jobSchema.index({ jobTitle: 'text', description: 'text', location: 'text' });
jobSchema.index({ employer: 1, status: 1 });
jobSchema.index({ createdAt: -1 });

const Job = mongoose.model('Job', jobSchema);

export default Job;

