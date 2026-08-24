"use client";

import { useCallback, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { DebugForm } from "@/components/DebugForm";
import { ExampleButtons } from "@/components/ExampleButtons";
import { EmptyState } from "@/components/EmptyState";
import { LoadingDiagnosis } from "@/components/LoadingDiagnosis";
import { DiagnosisReport } from "@/components/DiagnosisReport";
import { ErrorState } from "@/components/ErrorState";
import type { DiagnoseExample } from "@/lib/examples";
import type { Diagnosis, Language } from "@/types/diagnosis";

type ViewState =
  | { status: "empty" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; diagnosis: Diagnosis };

const GENERIC_FAILURE_MESSAGE = "CodeMedic couldn't complete the diagnosis. Please try again.";

export default function Home() {
  const [view, setView] = useState<ViewState>({ status: "empty" });
  const [language, setLanguage] = useState<Language>("python");
  const [errorText, setErrorText] = useState("");
  const [code, setCode] = useState("");
  const [expectedBehavior, setExpectedBehavior] = useState("");
  const [activeExampleId, setActiveExampleId] = useState<string | null>(null);

  const errorFieldRef = useRef<HTMLTextAreaElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  const isLoading = view.status === "loading";

  const runDiagnosis = useCallback(async () => {
    setView({ status: "loading" });
    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          error: errorText,
          code,
          expectedBehavior,
        }),
      });

      const payload: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          payload &&
          typeof payload === "object" &&
          "error" in payload &&
          typeof (payload as { error: unknown }).error === "string"
            ? (payload as { error: string }).error
            : GENERIC_FAILURE_MESSAGE;
        setView({ status: "error", message });
        return;
      }

      // The server already ran this through DiagnosisSchema.safeParse
      // before returning 200 — this is a trusted shape at this point.
      setView({ status: "success", diagnosis: payload as Diagnosis });
    } catch {
      setView({ status: "error", message: GENERIC_FAILURE_MESSAGE });
    }
  }, [language, errorText, code, expectedBehavior]);

  function handleSelectExample(example: DiagnoseExample) {
    setLanguage(example.language);
    setErrorText(example.error);
    setCode(example.code);
    setExpectedBehavior(example.expectedBehavior);
    setActiveExampleId(example.id);
    setView({ status: "empty" });
  }

  function handleDiagnoseCta() {
    workspaceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    errorFieldRef.current?.focus();
  }

  function handleTryExampleCta() {
    workspaceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /** Editing a field by hand means it no longer matches the example that
   *  was loaded, so the "active" pill on that example button should
   *  clear — the diagnosis result itself stays put until re-submitted. */
  function edited<T>(setter: (value: T) => void) {
    return (value: T) => {
      setActiveExampleId(null);
      setter(value);
    };
  }

  return (
    <div className="min-h-screen pb-20">
      <Header />
      <Hero onDiagnoseClick={handleDiagnoseCta} onTryExampleClick={handleTryExampleCta} />

      <main ref={workspaceRef} className="mx-auto max-w-6xl scroll-mt-20 px-5 py-10 sm:px-8 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 lg:items-start">
          <section
            aria-labelledby="symptoms-heading"
            className="rounded-2xl border border-border bg-surface/60 p-5 sm:p-7"
          >
            <h2 id="symptoms-heading" className="sr-only">
              Symptoms
            </h2>
            <DebugForm
              language={language}
              error={errorText}
              code={code}
              expectedBehavior={expectedBehavior}
              onLanguageChange={edited(setLanguage)}
              onErrorChange={edited(setErrorText)}
              onCodeChange={edited(setCode)}
              onExpectedBehaviorChange={edited(setExpectedBehavior)}
              onSubmit={runDiagnosis}
              isLoading={isLoading}
              errorFieldRef={errorFieldRef}
            />
            <div className="mt-6 border-t border-border pt-5">
              <ExampleButtons onSelect={handleSelectExample} activeId={activeExampleId} />
            </div>
          </section>

          <section
            aria-labelledby="diagnosis-heading"
            className="rounded-2xl border border-border bg-surface/60 p-5 sm:p-7"
          >
            <h2 id="diagnosis-heading" className="sr-only">
              Diagnosis
            </h2>
            {view.status === "empty" && <EmptyState />}
            {view.status === "loading" && <LoadingDiagnosis />}
            {view.status === "error" && (
              <ErrorState message={view.message} onRetry={runDiagnosis} />
            )}
            {view.status === "success" && (
              <DiagnosisReport diagnosis={view.diagnosis} language={language} />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
