# CodeMedic — Design Directions

Constraint (user-approved): **preserve the dark "medical diagnostic dashboard ×
developer IDE" identity.** All three directions keep the navy/cyan/violet token
family and the EKG motif — they differ in *intensity* and *layout emphasis*, not in
brand.

Skill grounding: `product` → Developer Tool/IDE recommends Dark Mode (OLED) +
Minimalism/Swiss; `landing` → "Minimal & Direct" (single CTA focus, whitespace);
`color` → dark syntax theme + health-cyan accent; `typography` → "Developer Mono"
(JetBrains Mono + sans body).

---

## Direction A — "Refined Clinical Console" (RECOMMENDED)

**Concept:** Keep the current identity; make it *tighter and more precise*. The app
already looks like a well-designed dark tool — this direction polishes hierarchy,
spacing, and states rather than adding decoration.

- **Visual style:** Minimalism & Swiss on dark OLED base; flat surfaces, 1px borders,
  restrained glow only on the primary CTA.
- **Color:** Existing palette, two surgical fixes — `ink-faint` → `#7a86a3`,
  new `border-input` ≈ `#55648c`. Cyan stays the sole interactive accent; violet
  reserved for AI-authored content (fixed code, explanation).
- **Typography:** Unchanged — Space Grotesk display, JetBrains Mono for code/labels,
  system body. (Optional S5: self-hosted IBM Plex Sans body — deferred.)
- **Layout:** Same single-page 2-col workspace. Hero slightly compressed
  (`py-12 sm:py-14`), workspace gains a consistent section-header pattern
  (icon + uppercase label + hairline) shared by form card and result card.
- **Components:** Badge/Button/Select/TextArea keep API; add inline field-error
  text + error summary; result panel gets a slim status header.
- **Interaction:** Existing 150ms transitions; add error-summary focus management;
  `aria-live` on result region.
- **UX:** Fixes every High-severity audit item; zero learning curve.
- **Pros:** lowest risk, preserves brand exactly, all changes are defensible
  polish + a11y fixes, smallest diff.
- **Cons:** least visually transformative — the "wow" stays subtle.

## Direction B — "Vital Signs Monitor"

**Concept:** Lean fully into the medical metaphor — the whole UI reads like a
patient monitor / triage console. EKG pulse becomes a recurring structural motif
(section dividers, panel headers, loading), labels get readout styling
(`font-mono uppercase tracking-widest`), status colors behave like vital signs.

- **Visual style:** Dark Mode OLED + "Real-Time Monitor" dashboard pattern from
  the skill's product data.
- **Color:** Same tokens, but cyan becomes more dominant (trace lines, active
  states), success/warning/danger used more literally as "vitals" coding.
- **Typography:** More mono — section labels and metadata in JetBrains Mono;
  Space Grotesk only for the H1 and report titles.
- **Layout:** Same grid, but panels get "monitor bezels" — header strips with
  pulsing status dot + mono label (e.g. `PATIENT: BUG-402 · STATUS: ANALYZING`).
- **Components:** `PulseTrace` reused in panel headers; `Badge` gains a "vital"
  variant; loading steps styled like monitor readouts.
- **Interaction:** Subtler; the motif carries the personality.
- **UX:** More thematic, memorable; risk of novelty outweighing clarity.
- **Pros:** most distinctive, strongest brand story, recruiter-demo friendly.
- **Cons:** more CSS/component work, can tip into gimmick; mono-everything hurts
  readability of longer AI prose; higher regression surface.

## Direction C — "Terminal Minimal"

**Concept:** Strip the medical metaphor back; present CodeMedic as a pure developer
utility — IDE/terminal aesthetic (flat, dense, keyboard-first feel), closer to
Linear/Raycast than to a clinic.

- **Visual style:** Minimalism & Swiss + Flat; denser spacing, fewer pills/badges,
  hairline borders, near-zero radius on code surfaces.
- **Color:** Desaturate — keep cyan as the only accent, demote violet to a
  secondary AI marker or remove it; neutral grays carry more weight.
- **Typography:** JetBrains Mono promoted for labels/metadata; body could move to
  a self-hosted sans (IBM Plex Sans per skill pairing) for the "tool" feel.
- **Layout:** Same structure, tighter density (`density: 8`), form and result
  panels feel like editor panes.
- **Components:** Flatter buttons (less glow/shadow), square-ish radii on code
  blocks, example buttons become a compact list.
- **Interaction:** Keyboard-forward (e.g. `⌘↵` submit hint), minimal animation.
- **UX:** Clean and fast-feeling; abandons the "doctor" personality that makes the
  product memorable.
- **Pros:** most professional/utilitarian, best density for pros.
- **Cons:** directly contradicts the preserved brand identity; biggest departure;
  the medical metaphor is the product's differentiator.

---

## Recommendation: **Direction A — Refined Clinical Console**

Reasons:
1. The audit found **no structural problems** — the layout, palette, and motif are
   already right. Direction A fixes the actual defects (contrast, icon 500, form
   validation, live regions) without gambling on a new look.
2. B and C are viable *accents*, not replacements: borrow B's mono "readout" labels
   for the panel headers and loading steps (small, contained), and C's density
   discipline for spacing — inside A's framework.
3. MVP-first: A is the smallest change set that reaches production quality.

**Awaiting user approval before finalizing the design system and implementation plan.**
