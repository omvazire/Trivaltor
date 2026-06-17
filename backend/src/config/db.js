import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

// Configure DNS resolution servers (Cloudflare and Google) to bypass local resolution blocks
dns.setServers(['1.1.1.1', '8.8.8.8']);

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
