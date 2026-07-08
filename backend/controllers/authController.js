const Admin = require('../models/Admin');
const { signToken, cookieOptions, TOKEN_COOKIE } = require('../middleware/auth');

// Shape an admin for safe client output (never include the password).
function publicAdmin(a) {
  return { id: a._id, name: a.name, email: a.email, createdAt: a.createdAt };
}

/**
 * POST /api/auth/login   (public)
 * Body: { email, password }. On success, sets the JWT as an httpOnly cookie
 * and returns { success, admin } (the token is never exposed to JS).
 * Uses a single generic error so we don't reveal whether the email exists.
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: String(email || '').toLowerCase() }).select('+password');

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }

    const token = signToken(admin);
    res.cookie(TOKEN_COOKIE, token, cookieOptions({ withMaxAge: true }));
    return res.status(200).json({ success: true, admin: publicAdmin(admin) });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me   (protected)
 * Returns the currently logged-in admin (from the token → req.admin).
 */
async function getMe(req, res) {
  return res.status(200).json({ success: true, admin: publicAdmin(req.admin) });
}

/**
 * POST /api/auth/logout   (protected)
 * Clears the auth cookie. clearCookie must match the attributes used to set it
 * (minus maxAge) or the browser won't remove it.
 */
async function logout(req, res) {
  res.clearCookie(TOKEN_COOKIE, cookieOptions());
  return res.status(200).json({ success: true });
}

module.exports = { login, getMe, logout };
