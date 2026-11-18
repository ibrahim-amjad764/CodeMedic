import { useEffect, useState } from "react";
import { Stethoscope, Search, Brain, Pill } from "lucide-react";
import clsx from "clsx";
import { PulseTrace } from "@/components/ui/PulseTrace";

const STEPS = [
  { label: "Examining symptoms", Icon: Stethoscope },
  { label: "Finding suspicious code", Icon: Search },
  { label: "Identifying root cause", Icon: Brain },
  { label: "Preparing treatment", Icon: Pill },
];

const STEP_INTERVAL_MS = 1500;
const PREVIEW_LINES = 6;

interface LoadingDiagnosisProps {
  /** The broken code being diagnosed — shown under a scanline sweep. */
  code?: string;
}

/**
 * Never just "Loading..." — a lightweight simulated sequence that gives
 * the visitor a sense of what CodeMedic is doing while it waits on
 * OpenRouter. The steps cycle on a timer (there's no real progress
 * signal to key off), looping if the request runs long. While waiting,
 * a cyan scanline sweeps over a preview of the submitted code — the
 * "scanner" motif from the terminal direction.
 */
export function LoadingDiagnosis({ code = "" }: LoadingDiagnosisProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % STEPS.length);
    }, STEP_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  const preview = code
    .split("\n")
    .slice(0, PREVIEW_LINES)
    .map((line) => line.slice(0, 72))
    .join("\n");

  return (
    <div
      role="status"
      className="flex flex-col items-center gap-6 rounded-xl border border-border bg-well/60 px-6 py-10 text-center"
    >
      <PulseTrace animated className="h-10 w-48 text-cyan" />

      {preview.trim().length > 0 && (
        <div className="relative w-full max-w-md overflow-hidden rounded-lg border border-border bg-code-bg text-left">
          <div className="flex items-center justify-between border-b border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            <span>scanning input</span>
            <span className="flex items-center gap-1.5 text-cyan">
              <span className="animate-live-dot h-1.5 w-1.5 rounded-full bg-cyan" />
              live
            </span>
          </div>
          <pre className="max-h-32 overflow-hidden px-3 py-2.5 font-mono text-[11px] leading-5 text-ink-faint">
            {preview}
            {code.split("\n").length > PREVIEW_LINES ? "\n…" : ""}
          </pre>
          <div aria-hidden="true" className="animate-scanline pointer-events-none absolute inset-0">
            <div className="h-14 bg-gradient-to-b from-transparent via-cyan/25 to-transparent" />
          </div>
        </div>
      )}

      <ul className="w-full max-w-xs space-y-2.5 text-left">
        {STEPS.map((step, index) => {
          const isActive = index === activeIndex;
          const Icon = step.Icon;
          return (
            <li
              key={step.label}
              className={clsx(
                "flex items-center gap-3 rounded-lg border px-3.5 py-2.5 text-sm transition-colors duration-300",
                isActive
                  ? "border-cyan/40 bg-cyan-soft text-cyan"
                  : "border-transparent text-ink-faint",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{step.label}...</span>
            </li>
          );
        })}
      </ul>
      <p className="sr-only">CodeMedic is diagnosing your code. This may take a few seconds.</p>
    </div>
  );
}
