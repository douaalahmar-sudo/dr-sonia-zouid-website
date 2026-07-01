import { useEffect, useState } from "react";
import { Link } from "react-router";
import { CalendarDays, Clock, MessageSquare, CalendarCheck, ArrowRight, Loader2 } from "lucide-react";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { getAppointments, getMessages, type Appointment, type Message } from "../api/adminApi";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function Dashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getAppointments(), getMessages()])
      .then(([a, m]) => {
        setAppointments(a.data);
        setMessages(m.data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }
  if (error) return <p className="text-destructive py-12 text-center">{error}</p>;

  // Stats
  const total = appointments.length;
  const pending = appointments.filter((a) => a.status === "pending").length;
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeek = appointments.filter((a) => new Date(a.createdAt).getTime() >= weekAgo).length;
  const latest = [...appointments]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total rendez-vous" value={total} icon={CalendarDays} />
        <StatCard label="En attente" value={pending} icon={Clock} color="bg-amber-100 text-amber-600" />
        <StatCard label="Messages reçus" value={messages.length} icon={MessageSquare} color="bg-blue-100 text-blue-600" />
        <StatCard label="Rendez-vous cette semaine" value={thisWeek} icon={CalendarCheck} color="bg-green-100 text-green-600" />
      </div>

      {/* Latest appointments */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-bold text-foreground">Derniers rendez-vous</h2>
          <Link to="/admin/appointments" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
            Voir tout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {latest.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">Aucun rendez-vous pour le moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="px-5 py-3 font-medium">Nom</th>
                  <th className="px-5 py-3 font-medium">Motif</th>
                  <th className="px-5 py-3 font-medium hidden sm:table-cell">Reçu le</th>
                  <th className="px-5 py-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {latest.map((a) => (
                  <tr key={a._id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 font-semibold text-foreground">{a.fullName}</td>
                    <td className="px-5 py-3 text-muted-foreground">{a.motif}</td>
                    <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">{fmtDate(a.createdAt)}</td>
                    <td className="px-5 py-3"><StatusBadge status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
