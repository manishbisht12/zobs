import express from 'express';
const router = express.Router();
import { protectEmployer } from '../../middleware/employerMiddleware.js';
import {
  createJob,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobStats,
} from '../controller/jobController.js';

// All routes are protected (require employer authentication)
router.use(protectEmployer);

// Job routes
router.post('/', createJob);
router.get('/stats', getJobStats);
router.get('/', getMyJobs);
router.get('/:id', getJobById);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;

