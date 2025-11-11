import express from 'express';
import {
  listApplicantThreads,
  getConversationWithEmployer,
  sendMessageToEmployer,
} from '../controller/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', listApplicantThreads);
router.get('/:employerId', getConversationWithEmployer);
router.post('/:employerId', sendMessageToEmployer);

export default router;



