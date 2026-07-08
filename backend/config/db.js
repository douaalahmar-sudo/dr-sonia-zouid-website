const mongoose = require('mongoose');
const dns = require('dns');

const RETRY_DELAY_MS = 5000;

// Node's DNS resolver (c-ares) queries the OS-configured nameserver directly
// over raw UDP, which some local/VPN/router resolvers refuse (ECONNREFUSED)
// even though the OS resolver itself handles the same SRV lookup fine — this
// breaks mongodb+srv:// connection strings, which depend on an SRV lookup.
// Pointing Node explicitly at public DNS resolvers sidesteps that.
dns.setServers(['8.8.8.8', '1.1.1.1']);

/**
 * Connect to MongoDB Atlas using the connection string in MONGODB_URI.
 * On failure, logs the error and retries after a delay instead of killing the
 * process — a transient DNS/network blip (common on Render's free tier)
 * should not take the whole API down with a hard 502. Requests that need the
 * DB will simply fail until a retry succeeds; /api/health stays up either way.
 */
async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.error(`   Retrying in ${RETRY_DELAY_MS / 1000}s...`);
    setTimeout(connectDB, RETRY_DELAY_MS);
  }
}

// Helpful runtime logs for connection drops during development.
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

module.exports = connectDB;
