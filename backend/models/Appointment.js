const mongoose = require('mongoose');

// Allowed appointment reasons. These MUST match the <option> values shown in
// the frontend RendezVousPage (App.tsx) so a valid form submission is never
// rejected by Mongoose validation.
const MOTIFS = [
  'Consultation générale',
  'Examen de la vue',
  'Dépistage glaucome',
  'Dépistage cataracte',
  'Prescription lunettes / lentilles',
  'Suivi pédiatrique',
  'Urgences ophtalmologiques',
  'Autre',
];

const appointmentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Le nom complet est requis.'],
      trim: true,
      minlength: 3,
    },
    phone: {
      type: String,
      required: [true, 'Le numéro de téléphone est requis.'],
      trim: true,
    },
    // Email is optional on the appointment form (matches the frontend, where
    // the patient can leave it blank). When present it must look like an email.
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Adresse email invalide.'],
    },
    motif: {
      type: String,
      required: [true, 'Le motif de consultation est requis.'],
      enum: {
        values: MOTIFS,
        message: 'Motif de consultation invalide.',
      },
    },
    preferredDate: { type: String, trim: true },
    preferredTime: { type: String, trim: true },
    message: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['pending', 'read', 'done'],
      default: 'pending',
    },
  },
  {
    // createdAt / updatedAt handled automatically and consistently.
    timestamps: true,
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
module.exports.MOTIFS = MOTIFS;
