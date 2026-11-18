# CodeMedic — Design System Proposal (Direction A: Refined Clinical Console)

Built on the **existing** `app/globals.css` token system — this extends and corrects
it, never replaces it. All changes are additive or single-value retunes.

## 1. Color tokens

### Retuned (contrast fixes)

| Token | Current | Proposed | Reason |
|---|---|---|---|
| `--color-ink-faint` | `#4b5372` (2.4–2.7:1 ❌) | `#7a86a3` (5.5:1 bg / 5.0:1 surface ✅) | WCAG AA for hint/footnote text |
| `--color-border-input` *(new)* | — | `#55648c` (3.11:1 on surface ✅) | WCAG 1.4.11 non-text for field boundaries |

`border`/`border-strong` stay as-is for decorative dividers (1.4–1.5:1 is fine for
non-essential separators; essential boundaries move to `border-input`).

### Unchanged core (verified contrast ✅)

| Role | Token | Hex | Ratio on `bg`/`surface` |
|---|---|---|---|
| Page bg | `--color-bg` | `#05070e` | — |
| Surface | `--color-surface` | `#0e1526` | — |
| Raised | `--color-surface-raised` | `#141c33` | — |
| Primary accent | `--color-cyan` | `#2fe0f0` | 12.5:1 ✅ |
| AI accent | `--color-violet` | `#9b7bfa` | 4.96:1 on violet-soft ✅ |
| Body text | `--color-ink` | `#e8ecf6` | 17:1 ✅ |
| Secondary text | `--color-ink-muted` | `#8b93ac` | 6.6:1 ✅ |
| Status | success/warning/danger + `-soft` pairs | existing | 5.1–7.9:1 ✅ |

### Semantic usage rules (codify existing practice)

- **Cyan** = interactive/primary action + live diagnostics (focus ring, CTA, pulse).
- **Violet** = AI-authored content only (fixed code block accent, "Why This Works").
- **Success/warning/danger** = status semantics only (confidence, errors, prevention).
- Never introduce new hues; never use color alone for meaning (icon+text already enforced).

## 2. Typography

| Role | Font | Token | Notes |
|---|---|---|---|
| Display/H1, card titles, report sections | Space Grotesk | `--font-display` | `font-semibold`, `tracking-tight` |
| Code, hints, labels, meta | JetBrains Mono | `--font-mono` | `text-[11px]`–`text-[13px]` |
| Body/UI | system stack | `--font-body` | unchanged (S5 optional) |

Scale (normalize to this):
- H1: `text-4xl sm:text-5xl` · section title: `text-lg` · card/label title: `text-sm font-semibold`
- Body: `text-sm` (14px) · small/meta: `text-xs` (12px) · micro labels: `text-[11px]` mono uppercase

## 3. Spacing & layout

- Rhythm: **4px base, 8px dominant** — use Tailwind's default scale; normalize the
  ad-hoc values found in audit C2 (`space-y-6` cards, `space-y-7` report rail → keep,
  they're internally consistent; document rather than churn).
- Container: `max-w-6xl` page, `max-w-4xl` hero — unchanged.
- Breakpoints: Tailwind defaults — `sm 640 / md 768 / lg 1024 / xl 1280`.
  Verify targets: 375 / 768 / 1024 / 1440.
- Section header pattern (new, shared): `icon (h-3.5 w-3.5) + text-xs font-semibold
  uppercase tracking-wide text-ink-muted` — already used in `DebugForm`/`ExampleButtons`;
  extend to result panel header for consistency.

## 4. Radius, borders, elevation

| Element | Radius | Border |
|---|---|---|
| Cards/panels | `rounded-2xl` | `border-border` |
| Inputs/selects | `rounded-lg` | `border-input` (new) → cyan on focus |
| Buttons | `rounded-lg` (md `rounded-md` for sm) | secondary: `border-border-strong` |
| Badges/pills | `rounded-full` | tone border at /30 |
| Code block | `rounded-lg` | `border-border`, bg → `--color-code-bg` |

- New token: `--color-code-bg: #0a0e18` (absorbs `CodeBlock`'s hardcoded hex).
- Shadows: keep existing — primary CTA glow `shadow-[0_0_0_1px...,0_10px_28px...]`;
  no new shadow tiers.

## 5. Motion

- Existing: `pulse-trace` (2.4s linear infinite), `fade-in-up` (0.4s), 150ms hovers.
- Rules: transform/opacity only; `prefers-reduced-motion` already kills all —
  any new animation must route through the same media query.
- Error summary focus + `aria-live` swaps are instant (no animation) — state changes
  must not animate layout.

## 6. Component states (contract)

- **Button:** default / hover(brightness-110) / active(95) / loading(Loader2+`aria-busy`)
  / disabled(opacity-50, `cursor-not-allowed`) — exists; keep.
- **Field:** default(`border-input`) / hover(`border-strong`) / focus(cyan border+ring)
  / **error (new: `border-danger` + `aria-invalid` + error text `text-danger`)** /
  disabled.
- **Badge:** 6 tones exist; no changes.
- **Result region:** empty / loading(`role=status`) / error(`role=alert`) / success —
  wrapper gains `aria-live="polite"`.

## 7. Anti-patterns (from skill checklist — enforce)

- No emojis as icons (the `🩺` in Header/EmptyState is **text branding**, not a
  structural icon — keep for brand, but the favicon becomes SVG; note: skill prefers
  SVG icons for *controls*; the stethoscope glyph is decorative brand, acceptable.
  Optional: replace with a small inline SVG stethoscope for consistency — decide in
  review).
- `cursor-pointer` on all clickables — Tailwind buttons already get it; verify pills.
- Hover transitions 150–300ms; focus visible; contrast ≥4.5:1; reduced-motion respected.
