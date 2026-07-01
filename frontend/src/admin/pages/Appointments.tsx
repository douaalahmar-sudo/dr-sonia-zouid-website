import { useEffect, useMemo, useState } from "react";
import { Search, Trash2, Loader2, RefreshCw } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import {
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  type Appointment,
  type AppointmentStatus,
} from "../api/adminApi";

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function Appointments() {
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AppointmentStatus>("all");
  const [sortDesc, setSortDesc] = useState(true); // newest first

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setItems((await getAppointments()).data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const changeStatus = async (id: string, status: AppointmentStatus) => {
    const prev = items;
    setItems((list) => list.map((a) => (a._id === id ? { ...a, status } : a)));
    try {
      await updateAppointmentStatus(id, status);
    } catch {
      setItems(prev); // rollback on failure
    }
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`Supprimer le rendez-vous de ${name} ?`)) return;
    const prev = items;
    setItems((list) => list.filter((a) => a._id !== id));
    try {
      await deleteAppointment(id);
    } catch {
      setItems(prev);
    }
  };

  const filtered = useMemo(() => {
    let list = items;
    if (statusFilter !== "all") list = list.filter((a) => a.status === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((a) => a.fullName.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      const d = +new Date(a.createdAt) - +new Date(b.createdAt);
      return sortDesc ? -d : d;
    });
  }, [items, statusFilter, search, sortDesc]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom…"
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="read">Lu</option>
          <option value="done">Terminé</option>
        </select>
        <button
          onClick={() => setSortDesc((v) => !v)}
          className="px-3 py-2.5 bg-white border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground"
        >
          Date {sortDesc ? "↓ récent" : "↑ ancien"}
        </button>
        <button onClick={load} className="px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5">
          <RefreshCw className="w-4 h-4" /> Actualiser
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
      ) : error ? (
        <p className="text-destructive text-center py-16">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-16 bg-white rounded-2xl border border-border">
          Aucun rendez-vous.
        </p>
      ) : (
        <div className="bg-white rounded-2xl border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="px-4 py-3 font-medium">Nom complet</th>
                <th className="px-4 py-3 font-medium">Téléphone</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Email</th>
                <th className="px-4 py-3 font-medium">Motif</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">Souhaité</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a._id} className="border-b border-border last:border-0 align-top">
                  <td className="px-4 py-3 font-semibold text-foreground">
                    {a.fullName}
                    <div className="text-xs text-muted-foreground font-normal">Reçu le {fmt(a.createdAt)}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <a href={`tel:${a.phone}`} className="hover:text-primary">{a.phone}</a>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{a.email || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {a.motif}
                    {a.message && <div className="text-xs text-muted-foreground/80 mt-1 max-w-[220px]">{a.message}</div>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell whitespace-nowrap">
                    {a.preferredDate || "—"}{a.preferredTime ? ` · ${a.preferredTime}` : ""}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <select
                        value={a.status}
                        onChange={(e) => changeStatus(a._id, e.target.value as AppointmentStatus)}
                        className="text-xs border border-border rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="pending">En attente</option>
                        <option value="read">Lu</option>
                        <option value="done">Terminé</option>
                      </select>
                      <button
                        onClick={() => remove(a._id, a.fullName)}
                        title="Supprimer"
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
