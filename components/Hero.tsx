import { Stethoscope, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface HeroProps {
  onDiagnoseClick: () => void;
  onTryExampleClick: () => void;
}

/**
 * Compact on purpose — this is a developer tool, not a marketing site.
 * The real interface (DebugForm + diagnosis panel) should appear on the
 * same screen with minimal scrolling.
 */
export function Hero({ onDiagnoseClick, onTryExampleClick }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="mx-auto max-w-4xl px-6 py-12 text-center sm:py-16">
        <Badge tone="cyan" icon={<Sparkles className="h-3.5 w-3.5" aria-hidden="true" />}>
          AI Debugging Doctor
        </Badge>

        <h1 className="mt-6 text-balance font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Code<span className="text-cyan">Medic</span>
        </h1>
        <p className="mt-3 text-lg font-medium text-ink-muted sm:text-xl">
          AI-powered diagnosis and treatment for broken code.
        </p>
        <p className="mx-auto mt-5 max-w-xl text-balance text-sm leading-relaxed text-ink-muted sm:text-base">
          Paste your error and broken code. CodeMedic finds the likely root cause, shows the
          evidence, and prescribes a focused fix.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" onClick={onDiagnoseClick}>
            <Stethoscope className="h-4 w-4" aria-hidden="true" />
            Diagnose My Bug
          </Button>
          <Button variant="secondary" size="lg" onClick={onTryExampleClick}>
            Try an Example
          </Button>
        </div>
      </div>
    </section>
  );
}
