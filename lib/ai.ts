import "server-only";
import { z } from "zod";
import { DiagnosisSchema } from "@/types/diagnosis";
import { SYSTEM_PROMPT, buildUserPrompt, type DiagnosisPromptInput } from "@/lib/prompt";

/**
 * lib/ai.ts
 * ----------------------------------------------------------------------
 * The ONLY file in this codebase that talks to OpenRouter. The
 * OPENROUTER_API_KEY is read here, from process.env, on the server —
 * it is never imported by, or reachable from, a client component.
 *
 * Flow: build request -> POST to OpenRouter -> pull the JSON text out
 * of the chat completion -> parse it -> hand back a plain unknown value.
 * Schema validation of *that* value happens one layer up, in
 * lib/validation.ts, so this file only has to worry about talking to
 * the network, not about whether the AI's opinion was any good.
 */

const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

/** Used when OPENROUTER_MODEL is unset. Must support OpenRouter's
 *  structured-outputs (response_format: json_schema) feature — see
 *  https://openrouter.ai/models?supported_parameters=structured_outputs */
const DEFAULT_MODEL = "openai/gpt-4o-mini";

const REQUEST_TIMEOUT_MS = 45_000;
const MAX_OUTPUT_TOKENS = 4096;

/** The response schema, expressed as JSON Schema for OpenRouter's
 *  `response_format`. Derived once from the exact same Zod schema that
 *  validates the response on the way back out, so the "ask" and the
 *  "check" can never drift apart. */
const DIAGNOSIS_JSON_SCHEMA = z.toJSONSchema(DiagnosisSchema);

export class DiagnosisConfigError extends Error {}
export class DiagnosisTimeoutError extends Error {}
export class DiagnosisRequestError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}
export class DiagnosisParseError extends Error {}

/**
 * Calls OpenRouter and returns the AI's diagnosis as a parsed-but-not-
 * yet-schema-validated value. Throws one of the typed errors above on
 * any failure; callers (the route handler) decide what to tell the user.
 */
export async function getDiagnosis(input: DiagnosisPromptInput): Promise<unknown> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new DiagnosisConfigError(
      "OPENROUTER_API_KEY is not set. Copy .env.example to .env.local and add your OpenRouter API key.",
    );
  }
  const model = process.env.OPENROUTER_MODEL?.trim() || DEFAULT_MODEL;

  const requestBody = {
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(input) },
    ],
    temperature: 0.2,
    max_tokens: MAX_OUTPUT_TOKENS,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "codemedic_diagnosis",
        strict: true,
        schema: DIAGNOSIS_JSON_SCHEMA,
      },
    },
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(OPENROUTER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        // Optional OpenRouter attribution header — safe to keep static.
        "X-Title": "CodeMedic",
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new DiagnosisTimeoutError(
        `OpenRouter did not respond within ${REQUEST_TIMEOUT_MS / 1000}s.`,
      );
    }
    throw new DiagnosisRequestError(
      `Failed to reach OpenRouter: ${err instanceof Error ? err.message : String(err)}`,
    );
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const bodyText = await safeReadText(response);
    throw new DiagnosisRequestError(
      `OpenRouter returned ${response.status} ${response.statusText}: ${bodyText.slice(0, 500)}`,
      response.status,
    );
  }

  const payload: unknown = await response.json();
  const content = extractMessageContent(payload);

  if (!content) {
    throw new DiagnosisParseError("OpenRouter response did not contain any message content.");
  }

  return parseJsonContent(content);
}

// ---------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------

async function safeReadText(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    return "";
  }
}

/** Pulls `choices[0].message.content` out of an OpenAI-compatible chat
 *  completion payload without assuming the shape is trustworthy. */
function extractMessageContent(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null) return null;
  const choices = (payload as Record<string, unknown>).choices;
  if (!Array.isArray(choices) || choices.length === 0) return null;
  const first = choices[0];
  if (typeof first !== "object" || first === null) return null;
  const message = (first as Record<string, unknown>).message;
  if (typeof message !== "object" || message === null) return null;
  const content = (message as Record<string, unknown>).content;
  return typeof content === "string" && content.trim().length > 0 ? content : null;
}

/** Some models wrap JSON in markdown fences despite instructions not
 *  to. Strip those defensively before parsing. */
function stripCodeFences(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const captured = fenced?.[1];
  return captured !== undefined ? captured.trim() : trimmed;
}

function parseJsonContent(content: string): unknown {
  try {
    return JSON.parse(stripCodeFences(content));
  } catch {
    throw new DiagnosisParseError("Could not parse JSON from the AI response.");
  }
}
