const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Fetch MongoDB URI from environment variables
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in the environment variables.');
    }

    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,  
      useUnifiedTopology: true,  
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); 
  }
};

module.exports = connectDB;
