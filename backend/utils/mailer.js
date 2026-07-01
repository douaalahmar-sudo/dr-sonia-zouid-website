const nodemailer = require('nodemailer');

// ─── Transporter (Gmail SMTP) ──────────────────────────────────────────────
// Uses a Gmail account + App Password (see the setup guide). Gmail's "service"
// shortcut configures host/port/secure automatically.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    // Gmail shows App Passwords as "abcd efgh ijkl mnop" — strip any spaces so
    // it works whether or not they were copied along with the 16 characters.
    pass: (process.env.EMAIL_PASS || '').replace(/\s+/g, ''),
  },
});

// Brand colours (kept in sync with the site's palette).
const BRAND = '#1f6f78';
const ACCENT = '#e07a5f';
const CLINIC_NAME = 'Cabinet Dr Sonia Zouid';
const CLINIC_ADDRESS = 'Av. Habib Bourguiba, Téboulba';
const CLINIC_PHONE = '73 479 960';

/**
 * Verify the SMTP credentials once at startup. Non-fatal: if it fails we log a
 * warning and the API keeps running (submissions are still saved to MongoDB,
 * only the emails would fail). This avoids taking the whole site down over a
 * mail misconfiguration.
 */
function verifyMailer() {
  transporter.verify((err) => {
    if (err) {
      console.warn('⚠️  Email transporter not ready:', err.message);
      console.warn('    → Appointments/messages will still be saved, but emails may fail.');
    } else {
      console.log('✅ Email transporter ready (Gmail SMTP)');
    }
  });
}

// Small helper: wrap body content in a consistent branded shell.
function layout(title, innerHtml) {
  return `
  <div style="margin:0;padding:24px;background:#f4f6f8;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1f2933;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
      <div style="background:${BRAND};padding:24px 32px;">
        <h1 style="margin:0;font-size:20px;color:#ffffff;">${CLINIC_NAME}</h1>
        <p style="margin:4px 0 0;font-size:13px;color:#d6e6e8;">Ophtalmologie — Téboulba, Tunisie</p>
      </div>
      <div style="padding:32px;">
        <h2 style="margin:0 0 16px;font-size:18px;color:${BRAND};">${title}</h2>
        ${innerHtml}
      </div>
      <div style="padding:20px 32px;background:#f0f4f5;font-size:12px;color:#6b7280;">
        ${CLINIC_NAME} · ${CLINIC_ADDRESS} · Tél. ${CLINIC_PHONE}
      </div>
    </div>
  </div>`;
}

// Render a label/value table row, skipping empty values.
function row(label, value) {
  if (!value) return '';
  return `
    <tr>
      <td style="padding:8px 0;font-size:13px;color:#6b7280;width:180px;vertical-align:top;">${label}</td>
      <td style="padding:8px 0;font-size:14px;color:#1f2933;font-weight:600;">${value}</td>
    </tr>`;
}

// Escape user-supplied values before injecting into HTML (defence in depth —
// inputs are already sanitised by express-validator, but emails render HTML).
function esc(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Appointments ───────────────────────────────────────────────────────────

/**
 * Notify the clinic that a new appointment request came in.
 * Sends to EMAIL_TO with all patient details.
 */
async function sendAppointmentNotification(appt) {
  const inner = `
    <p style="margin:0 0 20px;font-size:14px;color:#4b5563;">
      Une nouvelle demande de rendez-vous vient d'être reçue via le site.
    </p>
    <table style="width:100%;border-collapse:collapse;border-top:1px solid #e5e7eb;">
      ${row('Patient', esc(appt.fullName))}
      ${row('Téléphone', esc(appt.phone))}
      ${row('Email', esc(appt.email) || '—')}
      ${row('Motif', esc(appt.motif))}
      ${row('Date souhaitée', esc(appt.preferredDate) || '—')}
      ${row('Heure souhaitée', esc(appt.preferredTime) || '—')}
      ${row('Message', esc(appt.message) || '—')}
    </table>`;

  return transporter.sendMail({
    from: `"${CLINIC_NAME}" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    replyTo: appt.email || undefined,
    subject: `Nouvelle demande de RDV — ${appt.fullName} (${appt.motif})`,
    html: layout('Nouvelle demande de rendez-vous', inner),
  });
}

/**
 * Confirm to the patient that their request was received.
 * Only sent when the patient provided an email address.
 */
async function sendAppointmentConfirmation(appt) {
  if (!appt.email) return null;

  const inner = `
    <p style="margin:0 0 16px;font-size:14px;color:#4b5563;">
      Bonjour <strong>${esc(appt.fullName)}</strong>,
    </p>
    <p style="margin:0 0 20px;font-size:14px;color:#4b5563;line-height:1.6;">
      Nous avons bien reçu votre demande de rendez-vous. Notre équipe vous
      contactera très prochainement au <strong>${esc(appt.phone)}</strong>
      pour confirmer le créneau. Voici le récapitulatif de votre demande :
    </p>
    <table style="width:100%;border-collapse:collapse;border-top:1px solid #e5e7eb;">
      ${row('Motif', esc(appt.motif))}
      ${row('Date souhaitée', esc(appt.preferredDate) || 'À définir')}
      ${row('Heure souhaitée', esc(appt.preferredTime) || 'À définir')}
    </table>
    <p style="margin:24px 0 0;font-size:14px;color:#4b5563;line-height:1.6;">
      Pour toute urgence, appelez-nous directement au
      <strong>${CLINIC_PHONE}</strong>.
    </p>
    <p style="margin:16px 0 0;font-size:14px;color:#4b5563;">
      Bien à vous,<br/>L'équipe du ${CLINIC_NAME}
    </p>`;

  return transporter.sendMail({
    from: `"${CLINIC_NAME}" <${process.env.EMAIL_USER}>`,
    to: appt.email,
    subject: 'Votre demande de rendez-vous a bien été reçue',
    html: layout('Confirmation de votre demande', inner),
  });
}

// ─── Contact ──────────────────────────────────────────────────────────────

/**
 * Notify the clinic of a new contact message.
 */
async function sendContactNotification(contact) {
  const inner = `
    <p style="margin:0 0 20px;font-size:14px;color:#4b5563;">
      Un nouveau message a été envoyé via le formulaire de contact.
    </p>
    <table style="width:100%;border-collapse:collapse;border-top:1px solid #e5e7eb;">
      ${row('Nom', esc(contact.fullName))}
      ${row('Email', esc(contact.email))}
      ${row('Téléphone', esc(contact.phone) || '—')}
    </table>
    <div style="margin-top:20px;padding:16px;background:#f0f4f5;border-radius:12px;border-left:4px solid ${ACCENT};">
      <p style="margin:0;font-size:14px;color:#1f2933;line-height:1.6;white-space:pre-wrap;">${esc(contact.message)}</p>
    </div>`;

  return transporter.sendMail({
    from: `"${CLINIC_NAME}" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    replyTo: contact.email,
    subject: `Nouveau message de contact — ${contact.fullName}`,
    html: layout('Nouveau message de contact', inner),
  });
}

/**
 * Confirm to the sender that their message was received.
 */
async function sendContactConfirmation(contact) {
  const inner = `
    <p style="margin:0 0 16px;font-size:14px;color:#4b5563;">
      Bonjour <strong>${esc(contact.fullName)}</strong>,
    </p>
    <p style="margin:0 0 20px;font-size:14px;color:#4b5563;line-height:1.6;">
      Merci de nous avoir contactés. Nous avons bien reçu votre message et
      vous répondrons dans les plus brefs délais.
    </p>
    <p style="margin:16px 0 0;font-size:14px;color:#4b5563;">
      Bien à vous,<br/>L'équipe du ${CLINIC_NAME}
    </p>`;

  return transporter.sendMail({
    from: `"${CLINIC_NAME}" <${process.env.EMAIL_USER}>`,
    to: contact.email,
    subject: 'Nous avons bien reçu votre message',
    html: layout('Confirmation de réception', inner),
  });
}

module.exports = {
  verifyMailer,
  sendAppointmentNotification,
  sendAppointmentConfirmation,
  sendContactNotification,
  sendContactConfirmation,
};
