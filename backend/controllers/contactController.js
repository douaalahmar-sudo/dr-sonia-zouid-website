const Contact = require('../models/Contact');
const {
  sendContactNotification,
  sendContactConfirmation,
} = require('../utils/mailer');

/**
 * POST /api/contact
 * Same pattern as appointments: save → notify clinic → confirm to sender →
 * return 201. Emails are best-effort and never block the saved record.
 */
async function createContact(req, res, next) {
  try {
    const { fullName, email, phone, message } = req.body;

    const contact = await Contact.create({ fullName, email, phone, message });

    try {
      await Promise.all([
        sendContactNotification(contact),
        sendContactConfirmation(contact),
      ]);
    } catch (mailErr) {
      console.error('⚠️  Contact message saved but email failed:', mailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Votre message a bien été envoyé.',
      data: contact,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Certains champs sont invalides.',
        errors: Object.values(err.errors).map((e) => ({
          field: e.path,
          message: e.message,
        })),
      });
    }
    next(err);
  }
}

/**
 * GET /api/contact
 * Returns all contact messages, newest first. Intended for a future admin panel.
 */
async function getContacts(req, res, next) {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/contact/:id   (admin)
 */
async function deleteContact(req, res, next) {
  try {
    const removed = await Contact.findByIdAndDelete(req.params.id);
    if (!removed) {
      return res.status(404).json({ success: false, message: 'Message introuvable.' });
    }
    return res.status(200).json({ success: true, message: 'Message supprimé.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { createContact, getContacts, deleteContact };
