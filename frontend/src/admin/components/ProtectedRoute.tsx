import { Navigate, Outlet } from "react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

/**
 * Gate for admin pages:
 *  - while validating the token → spinner
 *  - not authenticated → redirect to /admin/login
 *  - authenticated → render the nested route (<Outlet />)
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
