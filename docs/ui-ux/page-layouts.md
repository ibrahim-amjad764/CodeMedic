# CodeMedic — Page & Component Plan

Single route: `app/page.tsx`. Everything below preserves the current structure;
changes are refinements + the fixes listed.

## Page: `/` (Home)

**Purpose:** the entire product — submit a bug, get a diagnosis.
**Layout:** sticky Header → compact Hero → `main.max-w-6xl` → `lg:grid-cols-2`
(form+examples | result panel).

### Section-by-section plan

#### 1. Header (`components/Header.tsx`)
- Keep: sticky blur bar, logo + PulseTrace accent, GitHub link.
- Change: `REPO_URL` → `process.env.NEXT_PUBLIC_REPO_URL`; render the link only when
  set (no dead placeholder). Optional: swap 🩺 for inline SVG mark matching new favicon.

#### 2. Hero (`components/Hero.tsx`)
- Keep: badge, H1, dual CTA, `onDiagnoseClick`/`onTryExampleClick` scroll+focus.
- Change (minor): tighten vertical padding (`py-12 sm:py-14`), consider adding the
  static `PulseTrace` as a subtle divider under the CTAs (borrowed from Direction B,
  contained). Badge copy stays "AI Debugging Doctor".

#### 3. Symptoms card (left column)
- Keep: `rounded-2xl border bg-surface/60` shell, sr-only `symptoms-heading`.
- `DebugForm` changes:
  - Fields gain error state: `aria-invalid`, `aria-describedby` → error text id.
  - New `FieldError` pattern: `text-xs text-danger` under the field, rendered only
    after blur (touched) or failed submit.
  - On submit with empty required fields: show inline errors + focus a new
    **error summary** (`role="alert"`, `tabIndex={-1}`, links to fields) at form top.
  - Char-count hints keep position; they inherit the fixed `ink-faint` token.
- `ExampleButtons`: keep behavior; optional language chip per pill (S3).

#### 4. Diagnosis card (right column)
- Keep: `rounded-2xl` shell, sr-only heading, state switching.
- Change: add a slim **panel header** inside the card — `Stethoscope`-style icon +
  "Diagnosis" label + live status text (e.g. "Awaiting input" / "Diagnosing…" /
  confidence on success). Gives `aria-live` region a stable anchor.
- Wrap state components in `<div aria-live="polite">` (errors keep `role="alert"`).
- `EmptyState`: keep dashed panel; inherits fixed contrast; optional PulseTrace accent.
- `LoadingDiagnosis`: keep steps; optionally mono "readout" styling for labels (B-borrow).
- `ErrorState`: keep `role="alert"` + retry; ensure message contrast (already `text-ink`).
- `DiagnosisReport`: keep section rail; normalize title sizes (`text-sm` → maybe
  `text-base` for h3 if review agrees); disclaimer text inherits fixed faint token.
- `CodeBlock`: `bg-[#0a0e18]` → `bg-code-bg` token (new `--color-code-bg`).

## Component inventory

### Existing (reuse — no API changes)
| Component | File | Role |
|---|---|---|
| `Header` | components/Header.tsx | brand bar |
| `Hero` | components/Hero.tsx | headline + CTAs |
| `DebugForm` | components/DebugForm.tsx | input form |
| `ExampleButtons` | components/ExampleButtons.tsx | demo fillers |
| `EmptyState` / `LoadingDiagnosis` / `ErrorState` / `DiagnosisReport` | components/ | result states |
| `CodeBlock` | components/CodeBlock.tsx | syntax highlight + copy |
| `ConfidenceBadge` | components/ConfidenceBadge.tsx | confidence pill |
| `Badge` `Button` `Select` `TextArea` `PulseTrace` | components/ui/ | primitives |

### New (small, single-purpose)
| Component | Purpose |
|---|---|
| `FieldError` (inline in DebugForm or ui/) | per-field error text + id wiring |
| `ErrorSummary` (inline in DebugForm) | focusable `role="alert"` submit summary |
| `PanelHeader` (inline in page.tsx or ui/) | result-card status header |
| `app/icon.svg` | static favicon (replaces icon.tsx) |

No new dependencies. No new routes. No state-management changes.
