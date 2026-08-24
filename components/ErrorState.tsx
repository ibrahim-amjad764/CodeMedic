import { TriangleAlert, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

/**
 * Covers every failure described in the spec — API failure, OpenRouter
 * timeout, invalid AI response — with one component. The message text
 * always comes from the server (see app/api/diagnose/route.ts), which
 * only ever returns short, friendly copy — never a stack trace.
 */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex h-full flex-col items-center justify-center gap-5 rounded-xl border border-danger/30 bg-danger-soft/30 px-6 py-12 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-danger/40 bg-danger-soft text-danger">
        <TriangleAlert className="h-6 w-6" aria-hidden="true" />
      </div>
      <p className="max-w-sm text-sm leading-relaxed text-ink">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Try again
        </Button>
      )}
    </div>
  );
}
