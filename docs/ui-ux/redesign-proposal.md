# Phase 2 — Visual Redesign Proposal

Status: **AWAITING APPROVAL** — no application code has been changed.

## What is different from Phase 1

Phase 1 was corrective: contrast fixes, validation, live regions, favicon. The page still *looks* like the old design. Phase 2 is a structural visual redesign: new hero composition, new surface/depth system, redesigned workspace panels, and a report layout built for scanning. Same brand (dark navy, cyan/violet, medical × IDE), same functionality, same journeys.

## The three concepts

All three are real, browser-renderable mockups using the app's actual self-hosted fonts (Space Grotesk + JetBrains Mono). Screenshots: `docs/ui-ux/mockups/screenshots/` (1440px + 375px each). Open the `.html` files directly to inspect interactively.

### A — Command Deck (`mockups/command-deck.html`)
Premium "diagnostic console" direction. Split hero: oversized display headline left, live EKG/vitals readout card right (reinforces the medical-monitor metaphor as a *feature*, not decoration). Workspace becomes a raised instrument panel with a traffic-light/title-bar chrome, monospace field labels, and stronger input wells. Report uses numbered section rails (01–06) with icon chips and a sticky confidence header. Depth via layered surfaces + inset highlights + long soft shadows. Most "product-like" of the three.

### B — Terminal IDE (`mockups/terminal-ide.html`)
Pure developer-tool direction. Hero is a compact command-line aesthetic: `$ codemedic diagnose` prompt styling, scan-line/grid backdrop, dense mono accents. Workspace is a two-pane editor split — left pane literally looks like a code editor (line numbers, syntax-tinted broken code), right pane is the diagnosis output styled like a compiler/linter result. Report sections are terminal-style blocks with `$` prefixes and diff-like fix presentation. Sharpest, most utilitarian; least "premium consumer" feel.

### C — Soft Clinical (`mockups/soft-clinical.html`)
Premium ambient direction. Centered hero with aurora gradient background, film grain, glassmorphic panels (frosted, blurred, layered translucency), gradient headline text, pill trust signals. Workspace cards are frosted glass with tinted icon wells; report is airy rounded section cards with numbered tags. Most visually luxurious; highest implementation cost (backdrop-filter everywhere) and needs careful contrast/perf management.

## Comparison to current UI

| | Current (Phase 1) | Command Deck | Terminal IDE | Soft Clinical |
|---|---|---|---|---|
| Hero | Left-aligned text + EKG underline | Split layout + vitals card | Compact terminal prompt | Centered aurora + glass |
| Workspace | Two flat cards | Raised instrument panel, chrome bar | Editor split w/ line numbers | Frosted glass cards |
| Code input vs result | Similar card weight | Distinct: form wells vs report rail | Maximally distinct: editor vs output | Distinct via tint + radius |
| Report | Stacked sections, plain headers | Numbered rails, icon chips, sticky meta | Terminal blocks, diff fix | Airy cards, numbered tags |
| Depth | Flat surfaces, 1px borders | Layered shadows, inset highlights | Flat + grid texture | Blur, translucency, grain |
| Motion | Minimal | Subtle pulse on vitals | Cursor blink | Aurora drift (reduced-motion safe) |

## Recommendation: **A — Command Deck**

Reasons:
- Delivers the "clearly noticeable transformation" requested without decorative risk.
- The vitals/readout motif turns the existing EKG identity into a functional visual anchor — distinctive, ownable, on-brand.
- Best scanability for the diagnosis report (numbered clinical sections mirror the "medical report" metaphor literally).
- Lowest risk: no heavy blur/translucency (unlike C), no readability tradeoffs (unlike B's dense mono everywhere), no new dependencies, fully implementable in Tailwind + existing tokens.
- B is a strong second choice if you want maximum developer-tool cred; C if you want maximum visual luxury — both are documented and mockup'd if you prefer them.

## If approved — implementation scope (visual only)

- `app/globals.css`: new surface/elevation tokens, depth utilities, keep all Phase 1 a11y tokens.
- `components/Hero.tsx`: new composition per chosen direction.
- `app/page.tsx`: workspace shell chrome.
- `components/DebugForm.tsx`, `ExampleButtons.tsx`, ui primitives: restyled fields/buttons/panels.
- `components/DiagnosisReport.tsx`, `CodeBlock.tsx`, `EmptyState.tsx`, `LoadingDiagnosis.tsx`, `ErrorState.tsx`: report + state redesigns.
- **Untouched:** `app/api/`, `lib/`, validation, types, business logic, dependencies.
- Then: lint/test/typecheck/build + screenshots at 375/768/1024/1440 + contrast re-verification + `final-audit.md` update.

## Awaiting your decision

Pick **A**, **B**, or **C** (or a hybrid — e.g., "A's workspace with C's hero"). On approval I implement and verify.

Mockup files:
- `docs/ui-ux/mockups/command-deck.html`
- `docs/ui-ux/mockups/terminal-ide.html`
- `docs/ui-ux/mockups/soft-clinical.html`
- Screenshots: `docs/ui-ux/mockups/screenshots/{name}-{desktop,mobile}.png`

*Note: I cannot render images in this environment, so please open the mockups/screenshots yourself — the HTML files open directly in a browser.*

---

**Status: IMPLEMENTED** — user approved the A+B hybrid (Command Deck base,
Terminal IDE touches, specified motion layer). See `final-audit.md` Phase 2
section and `screenshots/phase2-*.png`.
