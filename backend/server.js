import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import employerAuthRoutes from './employer/routes/authRoutes.js';
import employerJobRoutes from './employer/routes/jobRoutes.js';
import adminAuthRoutes from './admin/routes/authRoutes.js';
import adminUserRoutes from './admin/routes/userRoutes.js';
import adminJobRoutes from './admin/routes/jobRoutes.js';
import jobRoutes from './routes/jobRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Zobs API',
    status: 'Server is running'
  });
});

// Auth Routes (General)
app.use('/api/auth', authRoutes);

// Employer Auth Routes
app.use('/api/employer/auth', employerAuthRoutes);

// Employer Job Routes
app.use('/api/employer/jobs', employerJobRoutes);

// Admin Auth Routes
app.use('/api/admin/auth', adminAuthRoutes);

// Admin User Management Routes
app.use('/api/admin', adminUserRoutes);

// Admin Job Management Routes
app.use('/api/admin', adminJobRoutes);

// Public Job Routes (for job portal)
app.use('/api/jobs', jobRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
