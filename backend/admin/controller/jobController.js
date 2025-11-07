import Job from '../../models/Job.js';
import Employer from '../../models/Employer.js';

// @desc    Get all jobs with admin filters
// @route   GET /api/admin/jobs
// @access  Private (Admin only)
export const getAllJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      jobType = '',
      workplaceType = '',
    } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (jobType) {
      filter.jobType = jobType;
    }

    if (workplaceType) {
      filter.workplaceType = workplaceType;
    }

    if (search) {
      filter.$or = [
        { jobTitle: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [jobs, total, statsAggregate] = await Promise.all([
      Job.find(filter)
        .populate('employer', 'name email companyName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Job.countDocuments(filter),
      Job.aggregate([
        {
          $group: {
            _id: null,
            totalJobs: { $sum: 1 },
            activeJobs: {
              $sum: {
                $cond: [{ $eq: ['$status', 'active'] }, 1, 0],
              },
            },
            pendingJobs: {
              $sum: {
                $cond: [{ $eq: ['$status', 'pending'] }, 1, 0],
              },
            },
            closedJobs: {
              $sum: {
                $cond: [{ $eq: ['$status', 'closed'] }, 1, 0],
              },
            },
            draftJobs: {
              $sum: {
                $cond: [{ $eq: ['$status', 'draft'] }, 1, 0],
              },
            },
            totalApplicants: { $sum: '$applications' },
            totalViews: { $sum: '$views' },
          },
        },
      ]),
    ]);

    const stats = statsAggregate[0] || {
      totalJobs: 0,
      activeJobs: 0,
      pendingJobs: 0,
      closedJobs: 0,
      draftJobs: 0,
      totalApplicants: 0,
      totalViews: 0,
    };

    res.status(200).json({
      success: true,
      data: {
        jobs,
        stats,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get all jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get job by ID
// @route   GET /api/admin/jobs/:id
// @access  Private (Admin only)
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', 'name email companyName phone');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { job },
    });
  } catch (error) {
    console.error('Get job by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Update job status (active/closed/pending)
// @route   PATCH /api/admin/jobs/:id/status
// @access  Private (Admin only)
export const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['draft', 'active', 'closed', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    job.status = status;
    await job.save();

    res.status(200).json({
      success: true,
      message: 'Job status updated successfully',
      data: { job },
    });
  } catch (error) {
    console.error('Update job status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/admin/jobs/:id
// @access  Private (Admin only)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
