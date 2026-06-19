import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import helmet from 'helmet';
import compression from 'compression';
import visitorRoutes from './routes/visitorRoutes.js';
import popupLeadRoutes from './routes/popupLeadRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import authRoutes from './routes/authRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Configure trust proxy behind Render's infrastructure for accurate rate limiting
app.set('trust proxy', 1);

// Apply Helmet security headers with production-safe configurations
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Apply Compression for API payloads and JSON responses
app.use(compression());

// Harden CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. backend tools, mobile apps, or local scripts)
    if (!origin) return callback(null, true);

    const isLocal = origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:');

    // Dynamic localhost checking for non-production environments
    if (process.env.NODE_ENV !== 'production' && isLocal) {
      return callback(null, true);
    }

    // Static comparison against the production frontend URL configuration
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};
app.use(cors(corsOptions));

// Parse JSON request bodies with body size limits to prevent flood DoS attacks
app.use(express.json({ limit: '10kb' }));

// Health Check endpoint
app.get('/api/health', (req, res) => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  const dbStatus = states[mongoose.connection.readyState] || 'unknown';

  res.status(200).json({
    status: "OK",
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Register API Routes
app.use('/api/visitors', visitorRoutes);
app.use('/api/popup-leads', popupLeadRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/admin', authRoutes);
app.use('/api/reviews', reviewRoutes);

// Catch-all route for unhandled routes
app.use((req, res, next) => {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
});

// Global Error Handler Middleware
app.use(errorHandler);

export default app;
