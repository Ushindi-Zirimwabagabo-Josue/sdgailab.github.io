# Project Context Brief

Generated for `sdgqalab-audit` on 2026-09-29T01:24 UTC. Evidence-based; paths relative to repo root.

## 1. Product purpose and primary workflows

**Purpose.** Official SDG AI Lab (UNDP) public website: institutional marketing + CMS-driven portfolio/news/team content. Static Astro shell with client-hydrated React islands; editors update Supabase without redeploy. Evidence: `README.md`, `astro.config.mjs` (`output: 'static'`).

**Public (Marina redesign).** Visitors browse Marina-styled pages (`src/components/layout/Header.astro`, `BaseLayout.astro`). Primary nav: About, Expertise, Services, Solutions (`/projects`), Research, Contact. Islands load published CMS data via `src/lib/queries.ts` (TTL cache + list pagination/caps in `src/lib/pagination.ts`).

**Admin CMS.** `/admin` → `AdminApp.tsx`; magic-link auth; hash routes for statistics, projects, news, publications, people, partners, evolution-timeline, page-content. Admin lists use server pagination (page size 50).

**Removed.** GeographicReach unwired from app; optional drop `supabase/migrations/012_drop_geographic_reach.sql`.

## 2. External interfaces

- Astro routes under `src/pages/` (public + `/admin`, sitemap/robots)
- Contact: `ContactForm.tsx` → `supabase/functions/contact-submit` (CORS allowlist + `CONTACT_ALLOWED_ORIGINS`)
- Deploy: `.github/workflows/deploy.yml` → GitHub Pages; uptime: `uptime-healthcheck.yml`
- Optional Docker preview: `Dockerfile` (not production path) — `docs/deployment-runtime.md`

## 3. Data contracts

- Types: `src/lib/types.ts`
- Validators: `src/lib/admin-queries.ts`
- Migrations: `supabase/migrations/001`–`012`
- Markdown HTML: escape + **DOMPurify** (`src/lib/markdown.ts`, `dompurify`)
- PII: `docs/contact-form/pii-retention.md`, `supabase/contact_submissions_purge.sql`

## 4. AI/ML behavior

**N/A** — no runtime AI/ML in `package.json` / `src/`. Safety domain skipped.

## 5. Runtime architecture

| Concern | Evidence |
|---------|----------|
| Hosting | GitHub Pages static |
| Auth | Supabase magic link + `admin_users` RLS |
| Observability | `@sentry/react`, `observability.ts`, `PUBLIC_LOG_LEVEL` |
| Quality gates | ESLint (`eslint.config.js`, CI lint), Vitest, Playwright, gitleaks, npm audit, Dependabot |
| Ownership | `.github/CODEOWNERS`, `docs/branch-protection.md` (GitHub settings still operator-applied) |

## 6. Existing quality signals

- Tests: Vitest + Playwright (Marina e2e + admin)
- Docs: README, CONTRIBUTING, CHANGELOG, SDD/ADRs, Supabase runbooks, cutover checklist
- Prior audit: `2026-09-28T21-36` (64.6% Adequate, CONDITIONALLY READY) — remediations landed after that snapshot

## Config conflicts

- `.sdgqalab/tech-stack.md` may still be stale on tests/Sentry; prefer live `package.json` + workflows.
- `.sdgqalab/config.yml` single `frontend` layer remains accurate.

## Audit adaptation

- Static CMS + Supabase BaaS (not custom API backend / not AI product)
- Re-evaluate SEC-009, SEC-006, SEC-028, MNT-001/009, PER-003/004, FLX-001, DQ-013, REL-022, OBS-002, DOC-004/005 against remediations
