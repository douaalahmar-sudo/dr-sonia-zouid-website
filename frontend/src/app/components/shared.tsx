import React from "react";
import { motion } from "motion/react";

// ─── Google "G" mark (for the "leave a review" link) ──────────────────────────
export function GoogleGIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.66Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.87-3a7.15 7.15 0 0 1-4.07 1.17c-3.13 0-5.78-2.11-6.73-4.96H1.24v3.09A11.98 11.98 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.31A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.58.38-2.31V6.6H1.24A11.98 11.98 0 0 0 0 12c0 1.93.46 3.76 1.24 5.4l4.03-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.24 6.6l4.03 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

// ─── Animation helper ─────────────────────────────────────────────────────────
export function FadeIn({
  children,
  delay = 0,
  className = "",
  from = "bottom",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  from?: "bottom" | "left" | "right" | "none";
}) {
  const initial =
    from === "left"
      ? { opacity: 0, x: -32 }
      : from === "right"
      ? { opacity: 0, x: 32 }
      : from === "none"
      ? { opacity: 0 }
      : { opacity: 0, y: 28 };
  const animate =
    from === "left" || from === "right"
      ? { opacity: 1, x: 0 }
      : from === "none"
      ? { opacity: 1 }
      : { opacity: 1, y: 0 };

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
