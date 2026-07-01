const rateLimit = require('express-rate-limit');

const common = { windowMs: 15 * 60 * 1000, standardHeaders: true, legacyHeaders: false };

// Generous global safety net across the whole API (blocks only real abuse).
const globalLimiter = rateLimit({
  ...common,
  max: 300,
  message: { success: false, message: 'Trop de requêtes. Veuillez réessayer plus tard.' },
});

// Strict limit on the PUBLIC form submissions (anti-spam): 20 / 15 min per IP.
const formLimiter = rateLimit({
  ...common,
  max: 20,
  message: { success: false, message: 'Trop de requêtes. Veuillez réessayer dans quelques minutes.' },
});

// Strict limit on login to slow password guessing: 5 / 15 min per IP.
const loginLimiter = rateLimit({
  ...common,
  max: 5,
  message: { success: false, message: 'Trop de tentatives de connexion. Réessayez dans quelques minutes.' },
});

module.exports = { globalLimiter, formLimiter, loginLimiter };
