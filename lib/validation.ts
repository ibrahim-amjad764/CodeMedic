import { z } from "zod";
import {
  DiagnosisSchema,
  LANGUAGE_VALUES,
  type Diagnosis,
} from "@/types/diagnosis";

/**
 * lib/validation.ts
 * ----------------------------------------------------------------------
 * Everything related to "is this data trustworthy enough to act on"
 * lives here: the server-side input limits, the schema for an incoming
 * /api/diagnose request, and the schema check the AI's raw JSON must
 * pass before it is ever shown to the user.
 *
 * These limits are enforced on the server in app/api/diagnose/route.ts.
 * DebugForm.tsx also imports INPUT_LIMITS to show live character counts,
 * but that is a UX nicety only — the server re-checks everything, so a
 * request can never bypass these limits just by skipping the browser.
 */

export const INPUT_LIMITS = {
  ERROR_MAX_LENGTH: 5_000,
  CODE_MAX_LENGTH: 30_000,
  EXPECTED_BEHAVIOR_MAX_LENGTH: 5_000,
} as const;

// ---------------------------------------------------------------------
// Incoming request (POST /api/diagnose)
// ---------------------------------------------------------------------

export const DiagnoseRequestSchema = z.object({
  language: z.enum(LANGUAGE_VALUES),
  error: z
    .string()
    .trim()
    .min(1, "Please provide an error message or symptom.")
    .max(
      INPUT_LIMITS.ERROR_MAX_LENGTH,
      `Error message must be ${INPUT_LIMITS.ERROR_MAX_LENGTH.toLocaleString()} characters or fewer.`,
    ),
  code: z
    .string()
    .trim()
    .min(1, "Please paste the broken code.")
    .max(
      INPUT_LIMITS.CODE_MAX_LENGTH,
      `Code must be ${INPUT_LIMITS.CODE_MAX_LENGTH.toLocaleString()} characters or fewer.`,
    ),
  expectedBehavior: z
    .string()
    .trim()
    .max(
      INPUT_LIMITS.EXPECTED_BEHAVIOR_MAX_LENGTH,
      `Expected behavior must be ${INPUT_LIMITS.EXPECTED_BEHAVIOR_MAX_LENGTH.toLocaleString()} characters or fewer.`,
    )
    .optional()
    .default(""),
});

export type DiagnoseRequest = z.infer<typeof DiagnoseRequestSchema>;

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Validates and normalizes a raw, untrusted request body.
 * Never throws — callers get a discriminated result back.
 */
export function parseDiagnoseRequest(body: unknown): ValidationResult<DiagnoseRequest> {
  const result = DiagnoseRequestSchema.safeParse(body);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: firstIssueMessage(result.error) };
}

// ---------------------------------------------------------------------
// Outgoing AI response
// ---------------------------------------------------------------------

/**
 * Validates the AI's raw JSON payload against the exact schema we asked
 * OpenRouter for. This is the safety net: even if a model ignores the
 * requested response_format, hallucinates a field, truncates output, or
 * a different model gets swapped in via OPENROUTER_MODEL, malformed data
 * is caught here instead of reaching the UI.
 */
export function parseDiagnosisResponse(raw: unknown): ValidationResult<Diagnosis> {
  const result = DiagnosisSchema.safeParse(raw);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: firstIssueMessage(result.error) };
}

function firstIssueMessage(error: z.ZodError): string {
  const issue = error.issues[0];
  if (!issue) return "Invalid data.";
  const path = issue.path.join(".");
  return path ? `${path}: ${issue.message}` : issue.message;
}
