// ─── API client ─────────────────────────────────────────────────────────────
// In development, requests go to a relative "/api/..." URL which Vite proxies
// to http://localhost:5000 (see vite.config.ts → server.proxy).
// In production, set VITE_API_URL to the deployed backend URL (e.g.
// https://drzouid-api.onrender.com) and requests are sent there directly.
const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

// Shapes used by the frontend forms (French field names).
export type RdvPayload = {
  nom: string;
  telephone: string;
  email: string;
  motif: string;
  date: string;
  heure: string;
  message: string;
};

export type ContactPayload = {
  nom: string;
  email: string;
  telephone: string;
  message: string;
};

type ApiResult = { ok: true } | { ok: false; message: string };

// Generic POST helper. Returns a friendly French error message on failure.
async function postJSON(path: string, body: unknown): Promise<ApiResult> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) return { ok: true };

    // Try to surface the server's validation/error message.
    const data = await res.json().catch(() => null);
    const message =
      data?.errors?.[0]?.message ||
      data?.message ||
      "Une erreur est survenue. Veuillez réessayer.";
    return { ok: false, message };
  } catch {
    // Network / server unreachable.
    return {
      ok: false,
      message:
        "Impossible de contacter le serveur. Vérifiez votre connexion et réessayez.",
    };
  }
}

// Map the French appointment form fields to the backend's English API fields.
export function submitAppointment(form: RdvPayload): Promise<ApiResult> {
  return postJSON("/api/appointments", {
    fullName: form.nom,
    phone: form.telephone,
    email: form.email,
    motif: form.motif,
    preferredDate: form.date,
    preferredTime: form.heure,
    message: form.message,
  });
}

// Map the French contact form fields to the backend's English API fields.
export function submitContact(form: ContactPayload): Promise<ApiResult> {
  return postJSON("/api/contact", {
    fullName: form.nom,
    email: form.email,
    phone: form.telephone,
    message: form.message,
  });
}
