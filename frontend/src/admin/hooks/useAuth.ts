import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import * as api from "../api/adminApi";
import type { Admin } from "../api/adminApi";

type AuthState = {
  admin: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

/**
 * Wraps the admin app. On mount we always ask GET /api/auth/me: the auth token
 * lives in an httpOnly cookie the browser sends automatically, so there is no
 * client-readable token to check for first. A failure means "not logged in".
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .getMe()
      .then(({ admin }) => setAdmin(admin))
      .catch(() => setAdmin(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { admin } = await api.login(email, password);
    setAdmin(admin);
  };

  const logout = async () => {
    // Clear the cookie server-side first, then drop local state.
    await api.logout().catch(() => {});
    setAdmin(null);
  };

  const value: AuthState = {
    admin,
    isLoading,
    isAuthenticated: !!admin,
    login,
    logout,
  };

  // createElement (not JSX) so this file can stay a plain .ts module.
  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
