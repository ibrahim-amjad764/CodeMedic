# Dependency & Setup Guide

This file explains, A to Z, how to get CodeMedic running locally and what every dependency in `package.json` actually does. If `README.md` is "what this is," this file is "how to stand it up on your machine."

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Create / Clone the Project](#2-create--clone-the-project)
3. [Install Dependencies](#3-install-dependencies)
4. [Dependency-by-Dependency Explanation](#4-dependency-by-dependency-explanation)
5. [Development Commands](#5-development-commands)
6. [Environment Setup](#6-environment-setup)
7. [Common Problems](#7-common-problems)
8. [Production Build](#8-production-build)
9. [Dependency Philosophy](#9-dependency-philosophy)

---

## 1. Prerequisites

| Tool | Version | Check with | Notes |
|---|---|---|---|
| Node.js | **20.9 or later** (Node 22 LTS recommended) | `node --version` | Next.js 16 requires Node 20.9+; Node 18 is no longer supported. |
| npm | 10+ (ships with Node 20/22) | `npm --version` | pnpm or yarn work too — just translate the `npm run …` commands below. |
| Git | any recent version | `git --version` | Only needed if you're cloning from a repository rather than unzipping this project. |
| OpenRouter account + API key | — | — | Sign up and create a key at <https://openrouter.ai/keys>. A card on file is required by OpenRouter to raise you above the free-tier rate limit, but the model this project defaults to (`openai/gpt-4o-mini`) is inexpensive — a full day of demoing costs cents, not dollars. |

If `node --version` prints something below `v20.9.0`, install a newer Node before continuing (e.g. via [nvm](https://github.com/nvm-sh/nvm): `nvm install 22 && nvm use 22`).

## 2. Create / Clone the Project

If you received this project as a folder or zip archive:

```bash
cd path/to/codemedic
```

If it's in a Git repository:

```bash
git clone <your-repo-url> codemedic
cd codemedic
```

## 3. Install Dependencies

```bash
npm install
```

This reads `package.json` and installs everything listed under `dependencies` and `devDependencies` into `node_modules/`. It's the only install command this project needs — there are no separate backend/frontend folders to install into.

## 4. Dependency-by-Dependency Explanation

### Runtime dependencies (`dependencies`)

| Package | Why it exists | Where it's used | If removed |
|---|---|---|---|
| `next` | The framework: React Server/Client Components, the App Router, the `/api/diagnose` Route Handler, dev server, and production bundler, all in one. | Everywhere — `app/`, `next.config.ts`. | The project stops existing; this is the foundation everything else sits on. |
| `react`, `react-dom` | The UI library Next.js is built on. | Every `.tsx` file. | Same as above — required by Next.js itself. |
| `zod` | Schema validation. Defines the AI response shape once and uses it both to build the OpenRouter request (`z.toJSONSchema`) and to validate what comes back (`safeParse`), plus validates the incoming HTTP request body. | `types/diagnosis.ts`, `lib/validation.ts`, `lib/ai.ts`. | You'd have to hand-write JSON Schema *and* a separate hand-written validator, and keep them in sync manually — exactly the kind of drift this project avoids. |
| `lucide-react` | Icon set used throughout the UI (stethoscope, search, shield, copy, etc.) — consistent stroke weight and style. | Most files under `components/`. | Icons would need to be inline SVG or emoji only; more code, less consistent. |
| `clsx` | Tiny utility for conditionally joining Tailwind class names. | UI primitives in `components/ui/` and a few feature components. | Conditional classNames would be built with manual template strings/ternaries — works, but gets messy fast with 3+ conditions. |
| `prism-react-renderer` | Syntax highlighting for code blocks (`CodeBlock.tsx`), synchronous (no async grammar loading) and themeable via a simple render-prop API. | `components/CodeBlock.tsx`. | Code would render as plain monospace text with no syntax colors — still usable, just less "IDE-like." |
| `server-only` | A near-zero-code package that throws a build error if a file importing it is ever pulled into a client bundle. Used to guarantee `lib/ai.ts` (which reads `OPENROUTER_API_KEY`) can never end up in the browser. | `lib/ai.ts`. | The API key would still *work* correctly (Next.js already keeps Route-Handler-only code server-side by default), but you'd lose the explicit, build-time guardrail against a future refactor accidentally importing `lib/ai.ts` from a Client Component. |

### Development dependencies (`devDependencies`)

| Package | Why it exists | Where it's used | If removed |
|---|---|---|---|
| `typescript` | Static typing for the whole codebase; also what `next build` uses to type-check before shipping. | Every `.ts`/`.tsx` file, `tsconfig.json`. | The project would need renaming to `.js`/`.jsx` and would lose all compile-time type safety. |
| `@types/node`, `@types/react`, `@types/react-dom` | Type definitions for Node's built-ins and React, so TypeScript understands `process.env`, JSX, hooks, etc. | Implicitly, everywhere. | TypeScript would report errors on/lose autocomplete for Node and React APIs. |
| `tailwindcss`, `@tailwindcss/postcss` | Tailwind v4's engine and its PostCSS plugin. Generates all utility classes from the design tokens declared in `app/globals.css` (`@theme` block) — there's no separate `tailwind.config.js` in v4. | `app/globals.css`, `postcss.config.mjs`. | You'd be writing every style by hand in plain CSS — a much larger, slower rewrite. |
| `postcss` | The CSS transform pipeline Tailwind's plugin runs on top of. | `postcss.config.mjs`. | Required peer for `@tailwindcss/postcss`; without it Tailwind can't process `globals.css`. |
| `eslint`, `eslint-config-next` | Linting: catches unused variables, React hook mistakes, accessibility issues, and Next.js-specific pitfalls before they become bugs. | `eslint.config.mjs`, run via `npm run lint`. | Code would still run, but nothing would flag common mistakes automatically. |
| `vitest` | Fast unit test runner for `tests/validation.test.ts`. | `vitest.config.ts`, run via `npm test`. | You'd lose automated coverage of the validation layer and have to test everything manually through the UI. |

## 5. Development Commands

All defined in `package.json` → `scripts`:

```bash
npm run dev      # start the dev server at http://localhost:3000, with fast refresh
npm run build    # type-check + produce an optimized production build in .next/
npm run start    # serve the production build created by `npm run build`
npm run lint     # run ESLint across the project
npm test         # run the Vitest unit tests once
npm run test:watch  # run Vitest in watch mode while you work
```

## 6. Environment Setup

CodeMedic reads its configuration from `.env.local`, which is git-ignored so your real API key never gets committed.

```bash
cp .env.example .env.local
```

Then open `.env.local` and fill in:

```env
OPENROUTER_API_KEY=sk-or-v1-...your-key-here...
OPENROUTER_MODEL=openai/gpt-4o-mini
```

- **`OPENROUTER_API_KEY`** (required) — create one at <https://openrouter.ai/keys>. This is read only on the server, inside `lib/ai.ts`; it's never exposed to the browser.
- **`OPENROUTER_MODEL`** (optional) — defaults to `openai/gpt-4o-mini` if you leave it blank or delete the line entirely. You can point it at any model slug OpenRouter serves, as long as that model/provider combination supports structured outputs (`response_format: json_schema`) — browse <https://openrouter.ai/models?supported_parameters=structured_outputs> for options.

Restart `npm run dev` after changing `.env.local` — Next.js only reads environment variables at server startup.

## 7. Common Problems

**"It looks like you're trying to use TypeScript but do not have the required package(s) installed."**
This means `npm install` didn't finish successfully, or `node_modules/typescript` is missing/corrupted. Delete `node_modules` and `package-lock.json`, then run `npm install` again.

**Node version mismatch / strange install errors.**
Run `node --version` and confirm it's `20.9.0` or later. Next.js 16 will refuse to run on older versions. Switch with `nvm use 22` (or install Node 22 fresh) and re-run `npm install`.

**"CodeMedic couldn't complete the diagnosis" on every single request.**
Almost always a missing or invalid `OPENROUTER_API_KEY`. Confirm `.env.local` exists (not just `.env.example`), contains a real key with no surrounding quotes, and that you restarted `npm run dev` after editing it. Check the terminal running `npm run dev` — the real error (e.g. "401 Unauthorized" from OpenRouter) is logged there via `console.error`, even though the browser only ever sees the friendly generic message.

**"The diagnosis took too long. Please try again."**
The OpenRouter request hit CodeMedic's 45-second timeout (`lib/ai.ts`). Usually transient — try again. If it happens consistently, the configured `OPENROUTER_MODEL` may be slow or having issues upstream; try a different model.

**"CodeMedic received an unexpected diagnosis format."**
The model's response didn't validate against the required schema — most often because `OPENROUTER_MODEL` was changed to a model/provider that doesn't fully support `response_format: json_schema`. Switch back to the default (`openai/gpt-4o-mini`) or pick another model from OpenRouter's [structured-outputs filter](https://openrouter.ai/models?supported_parameters=structured_outputs).

**Invalid OpenRouter model.**
If `OPENROUTER_MODEL` is set to a slug that doesn't exist, OpenRouter returns an error, which surfaces as "CodeMedic couldn't complete the diagnosis" in the UI and a detailed OpenRouter error message in the server console. Double-check the exact slug at <https://openrouter.ai/models>.

**Dependency installation errors (peer dependency conflicts, etc.).**
Try a clean install:

```bash
rm -rf node_modules package-lock.json
npm install
```

If a specific package still reports a peer dependency conflict, `npm install --legacy-peer-deps` is a reasonable fallback for this project's small dependency tree.

**Port 3000 already in use.**
Either stop whatever else is using port 3000, or run on a different port:

```bash
npm run dev -- -p 3001
```

**Build fails with a TypeScript error.**
Run `npm run build` locally and read the reported file/line — it points at the exact type mismatch. Since this project has no `any` escape hatches by convention, these are usually genuine (and worth fixing) rather than configuration noise.

## 8. Production Build

Always verify a real production build before considering a change finished:

```bash
npm run build
npm run start
```

`next build` type-checks the entire project and produces an optimized bundle in `.next/`; `next start` serves exactly that build, so this is the closest local approximation to what a deployment platform will run. Open <http://localhost:3000> and re-run through the manual test checklist in `README.md` §20 against the production build, not just the dev server.

## 9. Dependency Philosophy

This project intentionally uses a small dependency set, on purpose, because it's a portfolio piece meant to be read end-to-end, not a production SaaS. Every entry in the tables above earns its place by doing something that would otherwise take meaningfully more hand-written code (schema validation, syntax highlighting, icons, styling) or by closing a real gap (like `server-only` guarding the API key). There's no state management library (React's `useState` is enough for one page), no data-fetching library (one `fetch` call doesn't need one), no component framework beyond a handful of hand-built primitives, and no ORM/database client (there's no database — see README §23). If you find yourself wanting to add a dependency to this project, ask first whether the thing it does is already small enough to write directly — for a project this size, it usually is.
