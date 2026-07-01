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
  logout: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

/**
 * Wraps the admin app. On mount, if a token exists in localStorage it is
 * validated against GET /api/auth/me; an invalid/expired token is cleared.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!api.getToken()) {
      setIsLoading(false);
      return;
    }
    api
      .getMe()
      .then(({ admin }) => setAdmin(admin))
      .catch(() => api.clearToken())
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { token, admin } = await api.login(email, password);
    api.setToken(token);
    setAdmin(admin);
  };

  const logout = () => {
    api.clearToken();
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
