const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || '';
  const isPlaceholder = !uri || 
    uri.includes('username:password') || 
    uri.includes('your_mongodb_atlas_uri') ||
    uri.includes('cluster.mongodb.net/marketingmediatree') || // Placeholder check
    uri === 'mongodb+srv://username:password@cluster.mongodb.net/marketingmediatree?retryWrites=true&w=majority';
    
  const isProduction = process.env.NODE_ENV === 'production' || process.env.NETLIFY === 'true';

  if (isPlaceholder) {
    if (isProduction) {
      throw new Error('MongoDB URI is not configured. Production requires a valid MONGODB_URI environment variable.');
    }
    console.log('\x1b[33m%s\x1b[0m', '---------------------------------------------------------');
    console.log('\x1b[33m%s\x1b[0m', '[WARNING] No valid MongoDB Atlas Connection URI detected.');
    console.log('\x1b[33m%s\x1b[0m', 'FALLING BACK TO LOCAL JSON FILE DATABASE (offline mode).');
    console.log('\x1b[33m%s\x1b[0m', 'Local data stored in: /backend/data/');
    console.log('\x1b[33m%s\x1b[0m', '---------------------------------------------------------');
    process.env.USE_LOCAL_JSON = 'true';
    return;
  }

  // Optimize for serverless Mongoose connection reuse
  if (mongoose.connection.readyState >= 1) {
    process.env.USE_LOCAL_JSON = 'false';
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    process.env.USE_LOCAL_JSON = 'false';
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `MongoDB Connection Error: ${error.message}`);
    if (isProduction) {
      throw error;
    }
    console.log('\x1b[33m%s\x1b[0m', 'MongoDB failed. Falling back to local JSON file database...');
    process.env.USE_LOCAL_JSON = 'true';
  }
};

module.exports = connectDB;
