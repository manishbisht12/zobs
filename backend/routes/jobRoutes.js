import express from 'express';
const router = express.Router();
import {
  getPublicJobs,
  getJobById,
  applyToJob,
} from '../controller/jobController.js';
import { protect } from '../middleware/authMiddleware.js';

// Public routes - no authentication required
router.get('/', getPublicJobs);
router.get('/:id', getJobById);
router.post('/:id/apply', protect, applyToJob);

export default router;

