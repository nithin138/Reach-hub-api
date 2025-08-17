const mongoose = require('mongoose');
require('dotenv/config.js');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'service_platform' });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB error:', err.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
