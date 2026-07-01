/**
 * Create the admin account from the credentials in .env (ADMIN_EMAIL /
 * ADMIN_PASSWORD). Run once after setting up the project:
 *
 *   node scripts/createAdmin.js
 *
 * Behaviour:
 *   - Connects to MongoDB.
 *   - If an admin with ADMIN_EMAIL already exists, it does nothing
 *     (so it's safe to run more than once).
 *   - To CHANGE the password later: update ADMIN_PASSWORD in .env and run
 *       node scripts/createAdmin.js --reset
 *     which re-hashes and saves the new password for that email.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

async function run() {
  const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || '';
  const name = process.env.ADMIN_NAME || 'Administrateur';
  const reset = process.argv.includes('--reset');

  if (!email || !password) {
    console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await Admin.findOne({ email }).select('+password');

    if (existing && !reset) {
      console.log(`ℹ️  Admin already exists: ${email} (no changes).`);
      console.log('    To change the password: update ADMIN_PASSWORD in .env, then run with --reset');
      return;
    }

    if (existing && reset) {
      existing.name = name;
      existing.password = password; // re-hashed by the pre-save hook
      await existing.save();
      console.log(`♻️  Password reset for ${email}. Admin updated successfully.`);
      return;
    }

    await Admin.create({ name, email, password });
    console.log(`✅ Admin created successfully: ${name} <${email}>`);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
