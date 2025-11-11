import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Employer from '../models/Employer.js';
import User from '../models/User.js';

let ioInstance = null;

const conversationRoom = (employerId, applicantId) =>
  `conversation:${employerId}:${applicantId}`;

const sanitizeMessage = (messageDoc) => ({
  _id: messageDoc._id.toString(),
  employer: messageDoc.employer?.toString?.() ?? messageDoc.employer,
  applicant: messageDoc.applicant?.toString?.() ?? messageDoc.applicant,
  job: messageDoc.job ? messageDoc.job.toString() : null,
  senderType: messageDoc.senderType,
  senderId: messageDoc.senderId?.toString?.() ?? messageDoc.senderId,
  body: messageDoc.body,
  attachments: messageDoc.attachments ?? [],
  createdAt: messageDoc.createdAt,
  updatedAt: messageDoc.updatedAt,
});

export const initSocketServer = (httpServer) => {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  ioInstance.use(async (socket, next) => {
    try {
      const { token, role } = socket.handshake.auth || {};
      if (!token || !role) {
        return next(new Error('Unauthorized'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (role === 'employer') {
        const employer = await Employer.findById(decoded.id).select('_id');
        if (!employer) return next(new Error('Unauthorized'));
        socket.data.role = 'employer';
        socket.data.employerId = employer._id.toString();
      } else {
        const user = await User.findById(decoded.id).select('_id');
        if (!user) return next(new Error('Unauthorized'));
        socket.data.role = 'applicant';
        socket.data.applicantId = user._id.toString();
      }

      return next();
    } catch (error) {
      return next(new Error('Unauthorized'));
    }
  });

  ioInstance.on('connection', (socket) => {
    if (socket.data.role === 'employer') {
      socket.join(`employer:${socket.data.employerId}`);
    }
    if (socket.data.role === 'applicant') {
      socket.join(`applicant:${socket.data.applicantId}`);
    }

    socket.on('join_conversation', (payload = {}) => {
      const employerId =
        socket.data.role === 'employer'
          ? socket.data.employerId
          : payload.employerId;
      const applicantId =
        socket.data.role === 'applicant'
          ? socket.data.applicantId
          : payload.applicantId;

      if (!employerId || !applicantId) return;
      socket.join(conversationRoom(employerId, applicantId));
    });

    socket.on('leave_conversation', (payload = {}) => {
      const employerId =
        socket.data.role === 'employer'
          ? socket.data.employerId
          : payload.employerId;
      const applicantId =
        socket.data.role === 'applicant'
          ? socket.data.applicantId
          : payload.applicantId;

      if (!employerId || !applicantId) return;
      socket.leave(conversationRoom(employerId, applicantId));
    });
  });

  return ioInstance;
};

export const getIO = () => ioInstance;

export const emitMessageUpdate = ({ employerId, applicantId, message, context = {} }) => {
  if (!ioInstance || !employerId || !applicantId || !message) return;

  const employerKey = employerId.toString();
  const applicantKey = applicantId.toString();
  const sanitized = sanitizeMessage(message);

  const payload = {
    employerId: employerKey,
    applicantId: applicantKey,
    message: sanitized,
    context,
  };

  const summary = {
    employerId: employerKey,
    applicantId: applicantKey,
    lastMessage: sanitized.body,
    lastMessageAt: sanitized.createdAt,
    senderType: sanitized.senderType,
    ...context,
  };

  ioInstance
    .to(conversationRoom(employerKey, applicantKey))
    .emit('message:new', payload);

  ioInstance.to(`employer:${employerKey}`).emit('conversation:updated', summary);
  ioInstance
    .to(`applicant:${applicantKey}`)
    .emit('conversation:updated', summary);
};


