import type { AppointmentStatus } from "../api/adminApi";

export const STATUS_LABEL: Record<AppointmentStatus, string> = {
  pending: "En attente",
  read: "Lu",
  done: "Terminé",
};

const STATUS_CLASS: Record<AppointmentStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  read: "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
};

export default function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_CLASS[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
