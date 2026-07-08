// ─── Admin API client ───────────────────────────────────────────────────────
// A thin fetch wrapper. Auth is carried by an httpOnly "token" cookie set by
// the backend on login, so every request is sent with credentials included and
// there is no token for JS to read or attach. On a 401 from a protected route,
// the browser is redirected to /admin/login (the cookie is server-managed).
//
// Base URL: relative in dev (Vite proxies /api → :5000); VITE_API_URL in prod.

const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

// ─── Types ──────────────────────────────────────────────────────────────────
export type Admin = { id: string; name: string; email: string; createdAt: string };

export type AppointmentStatus = "pending" | "read" | "done";

export type Appointment = {
  _id: string;
  fullName: string;
  phone: string;
  email?: string;
  motif: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
  status: AppointmentStatus;
  createdAt: string;
};

export type Message = {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      // Send the httpOnly auth cookie on every request (cross-origin in prod).
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new ApiError("Impossible de contacter le serveur.", 0);
  }

  // Auto sign-out on an expired/invalid session for a protected request. On the
  // login page we fall through so the real error (e.g. bad credentials) shows.
  if (res.status === 401 && !window.location.pathname.endsWith("/admin/login")) {
    window.location.assign("/admin/login");
    throw new ApiError("Session expirée.", 401);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      (data as any)?.errors?.[0]?.message ||
      (data as any)?.message ||
      "Une erreur est survenue.";
    throw new ApiError(msg, res.status);
  }
  return data as T;
}

// ─── Auth ───────────────────────────────────────────────────────────────────
// login sets the httpOnly cookie server-side; the response carries only the
// admin profile (no token).
export function login(email: string, password: string) {
  return request<{ admin: Admin }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
export function getMe() {
  return request<{ admin: Admin }>("/api/auth/me");
}
export function logout() {
  return request<{ success: boolean }>("/api/auth/logout", { method: "POST" });
}

// ─── Appointments ─────────────────────────────────────────────────────────
export function getAppointments() {
  return request<{ count: number; data: Appointment[] }>("/api/appointments");
}
export function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  return request<{ data: Appointment }>(`/api/appointments/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
export function deleteAppointment(id: string) {
  return request<{ success: boolean }>(`/api/appointments/${id}`, { method: "DELETE" });
}

// ─── Messages ─────────────────────────────────────────────────────────────
export function getMessages() {
  return request<{ count: number; data: Message[] }>("/api/contact");
}
export function deleteMessage(id: string) {
  return request<{ success: boolean }>(`/api/contact/${id}`, { method: "DELETE" });
}
