import { useEffect, useState } from "react";
import { Trash2, Loader2, RefreshCw, Mail, Phone, X } from "lucide-react";
import { getMessages, deleteMessage, type Message } from "../api/adminApi";

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) +
    " " + new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export default function Messages() {
  const [items, setItems] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [toDelete, setToDelete] = useState<Message | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setItems((await getMessages()).data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    const id = toDelete._id;
    try {
      await deleteMessage(id);
      setItems((list) => list.filter((m) => m._id !== id));
      setToDelete(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={load} className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5">
          <RefreshCw className="w-4 h-4" /> Actualiser
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
      ) : error ? (
        <p className="text-destructive text-center py-16">{error}</p>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground text-center py-16 bg-white rounded-2xl border border-border">
          Aucun message.
        </p>
      ) : (
        <div className="bg-white rounded-2xl border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Coordonnées</th>
                <th className="px-4 py-3 font-medium">Message</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Date</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => {
                const isLong = m.message.length > 90;
                const open = expanded[m._id];
                return (
                  <tr key={m._id} className="border-b border-border last:border-0 align-top">
                    <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">{m.fullName}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      <a href={`mailto:${m.email}`} className="flex items-center gap-1.5 hover:text-primary"><Mail className="w-3.5 h-3.5" /> {m.email}</a>
                      {m.phone && <span className="flex items-center gap-1.5 mt-1"><Phone className="w-3.5 h-3.5" /> {m.phone}</span>}
                    </td>
                    <td className="px-4 py-3 text-foreground max-w-md">
                      <span className="whitespace-pre-wrap">
                        {open || !isLong ? m.message : m.message.slice(0, 90) + "…"}
                      </span>
                      {isLong && (
                        <button
                          onClick={() => setExpanded((e) => ({ ...e, [m._id]: !open }))}
                          className="block text-primary text-xs font-semibold mt-1 hover:underline"
                        >
                          {open ? "Réduire" : "Lire la suite"}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell whitespace-nowrap">{fmt(m.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setToDelete(m)} title="Supprimer" className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirmation modal */}
      {toDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => !deleting && setToDelete(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <button onClick={() => setToDelete(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-foreground text-lg mb-2">Supprimer le message</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Voulez-vous vraiment supprimer le message de <strong className="text-foreground">{toDelete.fullName}</strong> ?
              Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setToDelete(null)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-background"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-destructive text-white text-sm font-semibold hover:bg-destructive/90 disabled:opacity-60"
              >
                {deleting ? "Suppression…" : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
