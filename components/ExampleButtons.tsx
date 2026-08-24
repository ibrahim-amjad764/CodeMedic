import clsx from "clsx";
import { FlaskConical } from "lucide-react";
import { EXAMPLES, type DiagnoseExample } from "@/lib/examples";

interface ExampleButtonsProps {
  onSelect: (example: DiagnoseExample) => void;
  activeId?: string | null;
}

/**
 * The three required demo examples. Selecting one only fills the form —
 * see DebugForm/page.tsx — it never calls the API by itself. The visitor
 * always has to press "Diagnose Bug" themselves.
 */
export function ExampleButtons({ onSelect, activeId }: ExampleButtonsProps) {
  return (
    <div>
      <p className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted sm:justify-start">
        <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
        Try an example
      </p>
      <div className="mt-2.5 flex flex-wrap justify-center gap-2 sm:justify-start">
        {EXAMPLES.map((example) => {
          const isActive = activeId === example.id;
          return (
            <button
              key={example.id}
              type="button"
              onClick={() => onSelect(example)}
              aria-pressed={isActive}
              className={clsx(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "border-cyan/60 bg-cyan-soft text-cyan"
                  : "border-border bg-surface text-ink-muted hover:border-border-strong hover:text-ink",
              )}
            >
              {example.buttonLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
