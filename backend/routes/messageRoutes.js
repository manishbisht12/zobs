import express from 'express';
import {
  listApplicantThreads,
  getConversationWithEmployer,
  sendMessageToEmployer,
} from '../controller/messageController.js';
import { protect } from '../middleware/authMiddleware.js';
import { singleAttachment } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', listApplicantThreads);
router.get('/:employerId', getConversationWithEmployer);
router.post('/:employerId', singleAttachment, sendMessageToEmployer);

export default router;



