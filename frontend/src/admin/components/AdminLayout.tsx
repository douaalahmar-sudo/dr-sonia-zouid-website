import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { Menu, X, LogOut } from "lucide-react";
import Sidebar from "./Sidebar";
import { useAuth } from "../hooks/useAuth";

const TITLES: Record<string, string> = {
  "/admin/dashboard": "Tableau de bord",
  "/admin/appointments": "Rendez-vous",
  "/admin/messages": "Messages",
};

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const title = TITLES[pathname] ?? "Administration";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar — fixed on desktop */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </aside>

      {/* Sidebar — mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative z-50">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main column */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-border h-16 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-foreground"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-lg font-bold text-foreground">{title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-foreground leading-tight">{admin?.name}</div>
              <div className="text-xs text-muted-foreground">{admin?.email}</div>
            </div>
            <button
              onClick={logout}
              title="Déconnexion"
              className="w-9 h-9 rounded-lg bg-background hover:bg-destructive/10 hover:text-destructive text-foreground flex items-center justify-center transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
