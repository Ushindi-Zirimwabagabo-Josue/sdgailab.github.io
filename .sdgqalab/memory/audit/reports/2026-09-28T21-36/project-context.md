# Project Context Brief

Generated for `sdgqalab-audit` on 2026-09-28. Evidence-based; paths relative to repo root.

## 1. Product purpose and primary workflows

**Purpose.** Official SDG AI Lab (UNDP) public website: institutional marketing + CMS-driven portfolio/news/team content. Static Astro shell with client-hydrated React islands; editors update Supabase without redeploy. Evidence: `README.md`, `astro.config.mjs` (`output: 'static'`).

**Public (Marina redesign — current).** Visitors browse Marina-styled pages (`marina-header` / `marina-*` classes in `src/components/layout/Header.astro`, `BaseLayout.astro`). Primary nav: About, Expertise (`/focus-areas`), Services, Solutions (`/projects`), Research, Contact. Secondary/content pages include programmes, capacity-building, tech4r, team, resources, volunteer, how-we-work, news, launch-readiness. Islands load published CMS data at runtime via `src/lib/queries.ts`. Contact submits enquiries (see §2). Design adaptation notes: `docs/leading-examples-adaptation.md`.

**Admin CMS.** Editors open `/admin` (`src/pages/admin.astro` → `src/islands/admin/AdminApp.tsx`), sign in with Supabase magic link (`src/islands/admin/auth/LoginPage.tsx`, `AuthCallback.tsx`, `src/lib/auth-callback.ts`), and manage content under hash routes (see §2). Media via Supabase Storage (`src/lib/storage.ts`). Allowlisted editors only (`admin_users` + RLS; `supabase/migrations/003_secure_editor_access.sql`, `005_admin_users_management_model.sql`).

**Removed.** `GeographicReach` is gone from app code (`src/` has no `geographic_reach` references). Table drop: `supabase/migrations/012_drop_geographic_reach.sql` (historical create: `008_geographic_reach.sql`).

## 2. External interfaces

### Astro pages / routes (`src/pages/`)

| Route | File |
|-------|------|
| `/` | `src/pages/index.astro` |
| `/about`, `/focus-areas`, `/services`, `/research`, `/contact` | matching `*.astro` |
| `/projects`, `/projects/detail` | `src/pages/projects/index.astro`, `detail.astro` |
| `/news`, `/news/detail` | `src/pages/news/index.astro`, `detail.astro` |
| `/programmes`, `/capacity-building`, `/tech4r`, `/team`, `/resources`, `/volunteer`, `/how-we-work`, `/about`, `/launch-readiness`, `/404` | matching `*.astro` |
| `/admin` | `src/pages/admin.astro` |
| `/robots.txt`, `/sitemap.xml` | `src/pages/robots.txt.ts`, `sitemap.xml.ts` |

### Admin hash routes (`src/islands/admin/AdminApp.tsx` + `layout/Sidebar.tsx`)

`#/`, `#/statistics` (+ `/new`, `/edit`), `#/projects`, `#/news`, `#/publications`, `#/people`, `#/partners`, `#/evolution-timeline`, `#/page-content` (each with list / new / edit). No geographic-reach route.

### Contact submit edge function

- Client: `src/islands/ContactForm.tsx` → `POST ${PUBLIC_SUPABASE_URL}/functions/v1/contact-submit`
- Function: `supabase/functions/contact-submit/index.ts`
- Table: `supabase/migrations/009_contact_submissions.sql`
- Ops docs: `docs/contact-form/gmail-notifications.md`

### Deploy / hosting

- GitHub Pages via `.github/workflows/deploy.yml` (push to `new-version`; Node 20; `GITHUB_PAGES_BASE=/sdgailab.github.io/`)
- Canonical site: `https://sdgailab.org` (`astro.config.mjs`, `public/CNAME`)
- Staging URL pattern: `https://sdg-ai-lab.github.io/sdgailab.github.io/` (`README.md`, uptime workflow)
- Uptime: `.github/workflows/uptime-healthcheck.yml` (site + Supabase REST)

## 3. Data contracts

**TypeScript models.** `src/lib/types.ts`: `Statistic`, `Project`, `NewsArticle`, `Publication`, `Person`, `Partner`, `EvolutionTimelineItem`, `PageContent` (+ publish/status enums). No `GeographicReach` type.

**SQL migrations.** `supabase/migrations/001`–`012` (schema, storage RLS, editor access, portfolio fields, admin_users, contact_submissions, evolution_timeline, publications, geographic_reach create then **012 drop**).

**Write validation.** Hand-rolled validators in `src/lib/admin-queries.ts` (`validateStatisticInput`, `validateProjectInput`, `validateNewsArticleInput`, `validatePublicationInput`, `validatePersonInput`, `validatePartnerInput`, `validateEvolutionTimelineInput`, `validatePageContentInput`) before Supabase inserts/updates. Public reads: `src/lib/queries.ts` (tables listed above only).

**ContactForm payload** (`ContactForm.tsx` → edge function):

```json
{
  "name": "string",
  "email": "string",
  "organization": "string",
  "request_type": "string",
  "message": "string",
  "website": "string (honeypot)",
  "source_path": "string"
}
```

Server validates required fields, email format, message ≤5000 chars; honeypot `website` short-circuits success (`supabase/functions/contact-submit/index.ts`).

**No custom app REST API.** Browser uses Supabase JS with anon key + RLS (`src/lib/supabase.ts`, `supabase-auth.ts`).

## 4. AI/ML behavior

**N/A — no runtime AI/ML.** No OpenAI/Anthropic/LangChain (or similar) dependencies in `package.json`; no inference, RAG, agents, or chat UI in `src/`. “AI” appears only in product naming (SDG AI Lab) and marketing copy. Do not audit as a chatbot or LLM product.

Config note: `.sdgqalab/tech-stack.md` already records “None detected” under AI/ML (2026-07-14).

## 5. Runtime architecture

| Concern | Evidence |
|---------|----------|
| Static hosting | Astro `output: 'static'` → GitHub Pages artifact `dist/` |
| Auth | Supabase Auth magic link; PKCE/hash callback (`auth-callback.ts`) |
| DB | Supabase Postgres + RLS |
| Storage | Supabase `public-assets` bucket (`002_storage_policies.sql`, `storage.ts`) |
| Edge | `contact-submit` Deno function (service role for insert; optional email webhook) |
| Public env | `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY` (`.env.example`) |
| Observability env | `PUBLIC_SENTRY_DSN`, `PUBLIC_SENTRY_ENVIRONMENT`; optional `PUBLIC_GA_MEASUREMENT_ID` |
| Sentry | **Present:** `@sentry/react` in `package.json`; init/scrub in `src/lib/observability.ts`; CSP allows `*.sentry.io` in `BaseLayout.astro` / `admin.astro`; deploy passes DSN secrets |
| Contact secrets (edge only) | `CONTACT_EMAIL_WEBHOOK_URL`, `CONTACT_EMAIL_WEBHOOK_SECRET`, `CONTACT_NOTIFICATION_TO` |

## 6. Existing quality signals

**Tests.** Vitest (`npm run test` / `test:coverage`); Playwright (`npm run test:e2e`). E2E under `e2e/` including Marina journeys (`marina-nav-journeys.spec.ts`, `marina-secondary-journeys.spec.ts`, `marina-page-smokes.spec.ts`), admin/CMS, accessibility (`@axe-core/playwright`, `src/test/axe.ts`).

**Latest testmap** (`.sdgqalab/memory/testmap/frontend-coverage-audit.md`, `metrics.yml` snapshot `2026-09-28T21:27`):

| Metric | Value | Rating |
|--------|-------|--------|
| Unit file coverage | 82.1% (78/95) | Solid |
| Integration file coverage | 93.7% (89/95) | Exemplary |
| Line coverage | 91.43% | Exemplary |
| Tests | 400 Vitest | — |
| E2E journeys | 25/25 covered | 0 gaps |
| Security areas | 11/11 | 0 gaps |
| Accessibility | 22/22 | 0 gaps |

**CI.** `.github/workflows/test.yml`: Astro/TS check, `npm audit --audit-level=critical`, gitleaks, Vitest + coverage, Playwright. Deploy + uptime workflows as above.

**Docs / runbooks.** `docs/editor-guide.md`, `production-cutover-checklist.md`, `supabase-hardening-*.md`, `supabase-backup-restore.md`, `contact-form/gmail-notifications.md`, `docs/sdd/*`, specs under `specs/001-dynamic-cms-revamp/`, `specs/002-admin-ui/`.

**Prior audit.** `.sdgqalab/memory/audit/` (last full context dated 2026-07-22) is **stale** on Sentry (now implemented), content-type count, GeographicReach, and Marina surface — prefer this brief.

## Config / evidence conflicts

1. **`.sdgqalab/tech-stack.md` is outdated:** claims “Automated Tests: None detected” and no Sentry; repo has Vitest, Playwright, and `@sentry/react` / `observability.ts`. Prefer live `package.json` + workflows for audit triggers.
2. **`.sdgqalab/config.yml`** still accurate for single `frontend` layer (`src/`, Astro/React/TS/Tailwind/Supabase, GitHub Pages). No AI layer to add.
3. Seed file `supabase/geographic_reach_seed.sql` may remain for history; app and types no longer use it after migration 012.

## Audit adaptation notes

- Treat as **static CMS website + Supabase BaaS**, not a custom API backend or AI service.
- Contact path is a **structured form → edge function**, not free-form chat.
- Marina is the **current public UX**; admin remains hash-routed CMS.
- Do not re-check GeographicReach as a live feature; verify removal / migration hygiene only if in scope.
