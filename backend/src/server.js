import app from './app.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas Database
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
    console.log(`Health endpoint: http://localhost:${PORT}/api/health`);
  });
}).catch(err => {
  console.error('Failed to initialize database connection:', err);
  process.exit(1);
});
