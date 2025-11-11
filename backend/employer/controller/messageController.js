import Application from '../../models/Application.js';
import Message from '../../models/Message.js';
import Employer from '../../models/Employer.js';
import { emitMessageUpdate } from '../../socket/index.js';

const ensureApplicantRelationship = async (employerId, applicantId) => {
  if (!applicantId) return null;

  const application = await Application.findOne({
    employer: employerId,
    user: applicantId,
  })
    .select('job user applicantName applicantEmail applicantPhone')
    .populate('job', 'jobTitle')
    .populate('user', 'name email phone');

  return application;
};

export const listEmployerThreads = async (req, res) => {
  try {
    const employerId = req.employer?._id;

    const threads = await Message.aggregate([
      { $match: { employer: employerId } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$applicant',
          applicant: { $first: '$applicant' },
          lastMessage: { $first: '$body' },
          lastMessageAt: { $first: '$createdAt' },
          lastSenderType: { $first: '$senderType' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$senderType', 'applicant'] },
                    { $eq: ['$readByEmployer', false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'applicant',
        },
      },
      { $unwind: '$applicant' },
      {
        $project: {
          applicantId: '$applicant._id',
          applicantName: '$applicant.name',
          applicantEmail: '$applicant.email',
          lastMessage: 1,
          lastMessageAt: 1,
          lastSenderType: '$lastSenderType',
          unreadCount: 1,
        },
      },
      { $sort: { lastMessageAt: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        threads,
      },
    });
  } catch (error) {
    console.error('List employer threads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching message threads',
      error: error.message,
    });
  }
};

export const getConversationWithApplicant = async (req, res) => {
  try {
    const employerId = req.employer?._id;
    const { applicantId } = req.query;

    if (!applicantId) {
      return res.status(400).json({
        success: false,
        message: 'applicantId query parameter is required',
      });
    }

    const application = await ensureApplicantRelationship(employerId, applicantId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'No relationship with the specified applicant was found',
      });
    }

    const messages = await Message.find({
      employer: employerId,
      applicant: applicantId,
    })
      .sort({ createdAt: 1 })
      .lean();

    await Message.updateMany(
      {
        employer: employerId,
        applicant: applicantId,
        readByEmployer: false,
      },
      { $set: { readByEmployer: true } }
    );

    const applicant = application.user || null;

    res.status(200).json({
      success: true,
      data: {
        applicant: applicant
          ? {
              id: applicant._id,
              name: applicant.name,
              email: applicant.email,
              phone: applicant.phone,
              jobTitle: application.job?.jobTitle || '',
            }
          : {
              id: applicantId,
              name: application.applicantName,
              email: application.applicantEmail,
              phone: application.applicantPhone || '',
              jobTitle: application.job?.jobTitle || '',
            },
        messages,
      },
    });
  } catch (error) {
    console.error('Employer get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching conversation',
      error: error.message,
    });
  }
};

export const sendMessageToApplicant = async (req, res) => {
  try {
    const employerId = req.employer?._id;
    const { applicantId, message, jobId } = req.body;
    const text = (message || '').trim();
    const file = req.file;

    if (!applicantId) {
      return res.status(400).json({
        success: false,
        message: 'applicantId is required',
      });
    }

    if (!text && !file) {
      return res.status(400).json({
        success: false,
        message: 'Provide a message or an attachment',
      });
    }

    const application = await ensureApplicantRelationship(employerId, applicantId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'No relationship with the specified applicant was found',
      });
    }

    const attachments = [];

    if (file) {
      attachments.push({
        name: file.originalname,
        url: `/uploads/messages/${file.filename}`,
        type: file.mimetype,
        size: file.size,
      });
    }

    const preview = text || (attachments[0]?.name ? `Attachment: ${attachments[0].name}` : '');

    const messageDoc = await Message.create({
      employer: employerId,
      applicant: applicantId,
      job: jobId || application.job,
      senderType: 'employer',
      senderId: employerId,
      body: preview,
      attachments,
      readByEmployer: true,
      readByApplicant: false,
    });

    emitMessageUpdate({
      employerId,
      applicantId: messageDoc.applicant,
      message: messageDoc,
      context: {
        applicantName: application.applicantName,
        applicantEmail: application.applicantEmail,
        employerName: req.employer?.companyName || req.employer?.name || '',
        employerEmail: req.employer?.email || '',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        message: messageDoc,
      },
    });
  } catch (error) {
    console.error('Employer send message error:', error);

    if (error.message === 'Unsupported file type') {
      return res.status(400).json({
        success: false,
        message: 'Unsupported file type',
      });
    }

    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Attachment exceeds the 10MB limit',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while sending message',
      error: error.message,
    });
  }
};

