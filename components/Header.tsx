import { PulseTrace } from "@/components/ui/PulseTrace";
import { Stethoscope } from "lucide-react";

// Optional — set NEXT_PUBLIC_REPO_URL in .env.local to show the GitHub link.
// When unset the link is hidden entirely rather than pointing at a placeholder.
const REPO_URL = process.env.NEXT_PUBLIC_REPO_URL;

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-[9px] border border-border-strong bg-surface shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <Stethoscope className="h-4 w-4 text-cyan" aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            CodeMedic
          </span>
          <PulseTrace className="hidden h-4 w-16 text-cyan/70 sm:block" />
        </div>
        {REPO_URL && (
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-muted transition-colors duration-150 hover:border-cyan/50 hover:text-cyan"
          >
            <GithubMark className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        )}
      </div>
    </header>
  );
}

/** lucide-react doesn't ship brand/logo marks, so this one small icon is
 *  a hand-drawn inline SVG rather than a library import. */
function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.39 7.86 10.91.57.1.79-.25.79-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.53-1.33-1.29-1.69-1.29-1.69-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.15 0 1.55-.01 2.8-.01 3.18 0 .3.21.66.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z"
      />
    </svg>
  );
}
