const jwt = require('jsonwebtoken');
const ms = require('ms');
const Admin = require('../models/Admin');

// Name of the httpOnly cookie that carries the admin JWT.
const TOKEN_COOKIE = 'token';

/**
 * Sign a login token for an admin. The login controller sets this as an
 * httpOnly "token" cookie; the browser sends it back automatically on
 * protected requests (no Authorization header involved).
 */
function signToken(admin) {
  return jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

/**
 * Options for the auth cookie. Deployed cross-origin (Vercel ⇄ Render), so the
 * cookie must be SameSite=None + Secure to be sent on cross-site requests.
 * `withMaxAge` adds the lifetime (login); clearCookie must omit it and match
 * the rest of the attributes.
 */
function cookieOptions({ withMaxAge = false } = {}) {
  const opts = { httpOnly: true, secure: true, sameSite: 'none' };
  if (withMaxAge) {
    // Keep the cookie lifetime in step with the JWT expiry. `ms` parses the
    // same JWT_EXPIRES_IN string ('7d', '12h', …) that jsonwebtoken uses.
    opts.maxAge = ms(process.env.JWT_EXPIRES_IN || '7d');
  }
  return opts;
}

/**
 * Protect a route: require a valid admin JWT read from the httpOnly cookie.
 * On success, attaches the admin document (without the password) to req.admin.
 */
async function protect(req, res, next) {
  try {
    const token = req.cookies && req.cookies[TOKEN_COOKIE];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentification requise.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Compte introuvable.' });
    }

    req.admin = admin;
    next();
  } catch (err) {
    // Expired or malformed token.
    return res.status(401).json({ success: false, message: 'Session invalide ou expirée.' });
  }
}

module.exports = { signToken, protect, cookieOptions, TOKEN_COOKIE };
