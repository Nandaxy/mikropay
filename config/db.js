const mongoose = require('mongoose');
const  { mongo_uri } = require('../config')

const connectDB = async () => {

  try {
    await mongoose.connect( mongo_uri || process.env.MONGO_URI);
    console.log('MongoDB Connected ✅');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
