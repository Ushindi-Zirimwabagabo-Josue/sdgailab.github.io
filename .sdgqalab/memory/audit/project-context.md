# Project Context Brief

Generated for `sdgqalab-audit` on 2026-10-06T14:38 UTC. Evidence-based; paths relative to repo root.

## 1. Product purpose and primary workflows

**Purpose.** Official SDG AI Lab (UNDP) public website: institutional marketing + CMS-driven portfolio/news/team content. Static Astro shell with client-hydrated React islands; editors update Supabase without redeploy. Evidence: `README.md`, `astro.config.mjs` (`output: 'static'`).

**Public (Marina redesign).** Marina pages + `TeamRoster` on `/team` and About. Islands load published CMS data via `src/lib/queries.ts`.

**Admin CMS.** `/admin` → magic-link auth; hash routes for all content types.

## 2. External interfaces

- Astro routes `src/pages/`; contact edge `supabase/functions/contact-submit`
- Deploy: `.github/workflows/deploy.yml` (staging base path); CI: `test.yml` (check, lint, audit, gitleaks CLI, Vitest, Playwright)

## 3. Data contracts

- Types/validators: `src/lib/types.ts`, `src/lib/admin-queries.ts`
- Migrations `001`–`005`; C1 verification `supabase/verify_c1_hardening.sql`
- **C1 signed off:** `docs/supabase-c1-staging-signoff.md` (2026-10-06, Josue Ushindi)

## 4. AI/ML behavior

**N/A**

## 5. Runtime architecture

| Concern | Evidence |
|---------|----------|
| Hosting | GitHub Pages staging → C2 `sdgailab.org` pending |
| Auth | Supabase magic link + `admin_users` RLS |
| Observability | Optional Sentry; uptime Action |
| Quality | `npm run check` **0 errors**; 412 Vitest tests |

## 6. Existing quality signals

- Testmap: ~89% line coverage; E2E/security/a11y gaps 0
- Supabase C1 **COMPLETE** on staging (operator sign-off recorded)
- Prior audit snapshot: `2026-10-06T13:18` — 73.1% Solid, CONDITIONALLY READY

## Audit adaptation

- Static CMS + Supabase BaaS; REL-013 remains **PARTIAL** per rubric (free-tier manual backups, no drill) despite C1 sign-off.
