// ─── Brand mark ─────────────────────────────────────────────────────────────
// Logomark: a hand-drawn Snellen eye-chart "E" (the classic vision-test
// optotype — top/bottom arms full length, middle arm shorter) in a rounded
// navy badge. This is deliberately not a generic bold letter or a stock
// "eye" icon — the shortened middle bar is what makes it read specifically
// as an eye-chart reference rather than just a letter E.
//
//   [E]  Dr Sonia Zouid          ← navy on light bg, white on dark bg
//        CABINET D'OPHTALMOLOGIE  ← tracked, lighter weight, no period

const FONT = { fontFamily: "'Inter', system-ui, sans-serif" };

const BADGE_SIZE: Record<string, number> = { sm: 22, md: 28, lg: 38 };
const NAME_SIZE: Record<string, string> = {
  sm: "text-[14px]",
  md: "text-[17px]",
  lg: "text-[23px]",
};
const SUB_SIZE: Record<string, string> = {
  sm: "text-[8px]",
  md: "text-[10px]",
  lg: "text-[11px]",
};

function SnellenEMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect x={0} y={0} width={28} height={28} rx={7} fill="#1B3A5C" />
      {/* Snellen "E": full-length top & bottom arms, shorter middle arm —
          even 4px gaps between every bar so it stays crisp at 32px. */}
      <rect x={4} y={4} width={4} height={20} fill="#ffffff" />
      <rect x={4} y={4} width={16} height={4} fill="#ffffff" />
      <rect x={4} y={12} width={11} height={4} fill="#ffffff" />
      <rect x={4} y={20} width={16} height={4} fill="#ffffff" />
    </svg>
  );
}

type LogoProps = {
  /** "dark" = navy wordmark text (light page backgrounds); "light" = white wordmark text (dark backgrounds like the footer). */
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  /** Tracked line under the name. Pass null to hide it. */
  subtitle?: string | null;
  className?: string;
};

export default function Logo({
  variant = "dark",
  size = "md",
  subtitle = "Cabinet d'Ophtalmologie",
  className = "",
}: LogoProps) {
  const nameColor = variant === "light" ? "text-white" : "text-primary";
  const subColor = variant === "light" ? "text-white/55" : "text-muted-foreground";

  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <SnellenEMark size={BADGE_SIZE[size]} />
      <span className="inline-flex flex-col leading-none">
        <span
          style={FONT}
          className={`font-semibold tracking-tight whitespace-nowrap ${NAME_SIZE[size]} ${nameColor}`}
        >
          Dr Sonia Zouid
        </span>
        {subtitle && (
          <span
            style={FONT}
            className={`mt-1 font-medium uppercase tracking-[0.18em] whitespace-nowrap ${SUB_SIZE[size]} ${subColor}`}
          >
            {subtitle}
          </span>
        )}
      </span>
    </span>
  );
}
