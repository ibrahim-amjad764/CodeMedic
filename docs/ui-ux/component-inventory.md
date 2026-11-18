# CodeMedic — Reusable Component Inventory

Consolidated list for implementation reference. Details in `page-layouts.md`.

## Keep as-is (verified good)

- `Header` — sticky blur bar; only REPO_URL changes
- `Hero` — compact tool hero; minor padding/motif polish
- `DebugForm` — form logic solid; gains validation UX only
- `ExampleButtons` — behavior correct; optional language chip
- `EmptyState` / `LoadingDiagnosis` / `ErrorState` — state coverage complete
- `DiagnosisReport` — strongest component; minor type-scale normalization
- `CodeBlock` — swap hardcoded hex for token
- `ConfidenceBadge` — icon+text+color, exemplary
- `ui/Badge`, `ui/Button`, `ui/Select`, `ui/PulseTrace` — no changes

## Modify

- `app/globals.css` — 2 token retunes + 2 new tokens
- `app/page.tsx` — aria-live region + panel header
- `components/ui/TextArea.tsx`, `components/ui/Select.tsx` — `border-input` + error styling
- `components/DebugForm.tsx` — touched/errors/error-summary wiring
- `components/CodeBlock.tsx` — `bg-code-bg`

## Create

- `app/icon.svg` — static favicon (EKG pulse on `#05070e`)
- Inline (no new files needed): `FieldError`, `ErrorSummary`, `PanelHeader` —
  small enough to live inside their parent components per codebase style
  (see `Field` inside `DebugForm.tsx` for precedent)

## Explicitly NOT created

No new routes, no modals/dialogs, no toast system, no theme provider, no
state-management lib, no animation lib, no icon-lib additions (lucide-react
already covers needs), no UI kit (shadcn etc.) — the codebase's hand-rolled
primitives are consistent and accessible; replacing them would violate the
preservation rules for zero user benefit.
