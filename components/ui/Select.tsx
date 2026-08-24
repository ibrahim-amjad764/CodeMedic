import { forwardRef, type SelectHTMLAttributes } from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  options: SelectOption[];
}

/**
 * A styled native <select>. Deliberately not a custom listbox — the
 * native control is fully keyboard- and screen-reader-accessible for
 * free, and a ten-item language list doesn't need anything fancier.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, className, ...props },
  ref,
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={clsx(
          "w-full appearance-none rounded-lg border border-border bg-surface px-3.5 py-2.5 pr-10 text-sm text-ink",
          "transition-colors hover:border-border-strong",
          "focus-visible:outline-none focus-visible:border-cyan focus-visible:ring-2 focus-visible:ring-cyan/30",
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-surface text-ink">
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
        aria-hidden="true"
      />
    </div>
  );
});
