import { NavLink } from "react-router";
import { LayoutDashboard, CalendarDays, MessageSquare, Settings, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Logo from "../../shared/Logo";

const NAV = [
  { to: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/admin/appointments", label: "Rendez-vous", icon: CalendarDays },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare },
];

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col h-full bg-white border-r border-border w-64">
      {/* Brand */}
      <div className="flex items-center px-6 h-16 border-b border-border">
        <Logo size="sm" subtitle="Administration" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-background hover:text-foreground"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}

        {/* Future section (disabled) */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground/50 cursor-not-allowed">
          <Settings className="w-5 h-5" />
          Paramètres
        </div>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </div>
    </div>
  );
}
