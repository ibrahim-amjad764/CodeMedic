import {
  forwardRef,
  useRef,
  type TextareaHTMLAttributes,
} from "react";
import clsx from "clsx";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  monospace?: boolean;
  /** Renders a synced, non-interactive line-number gutter (IDE style). */
  lineNumbers?: boolean;
}

const GUTTER_LINE_HEIGHT = "h-6 leading-6"; // 24px — must match textarea leading-6

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { monospace = false, lineNumbers = false, className, value, onScroll, wrap, ...props },
  ref,
) {
  const gutterInnerRef = useRef<HTMLDivElement>(null);
  const lines = String(value ?? "")
    .split("\n")
    .map((_, i) => i + 1);
  if (lines.length === 0) lines.push(1);

  function syncGutter(scrollTop: number) {
    const el = gutterInnerRef.current;
    if (el) el.style.transform = `translateY(${-scrollTop}px)`;
  }

  const control = (
    <textarea
      ref={ref}
      value={value}
      wrap={lineNumbers ? "off" : wrap}
      onScroll={(event) => {
        syncGutter(event.currentTarget.scrollTop);
        onScroll?.(event);
      }}
      className={clsx(
        "w-full resize-y rounded-[10px] border border-border-input bg-well px-3.5 py-3 text-sm text-ink shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)] placeholder:text-ink-faint",
        "transition-colors duration-150 hover:border-border-strong",
        "focus-visible:outline-none focus-visible:border-cyan focus-visible:ring-2 focus-visible:ring-cyan/30",
        "aria-invalid:border-danger aria-invalid:focus-visible:border-danger aria-invalid:focus-visible:ring-danger/30",
        monospace && "font-mono",
        lineNumbers && "leading-6",
        lineNumbers && "pl-12",
        className,
      )}
      {...props}
    />
  );

  if (!lineNumbers) return control;

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 flex w-10 select-none flex-col overflow-hidden rounded-l-[10px] border border-r-0 border-border-input bg-[#070b14]/70"
      >
        <div ref={gutterInnerRef} className="will-change-transform pt-3">
          {lines.map((n) => (
            <div
              key={n}
              className={clsx(
                "pr-2 text-right font-mono text-[11px] text-ink-faint",
                GUTTER_LINE_HEIGHT,
              )}
            >
              {n}
            </div>
          ))}
        </div>
      </div>
      {control}
    </div>
  );
});
