const express = require('express');
const router = express.Router();

const {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} = require('../controllers/appointmentController');
const { validateAppointment } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { formLimiter } = require('../middleware/rateLimiters');

// POST /api/appointments — create a new appointment request (validated, public)
router.post('/', formLimiter, validateAppointment, createAppointment);

// GET /api/appointments — list all appointments (admin only)
router.get('/', protect, getAppointments);

// PATCH /api/appointments/:id — update status (admin only)
router.patch('/:id', protect, updateAppointmentStatus);

// DELETE /api/appointments/:id — delete (admin only)
router.delete('/:id', protect, deleteAppointment);

module.exports = router;
