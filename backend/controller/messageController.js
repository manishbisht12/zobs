import Application from '../models/Application.js';
import Message from '../models/Message.js';
import Employer from '../models/Employer.js';
import { emitMessageUpdate } from '../socket/index.js';

const ensureEmployerRelationship = async (applicantId, employerId) => {
  if (!employerId) return null;

  const application = await Application.findOne({
    employer: employerId,
    user: applicantId,
  })
    .select('job employer applicantName applicantEmail')
    .populate('job', 'jobTitle')
    .populate('employer', 'companyName name email phone');

  return application;
};

export const listApplicantThreads = async (req, res) => {
  try {
    const applicantId = req.user?._id;

    const threads = await Message.aggregate([
      { $match: { applicant: applicantId } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$employer',
          lastMessage: { $first: '$body' },
          lastMessageAt: { $first: '$createdAt' },
          lastSenderType: { $first: '$senderType' },
          unreadCount: {
            $sum: {
              $cond: [{ $and: [{ $eq: ['$senderType', 'employer'] }, { $eq: ['$readByApplicant', false] }] }, 1, 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'employers',
          localField: '_id',
          foreignField: '_id',
          as: 'employer',
        },
      },
      { $unwind: '$employer' },
      {
        $project: {
          employerId: '$_id',
          employerName: { $ifNull: ['$employer.companyName', '$employer.name'] },
          employerEmail: '$employer.email',
          lastMessage: 1,
          lastMessageAt: 1,
          lastSenderType: 1,
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
    console.error('List applicant threads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching message threads',
      error: error.message,
    });
  }
};

export const getConversationWithEmployer = async (req, res) => {
  try {
    const applicantId = req.user?._id;
    const { employerId } = req.params;

    if (!employerId) {
      return res.status(400).json({
        success: false,
        message: 'employerId parameter is required',
      });
    }

    const application = await ensureEmployerRelationship(applicantId, employerId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'No relationship with the specified employer was found',
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
        readByApplicant: false,
      },
      { $set: { readByApplicant: true } }
    );

    const employer = await Employer.findById(employerId).select('name companyName email phone');

    res.status(200).json({
      success: true,
      data: {
        employer: employer
          ? {
              id: employer._id,
              name: employer.companyName || employer.name,
              email: employer.email,
              phone: employer.phone,
            }
          : { id: employerId },
        messages,
      },
    });
  } catch (error) {
    console.error('Get applicant conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching conversation',
      error: error.message,
    });
  }
};

export const sendMessageToEmployer = async (req, res) => {
  try {
    const applicantId = req.user?._id;
    const { employerId } = req.params;
    const { message } = req.body;
    const text = (message || '').trim();
    const file = req.file;

    if (!employerId) {
      return res.status(400).json({
        success: false,
        message: 'employerId parameter is required',
      });
    }

    if (!text && !file) {
      return res.status(400).json({
        success: false,
        message: 'Provide a message or an attachment',
      });
    }

    const application = await ensureEmployerRelationship(applicantId, employerId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'No relationship with the specified employer was found',
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
      job: application.job,
      senderType: 'applicant',
      senderId: applicantId,
      body: preview,
      attachments,
      readByEmployer: false,
      readByApplicant: true,
    });

    emitMessageUpdate({
      employerId: messageDoc.employer,
      applicantId: messageDoc.applicant,
      message: messageDoc,
      context: {
        employerName: application.employer?.companyName || application.employer?.name || '',
        employerEmail: application.employer?.email || '',
        applicantName: application.applicantName,
        applicantEmail: application.applicantEmail,
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
    console.error('Applicant send message error:', error);

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


