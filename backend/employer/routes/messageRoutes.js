import express from 'express';
import {
  listEmployerThreads,
  getConversationWithApplicant,
  sendMessageToApplicant,
} from '../controller/messageController.js';
import { protectEmployer } from '../../middleware/employerMiddleware.js';
import { singleAttachment } from '../../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protectEmployer);

router.get('/threads', listEmployerThreads);
router.get('/conversation', getConversationWithApplicant);
router.post('/', singleAttachment, sendMessageToApplicant);

export default router;

