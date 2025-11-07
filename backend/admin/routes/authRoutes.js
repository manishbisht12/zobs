import express from 'express';
import { adminSignup, adminLogin, getAdmin } from '../controller/authController.js';
import { protectAdmin } from '../../middleware/adminMiddleware.js';

const router = express.Router();

// Public routes
router.post('/signup', adminSignup);
router.post('/login', adminLogin);

// Protected routes
router.get('/me', protectAdmin, getAdmin);

export default router;

