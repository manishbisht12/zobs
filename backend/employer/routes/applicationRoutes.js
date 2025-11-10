import express from 'express';
import {
  getApplications,
  updateApplicationStatus,
  getApplicationStats,
} from '../controller/applicationController.js';
import { protectEmployer } from '../../middleware/employerMiddleware.js';

const router = express.Router();

router.get('/', protectEmployer, getApplications);
router.get('/stats', protectEmployer, getApplicationStats);
router.put('/:id/status', protectEmployer, updateApplicationStatus);

export default router;


