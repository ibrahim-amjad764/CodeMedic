# CodeMedic — Testing & Quality Checklist

Run after implementation. Record actual results in `final-audit.md` — never claim
unverified passes.

## Automated

- [ ] `npm run lint` — 0 errors
- [ ] `npm test` (vitest) — existing `tests/validation.test.ts` still passes; add tests
      only if validation logic changes (it shouldn't)
- [ ] `npm run build` — clean production build, no type errors
- [ ] `git status` review — only intended files changed

## Functional

- [ ] `GET /` → 200; `GET /icon` → **200 `image/svg+xml`** (was 500); favicon renders
      in browser tab
- [ ] Empty submit → inline errors on Error Message + Broken Code + focusable error
      summary receives focus; links jump to fields
- [ ] Blur a required field empty → error appears; fix it → error clears
- [ ] Valid submit → loading steps cycle → diagnosis renders all 6 sections
- [ ] API error (bad key / timeout) → `ErrorState` with friendly message + retry works
- [ ] Example button → fills form, pill activates; manual edit clears pill
- [ ] "Diagnose My Bug" CTA scrolls to form + focuses error field
- [ ] Copy Fix → "Copied" state; denied-permission path doesn't crash
- [ ] Language select changes `language` → correct Prism grammar in CodeBlock

## Responsive (verify at 375 / 768 / 1024 / 1440 px)

- [ ] No horizontal overflow anywhere (watch `CodeBlock` long lines, hero CTAs)
- [ ] `lg` breakpoint: 2-col → stacked, form before results on mobile
- [ ] Header: GitHub link icon-only on `<sm`, labeled above; touch targets ≥24px (WCAG)
- [ ] Example pills wrap cleanly; char-count hints don't collide with labels
- [ ] Error summary + inline errors readable at 375px

## Accessibility

- [ ] Tab order: header → hero CTAs → form fields → examples → submit → results
- [ ] `:focus-visible` cyan ring on every interactive element (verify new error links)
- [ ] Error summary: `role="alert"`, focus moves to it on failed submit, Esc/blur sane
- [ ] Fields: `aria-invalid` + `aria-describedby` wired; labels via `htmlFor`
- [ ] Result region `aria-live="polite"` announces state changes once (not per keystroke)
- [ ] Contrast re-verified post-token-change: `ink-faint` ≥4.5:1, `border-input` ≥3:1,
      all badge tones on their `-soft` backgrounds
- [ ] `prefers-reduced-motion`: pulse/fade animations off, layout stable
- [ ] Screen reader spot-check (Narrator/VoiceOver): form errors announced, report sections headed
- [ ] Color never sole indicator (confidence icon+text, error icon+text ✅ already)

## Visual / design-system conformance

- [ ] All colors come from tokens — no new hardcoded hex (except code-theme internals)
- [ ] Spacing follows 4/8 rhythm; cards `rounded-2xl`, inputs `rounded-lg`, pills `rounded-full`
- [ ] Section headers share the icon+uppercase-label pattern
- [ ] Cyan = interactive only; violet = AI content only; status colors = semantics only
- [ ] No emoji-as-icon regressions; Lucide icons consistent `h-3.5/4` sizing
- [ ] Hover transitions 150–300ms; no layout-shifting transforms

## Performance / technical

- [ ] No new console errors/warnings on load or submit
- [ ] `/icon` produces **no outbound fetch** (verify dev-server logs — no jsdelivr)
- [ ] Bundle: no new dependencies added (`package.json` unchanged)
- [ ] `page.tsx` remains the only client page; no server/client boundary violations
