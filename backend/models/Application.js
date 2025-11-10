import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employer',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    applicantName: {
      type: String,
      required: [true, 'Please provide applicant name'],
      trim: true,
    },
    applicantEmail: {
      type: String,
      required: [true, 'Please provide applicant email'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    applicantPhone: {
      type: String,
      trim: true,
      default: '',
    },
    resumeUrl: {
      type: String,
      trim: true,
      default: '',
    },
    coverLetter: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'interview', 'accepted', 'rejected'],
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    metadata: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ job: 1, applicantEmail: 1 }, { unique: true, sparse: true });
applicationSchema.index({ employer: 1, status: 1, createdAt: -1 });

const Application = mongoose.model('Application', applicationSchema);

export default Application;


