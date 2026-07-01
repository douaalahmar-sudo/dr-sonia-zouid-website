const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Sign a login token for an admin. Returned to the client on login; the client
 * sends it back as "Authorization: Bearer <token>" on protected requests.
 */
function signToken(admin) {
  return jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

/**
 * Protect a route: require a valid admin JWT. On success, attaches the admin
 * document (without the password) to req.admin.
 */
async function protect(req, res, next) {
  try {
    const header = req.get('authorization') || '';
    const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';

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

module.exports = { signToken, protect };
