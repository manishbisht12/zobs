import express from 'express';
const router = express.Router();
import { signup, login, getMe } from '../controller/authController.js';
import { protect } from '../middleware/authMiddleware.js';

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

export default router;

