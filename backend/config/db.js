const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas using the connection string in MONGODB_URI.
 * Logs a clear success/failure message and exits the process on failure
 * (a backend with no database is not useful to keep alive).
 */
async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    // Exit so the problem is visible immediately rather than failing on the
    // first request. Render/nodemon will surface the crash in the logs.
    process.exit(1);
  }
}

// Helpful runtime logs for connection drops during development.
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

module.exports = connectDB;
