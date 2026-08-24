import { z } from "zod";

/**
 * types/diagnosis.ts
 * ----------------------------------------------------------------------
 * The single source of truth for CodeMedic's core domain shapes:
 *
 *  - the languages the form/API accept
 *  - the confidence levels the AI is allowed to return
 *  - the strict schema for a diagnosis returned by the AI
 *
 * The Zod schema below does double duty on purpose: `lib/ai.ts` converts
 * it to a JSON Schema (via `z.toJSONSchema`) to steer the OpenRouter
 * response, and `lib/validation.ts` re-parses the model's actual JSON
 * against this exact same schema before anything reaches the browser.
 * One definition, two jobs, zero drift between "what we asked for" and
 * "what we accept."
 */

// ---------------------------------------------------------------------
// Language
// ---------------------------------------------------------------------

export const LANGUAGE_OPTIONS = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "react", label: "React" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "sql", label: "SQL" },
  { value: "other", label: "Other" },
] as const;

export const LANGUAGE_VALUES = LANGUAGE_OPTIONS.map((o) => o.value) as [
  (typeof LANGUAGE_OPTIONS)[number]["value"],
  ...(typeof LANGUAGE_OPTIONS)[number]["value"][],
];

export type Language = (typeof LANGUAGE_OPTIONS)[number]["value"];

export function languageLabel(value: string): string {
  return LANGUAGE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

// ---------------------------------------------------------------------
// Confidence
// ---------------------------------------------------------------------

export const CONFIDENCE_LEVELS = ["high", "medium", "low"] as const;

export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];

// ---------------------------------------------------------------------
// Diagnosis (the AI response)
// ---------------------------------------------------------------------

export const DiagnosisSchema = z.strictObject({
  diagnosis: z
    .string()
    .min(1)
    .max(1000)
    .describe(
      "A concise, plain-language summary of what is wrong with the code (1-3 sentences).",
    ),
  rootCause: z
    .string()
    .min(1)
    .max(1000)
    .describe(
      "The single most likely underlying technical reason the bug occurs.",
    ),
  evidence: z
    .array(z.string().min(1).max(500))
    .min(1)
    .max(8)
    .describe(
      "Specific evidence drawn only from the user's error message and code " +
        "that supports the diagnosis. Reference exact identifiers, lines, or " +
        "observed behavior. Never invent evidence that is not present in the input.",
    ),
  fixedCode: z
    .string()
    .min(1)
    .max(30000)
    .describe(
      "The complete corrected code with the smallest reliable fix applied, " +
        "preserving the user's original style and formatting where practical.",
    ),
  changes: z
    .array(z.string().min(1).max(300))
    .min(1)
    .max(10)
    .describe(
      "A short bullet list describing exactly what changed between the " +
        "original and fixed code.",
    ),
  explanation: z
    .string()
    .min(1)
    .max(3000)
    .describe(
      "A beginner-friendly explanation of why the fix resolves the bug.",
    ),
  prevention: z
    .array(z.string().min(1).max(400))
    .min(1)
    .max(6)
    .describe(
      "2-4 practical, specific suggestions for avoiding this class of bug " +
        "in the future.",
    ),
  confidence: z
    .enum(CONFIDENCE_LEVELS)
    .describe(
      "How confident CodeMedic is in this diagnosis given only the " +
        "information provided. Use 'low' when the input does not contain " +
        "enough evidence to be sure — never force 'high' confidence.",
    ),
});

export type Diagnosis = z.infer<typeof DiagnosisSchema>;
