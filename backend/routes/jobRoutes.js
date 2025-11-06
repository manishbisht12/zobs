import express from 'express';
const router = express.Router();
import {
  getPublicJobs,
  getJobById,
} from '../controller/jobController.js';

// Public routes - no authentication required
router.get('/', getPublicJobs);
router.get('/:id', getJobById);

export default router;

