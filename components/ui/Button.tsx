import { forwardRef, type ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5 rounded-md",
  md: "px-4 py-2.5 text-sm gap-2 rounded-lg",
  lg: "px-6 py-3.5 text-base gap-2.5 rounded-lg",
};

/**
 * The one button component the whole app uses. Three variants cover
 * every case we have: `primary` (the diagnose CTA), `secondary`
 * (bordered, e.g. "Try an Example"), and `ghost` (quiet utility actions
 * like "Copy Fix").
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading = false, disabled, className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={clsx(
        "inline-flex items-center justify-center font-semibold whitespace-nowrap",
        "transition-all duration-150 focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        sizeClasses[size],
        variant === "primary" &&
          "bg-cyan text-bg hover:brightness-110 active:brightness-95 shadow-[0_0_0_1px_rgba(47,224,240,0.35),0_10px_28px_-12px_rgba(47,224,240,0.65)]",
        variant === "secondary" &&
          "border border-border-strong bg-surface text-ink hover:border-cyan/60 hover:text-cyan",
        variant === "ghost" && "text-ink-muted hover:text-ink hover:bg-surface-raised",
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  );
});
