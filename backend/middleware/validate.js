const { body, validationResult } = require('express-validator');
const { MOTIFS } = require('../models/Appointment');

/**
 * Runs after a set of validation chains. If any failed, respond 400 with a
 * clean list of { field, message } errors; otherwise pass to the controller.
 */
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Certains champs sont invalides.',
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
}

// A note on sanitisation:
//   We `.trim()` every field here, but we deliberately do NOT `.escape()`.
//   HTML-escaping is done at *output* time (utils/mailer.js → esc()), which is
//   the standard "escape on render" approach: it keeps the database clean
//   (no "&amp;" stored), avoids double-encoding, and still fully protects the
//   HTML emails. JSON responses are not HTML, so returning raw text is safe.

// ─── Appointment validation chain ──────────────────────────────────────────
// Mirrors the frontend rules (App.tsx → validateRdv):
//  - nom (fullName): required, min 3 chars
//  - telephone (phone): exactly 8 digits (Tunisian format)
//  - email: optional, but valid if provided
//  - motif: required, must be one of the allowed values
//  - date (preferredDate): required
const validateAppointment = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Le nom complet est requis.')
    .isLength({ min: 3 }).withMessage('Le nom doit contenir au moins 3 caractères.'),

  body('phone')
    .trim()
    .notEmpty().withMessage('Le numéro de téléphone est requis.')
    .matches(/^[0-9]{8}$/).withMessage('Numéro invalide — 8 chiffres attendus.'),

  body('email')
    .optional({ checkFalsy: true }) // empty string / undefined is allowed
    .trim()
    .isEmail().withMessage('Adresse email invalide.')
    .normalizeEmail(),

  body('motif')
    .trim()
    .notEmpty().withMessage('Le motif de consultation est requis.')
    .isIn(MOTIFS).withMessage('Motif de consultation invalide.'),

  body('preferredDate')
    .trim()
    .notEmpty().withMessage('La date est requise.'),

  body('preferredTime').optional({ checkFalsy: true }).trim(),

  body('message').optional({ checkFalsy: true }).trim(),

  handleValidation,
];

// ─── Contact validation chain ──────────────────────────────────────────────
// Mirrors the frontend rules (App.tsx → validateContact):
//  - nom (fullName): required
//  - email: required + valid
//  - message: required, min 10 chars
const validateContact = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Le nom est requis.'),

  body('email')
    .trim()
    .notEmpty().withMessage('L’adresse email est requise.')
    .isEmail().withMessage('Adresse email invalide.')
    .normalizeEmail(),

  body('phone').optional({ checkFalsy: true }).trim(),

  body('message')
    .trim()
    .notEmpty().withMessage('Le message est requis.')
    .isLength({ min: 10 }).withMessage('Message trop court (10 caractères minimum).'),

  handleValidation,
];

// ─── Auth validation chains ────────────────────────────────────────────────
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('L’adresse email est requise.')
    .isEmail().withMessage('Adresse email invalide.')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Le mot de passe est requis.'),
  handleValidation,
];

module.exports = {
  validateAppointment,
  validateContact,
  validateLogin,
  handleValidation,
};
