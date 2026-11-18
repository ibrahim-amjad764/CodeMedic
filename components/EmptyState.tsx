import { SquareTerminal } from "lucide-react";

/**
 * Shown in the diagnosis panel before anything has been submitted. The
 * three example buttons live just below the form on the other side of
 * the layout (see page.tsx) — always visible, not only pre-diagnosis —
 * so a recruiter can jump between examples without resetting anything.
 */
export function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 rounded-xl border border-dashed border-border-strong bg-well/40 px-6 py-12 text-center">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-xl border border-border-strong bg-surface-raised text-cyan"
        aria-hidden="true"
      >
        <SquareTerminal className="h-6 w-6" />
      </div>
      <div className="max-w-sm space-y-2">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
          output // awaiting input
        </p>
        <h3 className="font-display text-lg font-semibold text-ink">No diagnosis yet</h3>
        <p className="text-sm leading-relaxed text-ink-muted">
          Paste your error and broken code. CodeMedic will examine the symptoms, identify the
          likely root cause, and prescribe a focused fix.
        </p>
      </div>
    </div>
  );
}
