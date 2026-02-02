import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';

// Route imports
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import planRoutes from './routes/plan.js';
import weightRoutes from './routes/weight.js';
import workoutRoutes from './routes/workout.js';
import stepsRoutes from './routes/steps.js';
import mealsRoutes from './routes/meals.js';
import analyticsRoutes from './routes/analytics.js';

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
const allowedOrigins = [
  'https://fitrackify.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/plan', planRoutes);
app.use('/api/weight', weightRoutes);
app.use('/api/workout', workoutRoutes);
app.use('/api/steps', stepsRoutes);
app.use('/api/meals', mealsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
