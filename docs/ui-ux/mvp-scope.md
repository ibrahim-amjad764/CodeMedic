# CodeMedic — MVP Scope & Feature Prioritization

This is an **existing-project UI/UX improvement**, not a rebuild. The MVP is the
current single-page tool made more polished, accessible, and reliable — nothing more.

## Must Have (this plan's scope)

| # | Item | Why |
|---|---|---|
| M1 | Fix `/icon` 500 — replace `app/icon.tsx` (runtime emoji fetch) with static `app/icon.svg` | Route currently 500s without jsDelivr access; zero-dependency fix |
| M2 | Fix `ink-faint` contrast (2.4–2.7:1 → ≥4.5:1) via token adjustment | WCAG AA failure on hint text, footnotes, placeholders-adjacent copy |
| M3 | Input boundary contrast — raise form-control borders toward 3:1 non-text contrast | WCAG 1.4.11; fields currently ~1.4:1 against surface |
| M4 | Form validation UX — inline field errors + focusable error summary on submit | Skill UX rules: validate on blur, `role="alert"` summary, `aria-describedby` wiring; today the form silently no-ops when required fields are empty |
| M5 | Visual hierarchy polish — Hero tightening, section spacing rhythm, result-panel header consistency | Core of the audit; cheap, high perceived quality |
| M6 | Header `REPO_URL` placeholder — make it configurable or remove until real | Currently a dead `yourusername` link |
| M7 | Responsive verification & fixes at 375/768/1024/1440 | Required by workflow; grid + hero + code blocks need checking |
| M8 | Accessibility pass — focus order, labels, `aria-live` on result swap, reduced-motion re-check | Much is already good; verify + patch gaps |

## Should Have (approved direction permitting; small, contained)

| # | Item |
|---|---|
| S1 | Copy-to-clipboard fallback for denied permission (currently fails silently) |
| S2 | "Copied" state announces via `aria-live` |
| S3 | Example buttons show language chip (Python/JS/TS) for scannability |
| S4 | Diagnosis report: sticky section mini-nav or numbered step labels (only if it stays simple) |
| S5 | Optional: swap body font from system stack to a self-hosted sans (e.g. IBM Plex Sans per skill's "Developer Mono" pairing) — **requires approval, adds a font file** |
| S6 | `docs/ui-ux/` documentation upkeep (already required by workflow) |

## Future Enhancements (explicitly OUT of scope)

- Light theme / theme toggle
- Diagnosis history, persistence, sharing, export
- Additional languages beyond the current 10
- Real streaming progress (OpenRouter doesn't expose it through current contract)
- Marketing pages, blog, docs site, auth/accounts
- Charts/analytics dashboards
- Replacing `@openrouter/sdk` or removing it (dependency cleanup — separate decision)
- New dependencies of any significance (GSAP, animation libs, UI kits)

## Classification rationale

The app is a focused single-viewport tool. Every Must Have item fixes a real
defect or WCAG failure; Should Haves are small UX wins that don't expand scope.
Nothing here adds features — it makes the existing feature excellent.
