import { useState } from "react";
import { useNavigate, Navigate } from "react-router";
import { Lock } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Logo from "../../shared/Logo";

export default function Login() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Already logged in → straight to the dashboard.
  if (!isLoading && isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate("/admin/dashboard", { replace: true });
    } catch (err: any) {
      setError(err?.message || "Email ou mot de passe incorrect");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary to-white px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo size="lg" subtitle="Cabinet d'Ophtalmologie" className="items-center text-center" />
        </div>

        <div className="bg-white rounded-3xl border border-border shadow-sm p-8">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Espace administrateur</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Adresse e-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="admin@drzouid.tn"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-destructive text-sm text-center bg-destructive/10 rounded-xl py-3 px-4">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Connexion…" : "Se connecter"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Accès réservé au personnel autorisé du cabinet.
        </p>
      </div>
    </div>
  );
}
