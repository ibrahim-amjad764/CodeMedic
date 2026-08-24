import type { ReactNode } from "react";
import clsx from "clsx";

type BadgeTone = "cyan" | "violet" | "success" | "warning" | "danger" | "neutral";

interface BadgeProps {
  tone?: BadgeTone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

const toneClasses: Record<BadgeTone, string> = {
  cyan: "bg-cyan-soft text-cyan border-cyan/30",
  violet: "bg-violet-soft text-violet border-violet/30",
  success: "bg-success-soft text-success border-success/30",
  warning: "bg-warning-soft text-warning border-warning/30",
  danger: "bg-danger-soft text-danger border-danger/30",
  neutral: "bg-surface-raised text-ink-muted border-border-strong",
};

export function Badge({ tone = "neutral", icon, children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
        toneClasses[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
