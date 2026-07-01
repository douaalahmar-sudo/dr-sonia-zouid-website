import { Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Messages from "./pages/Messages";

/**
 * Root of the admin section (mounted at /admin/* in main.tsx).
 * Paths here are relative to /admin.
 */
export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />

        {/* Everything below requires a valid token */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="messages" element={<Messages />} />
          </Route>
        </Route>

        {/* /admin and anything unknown → dashboard (which will bounce to
            login if not authenticated) */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
