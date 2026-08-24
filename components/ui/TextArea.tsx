import { forwardRef, type TextareaHTMLAttributes } from "react";
import clsx from "clsx";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  monospace?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { monospace = false, className, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={clsx(
        "w-full resize-y rounded-lg border border-border bg-surface px-3.5 py-3 text-sm text-ink placeholder:text-ink-faint",
        "transition-colors hover:border-border-strong",
        "focus-visible:outline-none focus-visible:border-cyan focus-visible:ring-2 focus-visible:ring-cyan/30",
        monospace && "font-mono",
        className,
      )}
      {...props}
    />
  );
});
