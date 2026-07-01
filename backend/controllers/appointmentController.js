const Appointment = require('../models/Appointment');
const {
  sendAppointmentNotification,
  sendAppointmentConfirmation,
} = require('../utils/mailer');

/**
 * POST /api/appointments
 * Validation has already run (see routes). Here we:
 *   1. Save the appointment to MongoDB
 *   2. Email the clinic (notification)
 *   3. Email the patient (confirmation) — only if they left an address
 *   4. Return 201 with the created record
 *
 * Emails are best-effort: a mail failure must NOT lose the appointment, so we
 * catch mail errors separately and still return success.
 */
async function createAppointment(req, res, next) {
  try {
    const { fullName, phone, email, motif, preferredDate, preferredTime, message } = req.body;

    const appointment = await Appointment.create({
      fullName,
      phone,
      email,
      motif,
      preferredDate,
      preferredTime,
      message,
    });

    // Fire the two emails. Don't let a mail error roll back the saved record.
    try {
      await Promise.all([
        sendAppointmentNotification(appointment),
        sendAppointmentConfirmation(appointment),
      ]);
    } catch (mailErr) {
      console.error('⚠️  Appointment saved but email failed:', mailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Votre demande de rendez-vous a bien été enregistrée.',
      data: appointment,
    });
  } catch (err) {
    // Surface Mongoose validation errors as 400, everything else as 500.
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
 * GET /api/appointments
 * Returns all appointments, newest first. Intended for a future admin panel.
 */
async function getAppointments(req, res, next) {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/appointments/:id/status   (admin)
 * Update an appointment's status (pending → read → done).
 */
async function updateAppointmentStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!['pending', 'read', 'done'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Statut invalide.' });
    }
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Rendez-vous introuvable.' });
    }
    return res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/appointments/:id   (admin)
 */
async function deleteAppointment(req, res, next) {
  try {
    const removed = await Appointment.findByIdAndDelete(req.params.id);
    if (!removed) {
      return res.status(404).json({ success: false, message: 'Rendez-vous introuvable.' });
    }
    return res.status(200).json({ success: true, message: 'Rendez-vous supprimé.' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
};
