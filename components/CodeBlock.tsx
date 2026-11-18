import { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Check, Copy } from "lucide-react";
import clsx from "clsx";

// Map CodeMedic's language values to prism-react-renderer's grammar ids.
const PRISM_LANGUAGE: Record<string, string> = {
  python: "python",
  javascript: "javascript",
  typescript: "typescript",
  react: "jsx",
  java: "java",
  cpp: "cpp",
  csharp: "csharp",
  go: "go",
  sql: "sql",
  other: "markup",
};

interface CodeBlockProps {
  code: string;
  language?: string;
  label?: string;
  copyLabel?: string;
  showCopy?: boolean;
}

/**
 * Syntax-highlighted, monospace, horizontally-scrollable code display
 * with a copy button. Used for both the read-only example/user code and
 * the AI's fixed code (with copyLabel="Copy Fix").
 */
export function CodeBlock({
  code,
  language = "other",
  label,
  copyLabel = "Copy",
  showCopy = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const prismLanguage = PRISM_LANGUAGE[language] ?? "markup";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      // Clipboard API can be denied (permissions/insecure context). Fall back
      // to the deprecated-but-widely-supported execCommand path before
      // giving up quietly — still preferable to a scary console error.
      try {
        const area = document.createElement("textarea");
        area.value = code;
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
        setCopied(true);
      } catch {
        // Both paths failed — leave `copied` false and say nothing.
      }
    }
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="overflow-hidden rounded-[10px] border border-border-strong bg-code-bg shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-well/60 px-3.5 py-2">
        <span className="truncate font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
          {label ?? language}
        </span>
        {showCopy && (
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
          >
            {copied ? (
              <>
                <Check
                  key="copied"
                  className="animate-check-pop h-3.5 w-3.5 text-success"
                  aria-hidden="true"
                />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                {copyLabel}
              </>
            )}
            <span aria-live="polite" className="sr-only">
              {copied ? "Copied to clipboard" : ""}
            </span>
          </button>
        )}
      </div>
      <Highlight theme={themes.vsDark} code={code.trimEnd()} language={prismLanguage}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={clsx(className, "overflow-x-auto px-4 py-3.5 text-[13px] leading-relaxed")}
            style={{ ...style, background: "transparent" }}
          >
            {tokens.map((line, lineIndex) => {
              const lineProps = getLineProps({ line });
              return (
                <div key={lineIndex} {...lineProps}>
                  {line.map((token, tokenIndex) => {
                    const tokenProps = getTokenProps({ token });
                    return <span key={tokenIndex} {...tokenProps} />;
                  })}
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
