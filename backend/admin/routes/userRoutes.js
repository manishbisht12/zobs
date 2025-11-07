import express from 'express';
import {
  getAllUsers,
  getAllEmployers,
  getUserById,
  getEmployerById,
  updateUserStatus,
  updateEmployerStatus,
  deleteUser,
  deleteEmployer,
  getStats,
} from '../controller/userController.js';
import { protectAdmin } from '../../middleware/adminMiddleware.js';

const router = express.Router();

// All routes are protected (admin only)
router.use(protectAdmin);

// Statistics
router.get('/stats', getStats);

// Users routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// Employers routes
router.get('/employers', getAllEmployers);
router.get('/employers/:id', getEmployerById);
router.patch('/employers/:id/status', updateEmployerStatus);
router.delete('/employers/:id', deleteEmployer);

export default router;

