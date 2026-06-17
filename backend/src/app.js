import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import visitorRoutes from './routes/visitorRoutes.js';
import popupLeadRoutes from './routes/popupLeadRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

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

// Catch-all route for unhandled routes
app.use((req, res, next) => {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
});

// Global Error Handler Middleware
app.use(errorHandler);

export default app;
