/**
 * Shown in the diagnosis panel before anything has been submitted. The
 * three example buttons live just below the form on the other side of
 * the layout (see page.tsx) — always visible, not only pre-diagnosis —
 * so a recruiter can jump between examples without resetting anything.
 */
export function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 rounded-xl border border-dashed border-border bg-surface/40 px-6 py-12 text-center">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface text-2xl"
        aria-hidden="true"
      >
        🩺
      </div>
      <div className="max-w-sm space-y-2">
        <h3 className="font-display text-lg font-semibold text-ink">No diagnosis yet</h3>
        <p className="text-sm leading-relaxed text-ink-muted">
          Paste your error and broken code. CodeMedic will examine the symptoms, identify the
          likely root cause, and prescribe a focused fix.
        </p>
      </div>
    </div>
  );
}
