import express from 'express';
const router = express.Router();
import { protectEmployer } from '../../middleware/employerMiddleware.js';
import {
  employerSignup,
  employerLogin,
  getEmployer,
} from '../controller/authController.js';

// Public routes
router.post('/signup', employerSignup);
router.post('/login', employerLogin);

// Protected routes
router.get('/me', protectEmployer, getEmployer);

export default router;

