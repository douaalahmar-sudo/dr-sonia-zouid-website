import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: number | string;
  icon: LucideIcon;
  // Tailwind colour classes for the icon chip, e.g. "bg-amber-100 text-amber-600".
  color?: string;
};

export default function StatCard({ label, value, icon: Icon, color = "bg-primary/10 text-primary" }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-border p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-2xl font-bold text-foreground leading-none">{value}</div>
        <div className="text-sm text-muted-foreground mt-1">{label}</div>
      </div>
    </div>
  );
}
