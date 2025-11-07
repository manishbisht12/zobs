import express from 'express';
import {
  getAllJobs,
  getJobById,
  updateJobStatus,
  deleteJob,
} from '../controller/jobController.js';
import { protectAdmin } from '../../middleware/adminMiddleware.js';

const router = express.Router();

// All admin job routes require authentication
router.use(protectAdmin);

router.get('/jobs', getAllJobs);
router.get('/jobs/:id', getJobById);
router.patch('/jobs/:id/status', updateJobStatus);
router.delete('/jobs/:id', deleteJob);

export default router;

