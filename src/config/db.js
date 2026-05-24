const mongoose = require('mongoose');
const { mongoUri } = require('./env');

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(mongoUri, {
      // These options prevent deprecation warnings
     // useNewUrlParser: true,       //chatgpt asked me to do
      //useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1); // App can't run without DB
  }
};

// Listen for connection events (production best practice)
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB error: ${err}`);
});

module.exports = connectDB;