import Application from '../../models/Application.js';

const formatStatus = (status) => {
  if (!status) return 'pending';
  return status.toLowerCase();
};

export const getApplications = async (req, res) => {
  try {
    const employerId = req.employer?._id;
    const {
      status,
      jobId,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { employer: employerId };

    if (status && status !== 'all') {
      query.status = formatStatus(status);
    }

    if (jobId) {
      query.job = jobId;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { applicantName: regex },
        { applicantEmail: regex },
        { notes: regex },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate('job', 'jobTitle companyName location')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Application.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: {
        applications,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum) || 1,
        },
      },
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching applications',
      error: error.message,
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const employerId = req.employer?._id;
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    const validStatuses = ['pending', 'reviewed', 'interview', 'accepted', 'rejected'];

    const normalizedStatus = formatStatus(status);

    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const application = await Application.findOneAndUpdate(
      { _id: id, employer: employerId },
      {
        status: normalizedStatus,
        ...(notes !== undefined ? { notes } : {}),
      },
      { new: true }
    ).populate('job', 'jobTitle companyName');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: {
        application,
      },
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating application',
      error: error.message,
    });
  }
};

export const getApplicationStats = async (req, res) => {
  try {
    const employerId = req.employer?._id;

    const baseMatch = { employer: employerId };

    const [totals, recentApplications] = await Promise.all([
      Application.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
      Application.find(baseMatch)
        .populate('job', 'jobTitle companyName')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    const statusCounts = totals.reduce(
      (acc, item) => {
        acc[item._id || 'pending'] = item.count;
        acc.total += item.count;
        return acc;
      },
      {
        total: 0,
        pending: 0,
        reviewed: 0,
        interview: 0,
        accepted: 0,
        rejected: 0,
      }
    );

    res.status(200).json({
      success: true,
      data: {
        stats: statusCounts,
        recentApplications,
      },
    });
  } catch (error) {
    console.error('Get application stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching application stats',
      error: error.message,
    });
  }
};


