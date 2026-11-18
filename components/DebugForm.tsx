import { useRef, useState, type FormEvent, type ReactNode, type Ref } from "react";
import { Stethoscope } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { INPUT_LIMITS } from "@/lib/validation";
import { LANGUAGE_OPTIONS, type Language } from "@/types/diagnosis";

interface DebugFormProps {
  language: Language;
  error: string;
  code: string;
  expectedBehavior: string;
  onLanguageChange: (value: Language) => void;
  onErrorChange: (value: string) => void;
  onCodeChange: (value: string) => void;
  onExpectedBehaviorChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  errorFieldRef?: Ref<HTMLTextAreaElement>;
}

type ValidatedField = "error" | "code";

const FIELD_LABELS: Record<ValidatedField, string> = {
  error: "Error Message",
  code: "Broken Code",
};

const FIELD_ANCHORS: Record<ValidatedField, string> = {
  error: "error",
  code: "code",
};

export function DebugForm({
  language,
  error,
  code,
  expectedBehavior,
  onLanguageChange,
  onErrorChange,
  onCodeChange,
  onExpectedBehaviorChange,
  onSubmit,
  isLoading,
  errorFieldRef,
}: DebugFormProps) {
  const [touched, setTouched] = useState<Record<ValidatedField, boolean>>({
    error: false,
    code: false,
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const canSubmit = error.trim().length > 0 && code.trim().length > 0 && !isLoading;

  const fieldErrors: Record<ValidatedField, string | null> = {
    error: error.trim().length === 0 ? "Please provide an error message or symptom." : null,
    code: code.trim().length === 0 ? "Please paste the broken code." : null,
  };

  const missingFields = (Object.keys(fieldErrors) as ValidatedField[]).filter(
    (field) => fieldErrors[field] !== null,
  );
  const showSummary = submitAttempted && missingFields.length > 0;

  function isInvalid(field: ValidatedField): boolean {
    return (touched[field] || submitAttempted) && fieldErrors[field] !== null;
  }

  function markTouched(field: ValidatedField) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (isLoading) return;
    if (!canSubmit) {
      setSubmitAttempted(true);
      // The summary only exists after this render — focus it on the next frame.
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setSubmitAttempted(false);
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Bug symptoms" className="space-y-5">
      {showSummary && (
        <div
          ref={summaryRef}
          role="alert"
          tabIndex={-1}
          aria-labelledby="form-error-summary-title"
          className="rounded-lg border border-danger/40 bg-danger-soft/40 px-4 py-3 text-sm"
        >
          <h3 id="form-error-summary-title" className="font-semibold text-danger">
            There is a problem
          </h3>
          <ul className="mt-1.5 list-disc space-y-1 pl-5 text-ink">
            {missingFields.map((field) => (
              <li key={field}>
                <a
                  href={`#${FIELD_ANCHORS[field]}`}
                  className="text-cyan underline-offset-2 hover:underline"
                >
                  {FIELD_LABELS[field]}
                </a>
                {" — "}
                {fieldErrors[field]}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Field label="Language" htmlFor="language">
        <Select
          id="language"
          value={language}
          onChange={(event) => onLanguageChange(event.target.value as Language)}
          options={LANGUAGE_OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
        />
      </Field>

      <Field
        label="Error Message"
        htmlFor="error"
        hint={`${error.length.toLocaleString()} / ${INPUT_LIMITS.ERROR_MAX_LENGTH.toLocaleString()}`}
        error={isInvalid("error") ? fieldErrors.error : null}
      >
        <TextArea
          id="error"
          ref={errorFieldRef}
          value={error}
          onChange={(event) => onErrorChange(event.target.value)}
          onBlur={() => markTouched("error")}
          placeholder="Paste the error message or describe the symptom..."
          rows={3}
          maxLength={INPUT_LIMITS.ERROR_MAX_LENGTH}
          required
          aria-invalid={isInvalid("error") || undefined}
          aria-describedby={isInvalid("error") ? "error-error" : undefined}
        />
      </Field>

      <Field
        label="Broken Code"
        htmlFor="code"
        hint={`${code.length.toLocaleString()} / ${INPUT_LIMITS.CODE_MAX_LENGTH.toLocaleString()}`}
        error={isInvalid("code") ? fieldErrors.code : null}
      >
        <TextArea
          id="code"
          value={code}
          onChange={(event) => onCodeChange(event.target.value)}
          onBlur={() => markTouched("code")}
          placeholder="Paste your broken code here..."
          rows={11}
          monospace
          lineNumbers
          maxLength={INPUT_LIMITS.CODE_MAX_LENGTH}
          required
          aria-invalid={isInvalid("code") || undefined}
          aria-describedby={isInvalid("code") ? "code-error" : undefined}
        />
      </Field>

      <Field
        label="Expected Behavior (optional)"
        htmlFor="expectedBehavior"
        hint={`${expectedBehavior.length.toLocaleString()} / ${INPUT_LIMITS.EXPECTED_BEHAVIOR_MAX_LENGTH.toLocaleString()}`}
      >
        <TextArea
          id="expectedBehavior"
          value={expectedBehavior}
          onChange={(event) => onExpectedBehaviorChange(event.target.value)}
          placeholder="What did you expect the code to do?"
          rows={2}
          maxLength={INPUT_LIMITS.EXPECTED_BEHAVIOR_MAX_LENGTH}
        />
      </Field>

      {/* Not disabled when invalid — a disabled button gives no explanation.
          Submitting empty fields instead reveals the inline errors and the
          focusable summary (see handleSubmit). `loading` still disables it. */}
      <Button type="submit" size="lg" className="w-full" loading={isLoading}>
        <Stethoscope className="h-4 w-4" aria-hidden="true" />
        {isLoading ? "Diagnosing..." : "Diagnose Bug"}
      </Button>
    </form>
  );
}

interface FieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string | null;
  children: ReactNode;
}

function Field({ label, htmlFor, hint, error, children }: FieldProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label
          htmlFor={htmlFor}
          className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted"
        >
          <span className="mr-1.5 text-cyan" aria-hidden="true">
            ›
          </span>
          {label}
        </label>
        {hint && <span className="font-mono text-[11px] text-ink-faint">{hint}</span>}
      </div>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
