import { NextRequest, NextResponse } from "next/server";
import { parseDiagnoseRequest, parseDiagnosisResponse } from "@/lib/validation";
import {
  getDiagnosis,
  DiagnosisConfigError,
  DiagnosisTimeoutError,
  DiagnosisRequestError,
  DiagnosisParseError,
} from "@/lib/ai";

/**
 * POST /api/diagnose
 * ----------------------------------------------------------------------
 * Browser -> here -> server-side validation -> lib/ai.ts -> OpenRouter
 * -> Zod validation -> back to the browser. See README.md "Architecture"
 * for the full picture.
 *
 * This handler never leaks stack traces, API keys, or provider error
 * bodies to the client — every failure path returns one of a small set
 * of friendly, generic messages, while the real detail goes to
 * console.error for whoever is running the server.
 */

// Generous upper bound on the raw request body — well above the ~40KB a
// maxed-out submission (error + code + expectedBehavior) can reach — so
// we can reject obviously abusive payloads before parsing JSON at all.
const MAX_BODY_BYTES = 1_000_000;

const GENERIC_FAILURE_MESSAGE = "CodeMedic couldn't complete the diagnosis. Please try again.";
const TIMEOUT_MESSAGE = "The diagnosis took too long. Please try again.";
const BAD_FORMAT_MESSAGE = "CodeMedic received an unexpected diagnosis format. Please try again.";

export async function POST(request: NextRequest) {
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Please provide an error message and some code to diagnose." },
      { status: 400 },
    );
  }

  const parsedRequest = parseDiagnoseRequest(body);
  if (!parsedRequest.success) {
    return NextResponse.json({ error: parsedRequest.error }, { status: 400 });
  }

  let raw: unknown;
  try {
    raw = await getDiagnosis(parsedRequest.data);
  } catch (err) {
    if (err instanceof DiagnosisTimeoutError) {
      console.error("[CodeMedic] OpenRouter timeout:", err.message);
      return NextResponse.json({ error: TIMEOUT_MESSAGE }, { status: 504 });
    }
    if (err instanceof DiagnosisParseError) {
      console.error("[CodeMedic] Could not parse AI response:", err.message);
      return NextResponse.json({ error: BAD_FORMAT_MESSAGE }, { status: 502 });
    }
    if (err instanceof DiagnosisConfigError) {
      // Never echo the actual message back to the client — it can
      // mention setup details like which env var is missing.
      console.error("[CodeMedic] Configuration error:", err.message);
      return NextResponse.json({ error: GENERIC_FAILURE_MESSAGE }, { status: 500 });
    }
    if (err instanceof DiagnosisRequestError) {
      console.error("[CodeMedic] OpenRouter request failed:", err.message);
      return NextResponse.json({ error: GENERIC_FAILURE_MESSAGE }, { status: 502 });
    }
    console.error("[CodeMedic] Unexpected error while diagnosing:", err);
    return NextResponse.json({ error: GENERIC_FAILURE_MESSAGE }, { status: 500 });
  }

  const parsedDiagnosis = parseDiagnosisResponse(raw);
  if (!parsedDiagnosis.success) {
    console.error("[CodeMedic] AI response failed schema validation:", parsedDiagnosis.error);
    return NextResponse.json({ error: BAD_FORMAT_MESSAGE }, { status: 502 });
  }

  return NextResponse.json(parsedDiagnosis.data, { status: 200 });
}
