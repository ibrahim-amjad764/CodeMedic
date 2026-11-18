# CodeMedic — Implementation Roadmap

Direction assumed: **A (Refined Clinical Console)** — pending user approval.
Sequence is dependency-ordered: tokens first, then components that consume them,
then page wiring, then the icon fix (independent — can land anytime).

## Phase 0 — Icon fix (independent, do first — it's broken now)

| File | Change |
|---|---|
| `app/icon.svg` | **Create** — static SVG: `#05070e` rounded square + cyan EKG pulse path (reuse `WAVEFORM_D` geometry from `PulseTrace`, scaled to 32×32, `stroke="#2fe0f0"`, `stroke-width≈3`, `stroke-linecap=round`). |
| `app/icon.tsx` | **Delete** — removes the jsDelivr-dependent `ImageResponse` route entirely. Next.js file convention serves `icon.svg` at `/icon` (and `<link rel="icon">`) with zero runtime work. |

Verify: `curl -I localhost:3000/icon` → 200 `image/svg+xml`; no jsdelivr fetch in logs.

## Phase 1 — Design tokens (`app/globals.css`)

| Change | Detail |
|---|---|
| `--color-ink-faint` | `#4b5372` → `#7a86a3` (5.5:1 / 5.0:1 ✅) |
| `--color-border-input` | **Add** `#55648c` |
| `--color-code-bg` | **Add** `#0a0e18` |

No other token changes. Everything downstream inherits automatically.

## Phase 2 — Primitives (`components/ui/`)

| File | Change |
|---|---|
| `TextArea.tsx` | border `border-border` → `border-border-input`; add `aria-invalid` styling hook (`aria-invalid:border-danger` via Tailwind `aria-invalid:` variant or data attr); keep focus cyan ring |
| `Select.tsx` | same border swap |
| `Button.tsx` | no change expected (verify `cursor-pointer` — buttons get it natively) |
| `Badge.tsx` `PulseTrace.tsx` | no change |

## Phase 3 — Form UX (`components/DebugForm.tsx`)

- Add `touched` tracking per field (onBlur) + `errors` derived from the same rules
  the server enforces (required: error + code; maxLength already capped by inputs).
- `Field` component: accept `error` + `errorId`; render `<p id={errorId} className="mt-1 text-xs text-danger">`.
- Wire `aria-invalid` + `aria-describedby` on `TextArea`/`Select`.
- New `ErrorSummary`: on submit when `!canSubmit`, render
  `<div role="alert" tabIndex={-1}>` listing missing fields as anchor links
  (`href="#error"` etc.), focus it programmatically.
- Keep `noValidate`, `canSubmit` gate, char-count hints, `errorFieldRef`.

## Phase 4 — Page & panels (`app/page.tsx`, state components)

| File | Change |
|---|---|
| `page.tsx` | wrap result `<section>` content in `aria-live="polite"` region; render `PanelHeader` (icon + "Diagnosis" + status text per view state) |
| `Header.tsx` | `REPO_URL` → `NEXT_PUBLIC_REPO_URL` env; hide link when unset |
| `Hero.tsx` | padding tighten; optional static `PulseTrace` accent under CTAs |
| `EmptyState.tsx` | inherits fixed tokens; optional PulseTrace motif in the 🩺 circle |
| `LoadingDiagnosis.tsx` | optional mono readout labels (`font-mono text-[11px] uppercase`); keep `role="status"` |
| `ErrorState.tsx` | no structural change (verify contrast post-token-fix) |
| `DiagnosisReport.tsx` | normalize h3 to `text-base` if review approves; disclaimer inherits `ink-faint` fix; keep rail |
| `CodeBlock.tsx` | `bg-[#0a0e18]` → `bg-code-bg` (Tailwind 4 exposes `--color-*` as utilities) |
| `ExampleButtons.tsx` | optional: language chip on pills (S3 — only if trivial) |

## Phase 5 — Docs & verification

- Update `docs/ui-ux/final-audit.md` with real results.
- Run `npm run lint`, `npm test`, `npm run build`; manual responsive pass.

## File-level change summary

**Create:** `app/icon.svg`, `docs/ui-ux/*` (10 docs)
**Delete:** `app/icon.tsx`
**Modify:** `app/globals.css`, `app/page.tsx`, `components/Header.tsx`,
`components/Hero.tsx`, `components/DebugForm.tsx`, `components/EmptyState.tsx`,
`components/LoadingDiagnosis.tsx`, `components/DiagnosisReport.tsx`,
`components/CodeBlock.tsx`, `components/ExampleButtons.tsx` (optional),
`components/ui/TextArea.tsx`, `components/ui/Select.tsx`
**Untouched (preserved):** `app/api/diagnose/route.ts`, `lib/*`, `types/*`,
`app/layout.tsx`, all Zod schemas, OpenRouter integration, tests.

## Risks & assumptions

- `NEXT_PUBLIC_REPO_URL` unset → GitHub link hidden (assumption: acceptable vs. dead link).
- `aria-live="polite"` on the result region will announce the whole report on success —
  verbose but correct; alternative is announcing only the header status. Decide in review.
- `ink-faint` retune slightly brightens hints/disclaimers — intended.
- Static SVG favicon renders identically everywhere; no PNG fallback needed (SVG favicons
  are universally supported in 2026).
- `@openrouter/sdk` unused — flagged, not touched.
