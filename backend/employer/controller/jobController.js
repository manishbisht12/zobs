import Job from '../../models/Job.js';
import mongoose from 'mongoose';

// @desc    Create a new job posting
// @route   POST /api/employer/jobs
// @access  Private (Employer only)
export const createJob = async (req, res) => {
  try {
    const {
      jobTitle,
      companyName,
      location,
      jobType,
      workplaceType,
      experience,
      salaryMin,
      salaryMax,
      currency,
      category,
      skills,
      description,
      responsibilities,
      requirements,
      benefits,
      contactEmail,
      contactPhone,
      companyWebsite,
      applicationDeadline,
      numberOfOpenings,
      status,
    } = req.body;

    // Validation
    if (!jobTitle || !companyName || !location || !description || !contactEmail) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (jobTitle, companyName, location, description, contactEmail)',
      });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(contactEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid contact email',
      });
    }

    // Parse skills if it's a string (comma-separated)
    let skillsArray = [];
    if (skills) {
      if (typeof skills === 'string') {
        skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
      } else if (Array.isArray(skills)) {
        skillsArray = skills;
      }
    }

    // Create job
    const job = await Job.create({
      employer: new mongoose.Types.ObjectId(req.user.id),
      jobTitle,
      companyName,
      location,
      jobType: jobType || 'full-time',
      workplaceType: workplaceType || 'on-site',
      experience: experience || 'entry',
      salaryMin: salaryMin ? Number(salaryMin) : null,
      salaryMax: salaryMax ? Number(salaryMax) : null,
      currency: currency || 'USD',
      category: category || '',
      skills: skillsArray,
      description,
      responsibilities: responsibilities || '',
      requirements: requirements || '',
      benefits: benefits || '',
      contactEmail,
      contactPhone: contactPhone || '',
      companyWebsite: companyWebsite || '',
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
      numberOfOpenings: numberOfOpenings ? Number(numberOfOpenings) : 1,
      status: status || 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      data: {
        job,
      },
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating job',
      error: error.message,
    });
  }
};

// @desc    Get all jobs for the logged-in employer
// @route   GET /api/employer/jobs
// @access  Private (Employer only)
export const getMyJobs = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = { employer: new mongoose.Types.ObjectId(req.user.id) };
    if (status) {
      query.status = status;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get jobs
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('employer', 'name email');

    // Get total count
    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        jobs,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching jobs',
      error: error.message,
    });
  }
};

// @desc    Get a single job by ID
// @route   GET /api/employer/jobs/:id
// @access  Private (Employer only)
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      employer: new mongoose.Types.ObjectId(req.user.id),
    }).populate('employer', 'name email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        job,
      },
    });
  } catch (error) {
    console.error('Get job by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching job',
      error: error.message,
    });
  }
};

// @desc    Update a job
// @route   PUT /api/employer/jobs/:id
// @access  Private (Employer only)
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      employer: new mongoose.Types.ObjectId(req.user.id),
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Parse skills if provided
    if (req.body.skills && typeof req.body.skills === 'string') {
      req.body.skills = req.body.skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    }

    // Update job
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: {
        job: updatedJob,
      },
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating job',
      error: error.message,
    });
  }
};

// @desc    Delete a job
// @route   DELETE /api/employer/jobs/:id
// @access  Private (Employer only)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      employer: new mongoose.Types.ObjectId(req.user.id),
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting job',
      error: error.message,
    });
  }
};

// @desc    Get job statistics for employer
// @route   GET /api/employer/jobs/stats
// @access  Private (Employer only)
export const getJobStats = async (req, res) => {
  try {
    const employerId = new mongoose.Types.ObjectId(req.user.id);
    const totalJobs = await Job.countDocuments({ employer: employerId });
    const activeJobs = await Job.countDocuments({ employer: employerId, status: 'active' });
    const draftJobs = await Job.countDocuments({ employer: employerId, status: 'draft' });
    const closedJobs = await Job.countDocuments({ employer: employerId, status: 'closed' });
    
    // Get total views and applications
    const stats = await Job.aggregate([
      { $match: { employer: employerId } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' },
          totalApplications: { $sum: '$applications' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalJobs,
          activeJobs,
          draftJobs,
          closedJobs,
          totalViews: stats[0]?.totalViews || 0,
          totalApplications: stats[0]?.totalApplications || 0,
        },
      },
    });
  } catch (error) {
    console.error('Get job stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching job statistics',
      error: error.message,
    });
  }
};

