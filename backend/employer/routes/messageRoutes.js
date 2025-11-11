import express from 'express';
import {
  listEmployerThreads,
  getConversationWithApplicant,
  sendMessageToApplicant,
} from '../controller/messageController.js';
import { protectEmployer } from '../../middleware/employerMiddleware.js';

const router = express.Router();

router.use(protectEmployer);

router.get('/threads', listEmployerThreads);
router.get('/conversation', getConversationWithApplicant);
router.post('/', sendMessageToApplicant);

export default router;

