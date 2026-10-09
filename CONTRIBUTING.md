# Contributing

Thanks for helping improve the SDG AI Lab website. This guide covers day-to-day contribution workflow for this repo.

## Prerequisites

- Node.js **20+**
- npm
- A local `.env` based on [`.env.example`](.env.example) (Supabase URL + anon key at minimum)

See [README.md](README.md) for full setup, including Supabase migrations.

## Development workflow

1. Branch from `new-version` (deploy branch) or the agreed feature base — avoid committing directly to `main` / `master` unless you are doing a release merge.
2. Use a short descriptive branch name, for example:
   - `feat/contact-pii-retention`
   - `fix/admin-slug-validation`
   - `docs/contributing-guide`
3. Install and run locally:

   ```bash
   npm install
   npm run dev
   ```

4. Before opening a PR, run the same gates CI enforces (see below).

## Coding standards

| Area | Expectation |
|------|-------------|
| Language | TypeScript for `src/` application code |
| UI | Astro pages + React islands; Tailwind utility classes; follow existing Marina / admin patterns |
| Formatting | Prettier — `npm run format` |
| Lint | ESLint — `npm run lint` (`eslint.config.js`) |
| Types | `npm run check` (Astro + TypeScript) |
| Data access | Prefer `src/lib/queries.ts` / `admin-queries.ts` / `storage.ts` over ad-hoc Supabase calls in UI |

Do not commit secrets (`.env`, service-role keys, private DSNs). Public anon keys in local `.env` are fine and stay gitignored.

## Commits

Prefer concise, imperative messages. Conventional prefixes help changelog drafting:

- `feat:` new user-facing capability
- `fix:` bug fix
- `docs:` documentation only
- `test:` tests only
- `chore:` tooling, deps, CI

Example: `feat(cms): add publications list search`

## Pull requests

1. Open a PR against `new-version` (or the branch your team uses for staging deploy).
2. Describe **why** the change is needed and how to verify it.
3. Ensure CI is green. Required workflow: [`.github/workflows/test.yml`](.github/workflows/test.yml)

| CI job | What it runs |
|--------|----------------|
| Typecheck & audit | `npm run check`, `npm run lint`, `npm run audit:ci` |
| Secret scan | gitleaks |
| Vitest | `npm run test` + coverage |
| Playwright | `npm run test:e2e` |

4. Keep PRs focused. Large refactors should be split when practical.
5. Schema changes: add a numbered SQL file under `supabase/migrations/` and update `supabase/README.md` / docs when operators must apply it manually.

## Testing expectations

- **Unit / integration:** Vitest under `src/**/*.test.*` and `tests/` — add or update tests with behaviour changes.
- **E2E:** Playwright under `e2e/` for user journeys that CI already covers (admin, public Marina pages, a11y).
- Accessibility: prefer existing `src/test/axe.ts` helpers and Playwright axe specs for interactive UI.

```bash
npm run lint
npm run check
npm run test
npm run test:e2e   # optional locally; required in CI
```

## Docs to update when relevant

| Change type | Update |
|-------------|--------|
| Env vars | `.env.example`, `src/env.d.ts` |
| Deploy / runtime | `docs/deployment-runtime.md`, cutover checklist |
| Supabase / backups | `docs/supabase-*.md`, `supabase/README.md` |
| Contact PII | `docs/contact-form/pii-retention.md` |
| User-facing release notes | `CHANGELOG.md` |
| Branch protection / CODEOWNERS | `docs/branch-protection.md`, `.github/CODEOWNERS` |

## Questions

If something in setup or CI is unclear, open a draft PR with questions or ask a maintainer before large speculative changes.
