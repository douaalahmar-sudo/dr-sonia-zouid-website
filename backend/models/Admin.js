const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom est requis.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'L’adresse email est requise.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Adresse email invalide.'],
    },
    // The hashed password. `select: false` keeps it out of query results by
    // default so it's never accidentally sent to the client.
    password: {
      type: String,
      required: [true, 'Le mot de passe est requis.'],
      minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères.'],
      select: false,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

// Hash the password before saving, but only if it changed (so updating other
// fields doesn't re-hash an already-hashed value).
adminSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance helper to compare a plaintext candidate against the stored hash.
adminSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
