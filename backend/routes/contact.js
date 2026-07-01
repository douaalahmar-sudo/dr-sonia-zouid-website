const express = require('express');
const router = express.Router();

const { createContact, getContacts, deleteContact } = require('../controllers/contactController');
const { validateContact } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { formLimiter } = require('../middleware/rateLimiters');

// POST /api/contact — create a new contact message (validated, public)
router.post('/', formLimiter, validateContact, createContact);

// GET /api/contact — list all messages (admin only)
router.get('/', protect, getContacts);

// DELETE /api/contact/:id — delete a message (admin only)
router.delete('/:id', protect, deleteContact);

module.exports = router;
