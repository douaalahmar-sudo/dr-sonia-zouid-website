// ─── Load environment variables first (before anything reads process.env) ───
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const connectDB = require('./config/db');
const { globalLimiter } = require('./middleware/rateLimiters');
const { verifyMailer } = require('./utils/mailer');

const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Database ───────────────────────────────────────────────────────────────
connectDB();

// ─── Security & core middleware ─────────────────────────────────────────────
app.set('trust proxy', 1); // needed for correct client IPs behind Render's proxy

app.use(helmet());

// CORS — allow the frontend origin(s). ALLOWED_ORIGINS is a comma-separated
// list so both the local dev site and the deployed Vercel domain can be
// listed in one env var, e.g.:
//   ALLOWED_ORIGINS=http://localhost:5173,https://dr-sonia-zouid-website.vercel.app
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow tools with no Origin header (curl, REST Client, health checks).
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    methods: ['GET', 'POST'],
  })
);

app.use(express.json({ limit: '10kb' })); // parse JSON bodies (small — form data only)

// ─── Rate limiting ──────────────────────────────────────────────────────────
// Generous global safety net. Stricter per-route limits (public form spam,
// login brute-force) live in the route files via middleware/rateLimiters.js.
app.use('/api', globalLimiter);

// ─── Routes ─────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/contact', contactRoutes);

// Friendly root route
app.get('/', (req, res) => {
  res.json({ message: 'API Cabinet Dr Sonia Zouid — opérationnelle.' });
});

// ─── 404 + error handlers ─────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route introuvable.' });
});

// eslint-disable-next-line no-unused-vars — Express needs the 4-arg signature
app.use((err, req, res, next) => {
  console.error('💥 Server error:', err.message);
  const isCors = err.message && err.message.startsWith('CORS:');
  res.status(isCors ? 403 : 500).json({
    success: false,
    message: isCors ? 'Origine non autorisée.' : 'Une erreur interne est survenue.',
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`   Allowed origins: ${allowedOrigins.join(', ')}`);
  verifyMailer();
});
