# Project Context Brief

Generated for `sdgqalab-audit` on 2026-10-06T13:18 UTC. Evidence-based; paths relative to repo root.

## 1. Product purpose and primary workflows

**Purpose.** Official SDG AI Lab (UNDP) public website: institutional marketing + CMS-driven portfolio/news/team content. Static Astro shell with client-hydrated React islands; editors update Supabase without redeploy. Evidence: `README.md`, `astro.config.mjs` (`output: 'static'`).

**Public (Marina redesign).** Visitors browse Marina-styled pages (`src/components/layout/Header.astro`, `BaseLayout.astro`). Team roster via `src/islands/TeamRoster.tsx` on `/team` and compact layout on About. Islands load published CMS data via `src/lib/queries.ts` (TTL cache + pagination).

**Admin CMS.** `/admin` → `AdminApp.tsx`; magic-link auth; hash routes for statistics, projects, news, publications, people, partners, evolution-timeline, page-content.

## 2. External interfaces

- Astro routes under `src/pages/` (public + `/admin`, sitemap/robots)
- Contact: `ContactForm.tsx` → `supabase/functions/contact-submit` (CORS allowlist)
- Deploy: `.github/workflows/deploy.yml` → GitHub Pages (staging base path); uptime: `uptime-healthcheck.yml`
- CI: `.github/workflows/test.yml` — check, lint, audit, gitleaks CLI, Vitest, Playwright

## 3. Data contracts

- Types: `src/lib/types.ts`
- Validators: `src/lib/admin-queries.ts`
- Migrations: `supabase/migrations/001`–`005` (+ historical `006`–`012` as applicable in repo)
- RLS allowlist: `003_secure_editor_access.sql`, `005_admin_users_management_model.sql`
- Ops verification: `supabase/verify_c1_hardening.sql`, `docs/supabase-c1-staging-signoff.md`
- Markdown HTML: DOMPurify (`src/lib/markdown.ts`)
- PII: `docs/contact-form/pii-retention.md`, `supabase/contact_submissions_purge.sql`

## 4. AI/ML behavior

**N/A** — no runtime AI/ML in `package.json` / `src/`. Safety domain skipped.

## 5. Runtime architecture

| Concern | Evidence |
|---------|----------|
| Hosting | GitHub Pages static (staging); `sdgailab.org` cutover pending C2 |
| Auth | Supabase magic link + `admin_users` RLS |
| Observability | Optional Sentry (`observability.ts`); uptime Action; user skipped Sentry DSN |
| Quality gates | ESLint CI, Vitest (412 tests), Playwright, gitleaks 8.24.2 CLI, npm audit, Dependabot |

## 6. Existing quality signals

- Testmap: ~89% line coverage; E2E/security/a11y gap counts 0 (2026-10-06)
- Supabase C1 hardening docs + migration 005 applied in operator environment
- Prior audit baseline: `2026-09-29T01-24` — 73.1% Solid, CONDITIONALLY READY

## Config conflicts

- `.sdgqalab/config.yml` single `frontend` layer remains accurate.
- `npm run check` currently reports 4 TS errors in `ProjectDetail.tsx` (slug `string | null`) — CI quality job may fail until fixed.

## Audit adaptation

- Static CMS + Supabase BaaS; evaluate ops docs (C1/C2) for reliability and documentation domains.
- Do not treat as AI chatbot product.
