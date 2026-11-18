# CodeMedic — Project Analysis Report

Date: 2026-11-18 · Analyst: Devin (UI/UX Pro Max workflow)

## 1. Product

**CodeMedic** — "AI-powered diagnosis and treatment for broken code." A single-page
developer tool: the user pastes an error message + broken code (+ optional expected
behavior), submits, and receives a structured AI diagnosis (diagnosis → root cause →
evidence → fixed code → explanation → prevention + confidence level).

Target audience: developers (recruiter-demo friendly per code comments) who want a
fast, credible debugging assistant. The product is a **tool**, not a marketing site —
the Hero is deliberately compact so the working interface fits one screen.

## 2. Tech stack (verified from package.json / source)

| Layer | Technology |
|---|---|
| Framework | Next.js 16.3.0 (App Router, Turbopack), React 19.2.8 |
| Language | TypeScript 6.0.3 (strict, ESM) |
| Styling | Tailwind CSS 4.3.3 (`@theme` tokens in `app/globals.css`), clsx |
| Validation | Zod 4.4.3 (`z.strictObject`, `z.toJSONSchema`) |
| AI | OpenRouter chat completions via raw `fetch` (`lib/ai.ts`); `@openrouter/sdk` is in dependencies but **not imported anywhere** — verify before relying on it |
| Code display | `prism-react-renderer` 2.4.1 (`themes.vsDark`) |
| Icons | `lucide-react` 1.31.0 + hand-drawn GitHub SVG |
| Fonts | Self-hosted variable fonts via `next/font/local`: Space Grotesk (display), JetBrains Mono (mono); body = OS UI font stack |
| Tests | Vitest 4.1.10 — `tests/validation.test.ts` only |
| Lint | ESLint 9 + eslint-config-next |

## 3. Routes & pages

- `GET /` — `app/page.tsx` (client component). Composition:
  - `Header` (sticky, brand + GitHub link)
  - `Hero` (badge, headline, 2 CTAs)
  - `main` → 2-col grid `lg:grid-cols-2`:
    - left: `DebugForm` (language select, 3 textareas, submit) + `ExampleButtons`
    - right: result panel — `EmptyState` | `LoadingDiagnosis` | `ErrorState` | `DiagnosisReport`
- `POST /api/diagnose` — `app/api/diagnose/route.ts`. Body-size cap → JSON parse →
  `parseDiagnoseRequest` (Zod) → `getDiagnosis` (OpenRouter, 45s timeout,
  `response_format: json_schema` strict) → `parseDiagnosisResponse` → 200 JSON.
  All failures return short friendly messages; details only in `console.error`.
- `GET /icon` — `app/icon.tsx`, `ImageResponse` (next/og → Satori) rendering 🩺.

## 4. State & data flow

`page.tsx` holds a discriminated `ViewState` (`empty | loading | error | success`),
form fields, `language`, `activeExampleId`. Example buttons only pre-fill the form
(deliberate — never auto-submit). `edited()` clears the active-example pill on manual
edit. No router state, no persistence, no auth, no database.

## 5. Existing design system (`app/globals.css`)

Already mature — "medical diagnostic dashboard × developer IDE":

- Colors: `bg #05070e`, `surface #0e1526`, `surface-raised #141c33`,
  `border #1c2740`, `border-strong #2a3655`, `cyan #2fe0f0` (+soft),
  `violet #9b7bfa` (+soft), `success/warning/danger` (+soft),
  `ink #e8ecf6`, `ink-muted #8b93ac`, `ink-faint #4b5372`.
- Type: `--font-display` (Space Grotesk), `--font-mono` (JetBrains Mono),
  `--font-body` (system stack).
- Motifs: `PulseTrace` EKG SVG (static in header, animated in loader),
  `animate-fade-in-up`, thin scrollbars, cyan `::selection`, cyan `:focus-visible` ring.
- `prefers-reduced-motion` fully respected.

## 6. Functional health

- **`/icon` is broken in the user's environment**: `GET /icon` → 500,
  `getaddrinfo ENOTFOUND cdn.jsdelivr.net`. Root cause: `ImageResponse`/Satori
  downloads emoji glyphs from jsDelivr at render time; `icon.tsx` renders 🩺.
  Offline/blocked-DNS environments cannot render it. (See `ux-audit.md` §B1 and
  `implementation-roadmap.md` for the fix.)
- `Header.tsx` `REPO_URL` is a placeholder (`yourusername/codemedic`) — links nowhere real.
- `@openrouter/sdk` dependency appears unused (lib uses `fetch`); flag, don't remove without approval.
- No `metadata` beyond title/description; no Open Graph image route.
- `tests/` covers only `lib/validation.ts`; UI components have no tests.

## 7. Preservation constraints (from user)

Keep: dark medical-IDE identity, Next.js/React/TS/Tailwind stack, `/api/diagnose`
contract, OpenRouter integration, Zod schemas, business logic, single-page structure.
No architecture changes, no new significant dependencies without approval.
