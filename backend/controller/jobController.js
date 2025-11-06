import Job from '../models/Job.js';

// @desc    Get all public jobs (for job portal)
// @route   GET /api/jobs
// @access  Public
export const getPublicJobs = async (req, res) => {
  try {
    const {
      search,
      location,
      jobType,
      workplaceType,
      experience,
      salaryMin,
      salaryMax,
      category,
      page = 1,
      limit = 20,
    } = req.query;

    // Build query - only active jobs
    const query = { status: 'active' };

    // Search filter
    if (search) {
      query.$or = [
        { jobTitle: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Job type filter
    if (jobType) {
      query.jobType = jobType;
    }

    // Workplace type filter
    if (workplaceType) {
      query.workplaceType = workplaceType;
    }

    // Experience filter
    if (experience) {
      query.experience = experience;
    }

    // Salary range filter
    if (salaryMin || salaryMax) {
      query.$or = query.$or || [];
      if (salaryMin && salaryMax) {
        query.$and = [
          { $or: [{ salaryMin: { $gte: Number(salaryMin) } }, { salaryMin: null }] },
          { $or: [{ salaryMax: { $lte: Number(salaryMax) } }, { salaryMax: null }] },
        ];
      } else if (salaryMin) {
        query.$or.push({ salaryMin: { $gte: Number(salaryMin) } });
      } else if (salaryMax) {
        query.$or.push({ salaryMax: { $lte: Number(salaryMax) } });
      }
    }

    // Category filter
    if (category) {
      query.category = { $regex: category, $options: 'i' };
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
      .populate('employer', 'name companyName companyWebsite')
      .select('-__v');

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
    console.error('Get public jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching jobs',
      error: error.message,
    });
  }
};

// @desc    Get a single job by ID (public)
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', 'name companyName companyWebsite phone address')
      .select('-__v');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Increment views
    job.views += 1;
    await job.save();

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

