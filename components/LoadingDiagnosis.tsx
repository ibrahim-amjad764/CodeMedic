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

/**
 * Never just "Loading..." — a lightweight simulated sequence that gives
 * the visitor a sense of what CodeMedic is doing while it waits on
 * OpenRouter. The steps cycle on a timer (there's no real progress
 * signal to key off), looping if the request runs long.
 */
export function LoadingDiagnosis() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % STEPS.length);
    }, STEP_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      role="status"
      className="flex flex-col items-center gap-6 rounded-xl border border-border bg-surface px-6 py-12 text-center"
    >
      <PulseTrace animated className="h-10 w-48 text-cyan" />
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
