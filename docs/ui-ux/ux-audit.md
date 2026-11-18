# CodeMedic — UI/UX Audit Report

Method: full source review of every component + computed WCAG contrast ratios +
UI UX Pro Max searches (`product`, `style`, `color`, `typography`, `ux`, `landing`,
`nextjs` stack). Severity: **Critical** = broken/blocks use · **High** = WCAG failure
or major UX gap · **Medium** = polish · **Low** = nit.

## A. Functional defects

### A1 — `/icon` route returns 500 (Critical)
`app/icon.tsx` renders `ImageResponse` containing the emoji `🩺`. Satori/@vercel/og
downloads emoji glyphs from `cdn.jsdelivr.net` **at render time**. On networks where
that host is unreachable (user's env: `ENOTFOUND`), the route throws and returns 500.
Reproduced in user's `npm run dev` log (8+ consecutive failures).
**Fix:** replace with a static `app/icon.svg` (file-based metadata — served directly,
no runtime rendering, no network). Design an on-brand mark (dark rounded square +
cyan EKG pulse). See `implementation-roadmap.md` Phase 1.

### A2 — Header GitHub link is a placeholder (High)
`REPO_URL = "https://github.com/yourusername/codemedic"` — dead link shipped to users.
**Fix:** make configurable via env (`NEXT_PUBLIC_REPO_URL`) with graceful hide, or
remove until a real URL exists.

## B. Accessibility

### B1 — `ink-faint` fails contrast everywhere it's used (High)
Computed ratios: `#4b5372` on `#05070e` = **2.66:1**, on `#0e1526` = **2.41:1**.
Used for: char-count hints (`DebugForm` `text-[11px]`), diagnosis disclaimer
(`text-xs`), `ink-faint` bullet dots. WCAG AA needs 4.5:1 for this small text.
**Fix:** retune token — `#7a86a3` measures 5.53:1 (bg) / 5.0:1 (surface). Keep the
name `ink-faint` (it remains the quietest ink) or rename to `ink-subtle`.

### B2 — Input borders below non-text contrast (Medium)
`border #1c2740` on surface = 1.36:1; `border-strong #2a3655` = 1.52:1.
WCAG 1.4.11 asks ~3:1 for UI component boundaries. Fields rely on fill + hover to
communicate boundaries; focus state (cyan border + ring) is good.
**Fix:** dedicated `--color-border-input` ≈ `#55648c` (3.11:1 on surface) for
`TextArea`/`Select`, keep decorative borders as-is.

### B3 — Form has no validation feedback (High)
`DebugForm` uses `noValidate` + `canSubmit` gate: empty required fields make the
button disabled with **no explanation**. No inline errors, no `aria-describedby`
error wiring, no error summary. Skill UX rules require blur-validation +
focusable `role="alert"` summary.
**Fix:** M4 in `mvp-scope.md` — add touched-state inline errors + summary.

### B4 — Result panel swaps have no live-region announcement (Medium)
`page.tsx` swaps Empty/Loading/Error/Success inside a plain `<section>`.
Screen readers get no signal when the diagnosis arrives.
**Fix:** `aria-live="polite"` on the result section (or `role="status"` wrapper);
`ErrorState` already has `role="alert"`.

### B5 — Already good (keep)
Semantic `<header>/<main>/<section>` with `aria-labelledby`, `sr-only` headings,
labels via `htmlFor`, `:focus-visible` cyan ring, `prefers-reduced-motion` kill
switch, `role="status"` + `sr-only` text in loader, `aria-pressed` on examples,
`aria-busy` on loading button, confidence shown as icon+text+color (never color
alone), native `<select>` (free a11y), copy button has visible state change.

## C. Visual design / hierarchy

### C1 — Hero is solid but generic (Medium)
Badge + H1 + 2 CTAs is fine; the EKG motif only appears in header/loader — the hero
itself is plain centered text. Per skill "Minimal & Direct" pattern this is correct
for a tool; improvements are refinement, not redesign (see design-directions.md).

### C2 — Vertical rhythm is ad-hoc (Medium)
Spacing values (`py-10 sm:py-14`, `space-y-6/7`, `mt-6`, `p-5 sm:p-7`) work but lack
a documented scale. Report sections use `space-y-7` while cards use `space-y-6`.
**Fix:** codify 4/8 rhythm in design-system.md; normalize to tokens.

### C3 — Result panel lacks a persistent header (Medium)
Empty/Loading/Error/Success each render their own chrome; the "Diagnosis" column
has no title/context when empty. A slim panel header (icon + "Diagnosis" + status)
would orient users and give the live region a stable home.

### C4 — `CodeBlock` hardcodes `bg-[#0a0e18]` (Low)
One-off hex outside the token system — fine visually (it's the deepest surface) but
should become a token (`--color-code-bg`) for consistency.

### C5 — Diagnosis report is strong (keep)
Numbered vertical rail + tone-coded section icons is genuinely distinctive and on-brand.
Minor: `h3` titles at `text-sm` may be small for section hierarchy; evidence bullets
use `text-sm` while changes use `text-xs` — intentional but worth a consistency check.

## D. UX flows

### D1 — Diagnose CTA scrolls + focuses error field — good (keep)
`handleDiagnoseCta` smooth-scrolls and focuses `errorFieldRef`. On mobile the form
is below the hero; this works.

### D2 — No way to clear/reset the form (Low)
After a diagnosis, editing is manual. A "New diagnosis" / clear affordance in the
result panel would close the loop. (Should-Have, not Must.)

### D3 — Example pills `justify-center sm:justify-start` (Low)
Minor inconsistency: centered on mobile, left on desktop — likely deliberate;
verify it doesn't look accidental next to the left-aligned form label.

### D4 — Loading steps are simulated but honest (keep)
Cycle every 1.5s with `role="status"` — appropriate for a 45s-timeout tool call.

## E. Responsive (pre-implementation checklist — verify in Phase 6)

- `lg:grid-cols-2` stacks correctly below 1024px; result panel below form on mobile
  is correct order (input first).
- `CodeBlock` has `overflow-x-auto` — check long unbroken tokens don't break layout.
- Hero `text-4xl sm:text-5xl` + wrapping CTAs — check 375px.
- Header GitHub label hides on `<sm` (icon-only) — touch target is `px-3 py-2` ≈ ok.
- Example pills wrap — ok.

## F. What the skill data says (used)

- `product`: Developer Tool/IDE → Dark Mode (OLED) + Minimalism & Swiss;
  dashboard style "Real-Time Monitor + Terminal" — matches existing identity.
- `color` (Developer Tool): dark syntax theme + blue-ish focus — current cyan/violet
  system is a valid variant; healthcare palette (calm cyan + health green) supports
  keeping cyan as primary.
- `typography`: "Developer Mono" pairing = JetBrains Mono + IBM Plex Sans —
  validates current mono choice; body swap optional (S5).
- `ux`: focusable error summary (High), inline validation on blur, loading feedback,
  empty-state guidance, 24px web target minimum, focus-not-obscured.
- `landing`: "Minimal & Direct" — single CTA focus, whitespace, no nav clutter.
- `nextjs`: push client components to leaves — `page.tsx` being `"use client"` is
  acceptable for this app (whole page is interactive state) but note for future.
