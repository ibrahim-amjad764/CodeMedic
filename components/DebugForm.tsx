import type { FormEvent, ReactNode, Ref } from "react";
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
  const canSubmit = error.trim().length > 0 && code.trim().length > 0 && !isLoading;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Bug symptoms" className="space-y-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
        <Stethoscope className="h-3.5 w-3.5" aria-hidden="true" />
        Symptoms
      </div>

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
      >
        <TextArea
          id="error"
          ref={errorFieldRef}
          value={error}
          onChange={(event) => onErrorChange(event.target.value)}
          placeholder="Paste the error message or describe the symptom..."
          rows={3}
          maxLength={INPUT_LIMITS.ERROR_MAX_LENGTH}
          required
        />
      </Field>

      <Field
        label="Broken Code"
        htmlFor="code"
        hint={`${code.length.toLocaleString()} / ${INPUT_LIMITS.CODE_MAX_LENGTH.toLocaleString()}`}
      >
        <TextArea
          id="code"
          value={code}
          onChange={(event) => onCodeChange(event.target.value)}
          placeholder="Paste your broken code here..."
          rows={11}
          monospace
          maxLength={INPUT_LIMITS.CODE_MAX_LENGTH}
          required
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

      <Button type="submit" size="lg" className="w-full" loading={isLoading} disabled={!canSubmit}>
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
  children: ReactNode;
}

function Field({ label, htmlFor, hint, children }: FieldProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
          {label}
        </label>
        {hint && <span className="font-mono text-[11px] text-ink-faint">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
