import express from 'express';
import {
  getApplications,
  updateApplicationStatus,
  getApplicationStats,
  getApplicantsDirectory,
} from '../controller/applicationController.js';
import { protectEmployer } from '../../middleware/employerMiddleware.js';

const router = express.Router();

router.get('/', protectEmployer, getApplications);
router.get('/applicants', protectEmployer, getApplicantsDirectory);
router.get('/stats', protectEmployer, getApplicationStats);
router.put('/:id/status', protectEmployer, updateApplicationStatus);

export default router;


