const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Le nom est requis.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'L’adresse email est requise.'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Adresse email invalide.'],
    },
    phone: { type: String, trim: true },
    message: {
      type: String,
      required: [true, 'Le message est requis.'],
      trim: true,
      minlength: 10,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
