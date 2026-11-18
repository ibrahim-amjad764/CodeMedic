import { Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface HeroProps {
  onDiagnoseClick: () => void;
  onTryExampleClick: () => void;
}

const CONSOLE_LINES = [
  { text: "$ codemedic diagnose --lang auto", cls: "text-violet", delay: 150 },
  { text: "› symptom   TypeError: unsupported operand", cls: "text-cyan", delay: 320 },
  { text: "           'int' and 'str'", cls: "text-ink-faint", delay: 380 },
  { text: "› evidence input() returns str · line 2 ✓", cls: "text-cyan", delay: 540 },
  { text: "› confidence high", cls: "text-ink-muted", delay: 700 },
] as const;

const METER_BLOCKS = 10;
const METER_FILLED = 8;

const VITALS: Array<[string, string]> = [
  ["10", "Languages"],
  ["6", "Report sections"],
  ["zod", "Validated output"],
];

/**
 * Command Deck hero: split composition — pitch + CTAs + vitals stats on
 * the left, a live "intake console" card on the right that previews the
 * diagnostic pipeline. Terminal touches: mono kickers, kbd hints, and a
 * staggered line reveal (all transform/opacity, reduced-motion safe).
 */
export function Hero({ onDiagnoseClick, onTryExampleClick }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 800px 400px at 12% -10%, rgba(47,224,240,0.12), transparent 60%)," +
            "radial-gradient(ellipse 700px 420px at 92% 8%, rgba(155,123,250,0.11), transparent 55%)," +
            "linear-gradient(180deg, rgba(20,28,51,0.45), transparent 70%)",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
        <div>
          <p className="flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-cyan">
            <span aria-hidden="true" className="h-px w-7 bg-cyan/70" />
            AI Debugging Doctor
          </p>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.06] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
            Diagnose broken code.
            <br />
            <span className="text-cyan">Prescribe the fix.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
            Paste your error and broken code. CodeMedic examines the symptoms, isolates the
            root cause, and hands you a minimal, explained fix.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" onClick={onDiagnoseClick}>
              <Stethoscope className="h-4 w-4" aria-hidden="true" />
              Diagnose My Bug
            </Button>
            <Button variant="secondary" size="lg" onClick={onTryExampleClick}>
              Try an Example
            </Button>
            <span className="ml-1 hidden font-mono text-[10px] uppercase tracking-wider text-ink-faint sm:inline">
              {"//"} <span className="kbd">⌘</span>
              <span className="kbd">⏎</span> submits from the form
            </span>
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
            {VITALS.map(([value, label], i) => (
              <div
                key={label}
                className="reveal border-l-2 border-cyan-soft pl-3.5"
                style={{ animationDelay: `${500 + i * 90}ms` }}
              >
                <dt className="order-2 mt-0.5 font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-ink-faint">
                  {label}
                </dt>
                <dd className="font-display text-2xl font-semibold tracking-tight text-ink">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div
          className="reveal rounded-2xl border border-border-strong bg-gradient-to-b from-surface-raised/80 to-surface/90 p-5 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.05)] sm:p-6"
          style={{ animationDelay: "250ms" }}
          aria-hidden="true"
        >
          <div className="flex items-center gap-2 border-b border-border pb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            <span className="h-2.5 w-2.5 rounded-full bg-success/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-cyan/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-violet/80" />
            <span className="ml-1">codemedic — intake</span>
            <span className="ml-auto flex items-center gap-1.5 text-success">
              <span className="animate-live-dot h-1.5 w-1.5 rounded-full bg-success" />
              live
            </span>
          </div>
          <div className="space-y-1.5 pt-4 font-mono text-[12px] leading-7">
            {CONSOLE_LINES.map((line) => (
              <p
                key={line.text}
                className={`reveal whitespace-pre-wrap ${line.cls}`}
                style={{ animationDelay: `${line.delay}ms` }}
              >
                {line.text}
              </p>
            ))}
            <p className="flex items-center gap-2 pt-1 text-ink-faint">
              <span className="text-violet">$</span>
              awaiting patient input
              <span className="animate-caret ml-0.5 inline-block h-3.5 w-2 bg-cyan/80" />
            </p>
            <p className="pt-2 text-ink-muted">
              confidence{" "}
              <span className="tracking-[0.2em]">
                {Array.from({ length: METER_BLOCKS }, (_, i) => (
                  <span
                    key={i}
                    className="reveal inline-block"
                    style={{
                      animationDelay: `${950 + i * 70}ms`,
                      color:
                        i < METER_FILLED
                          ? "var(--color-cyan)"
                          : "var(--color-border-strong)",
                    }}
                  >
                    █
                  </span>
                ))}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
