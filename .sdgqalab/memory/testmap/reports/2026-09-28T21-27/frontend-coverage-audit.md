---
schema: sdgqalab/testmap@3
layer: "frontend"
project: "SDG AI Lab Website"
audited_at: "2026-09-28T21:27:00Z"
config_version: 3

coverage:
  total_source_files: 95
  unit:
    test_files: 21
    file_coverage_pct: 82.1
    file_coverage_rating: "Solid"
  integration:
    test_files: 56
    file_coverage_pct: 93.7
    file_coverage_rating: "Exemplary"
  e2e:
    journeys_identified: 25
    journeys_covered: 25
    gaps: 0
  security:
    areas_identified: 11
    areas_covered: 11
    gaps: 0
  accessibility:
    components_identified: 22
    components_covered: 22
    gaps: 0
  line_coverage_pct: 91.43
  line_coverage_rating: "Exemplary"
  test_count: 400

by_scope:
  "components":
    source_files: 8
    unit_test_files: 2
    unit_file_coverage_pct: 87.5
    integration_test_files: 4
    integration_file_coverage_pct: 100.0
  "islands":
    source_files: 53
    unit_test_files: 5
    unit_file_coverage_pct: 69.8
    integration_test_files: 42
    integration_file_coverage_pct: 100.0
  "lib":
    source_files: 12
    unit_test_files: 12
    unit_file_coverage_pct: 100.0
    integration_test_files: 1
    integration_file_coverage_pct: 66.7
  "pages":
    source_files: 22
    unit_test_files: 2
    unit_file_coverage_pct: 100.0
    integration_test_files: 9
    integration_file_coverage_pct: 90.9

delta:
  previous_audit: "2026-09-28T20:59"
  unit_file_coverage_change: 5.3
  integration_file_coverage_change: 4.2
  line_coverage_change: 1.14
  e2e_gaps_change: 0
  security_gaps_change: 0
  accessibility_gaps_change: 0
---

# Frontend Test Audit

> **Unit File Coverage**: 82.1% (78/95 files) · Solid
> **Integration File Coverage**: 93.7% (89/95 files) · Exemplary
> **Line Coverage**: 91.43% · Exemplary
> **Tests**: 400 Vitest + 25 Playwright E2E journeys
> **Audited**: 2026-09-28T21:27 UTC

---

## Audit Status

Post-P3 refresh after Marina unit suite, FeaturedProjects axe, secondary page E2E smokes, ContactForm security/a11y, evolution-timeline Form/List suites, and `012_drop_geographic_reach.sql`.

Ambiguous colocated UI `*.test.tsx` remain classified as **integration** (skill rule). Unit file coverage rose to **Solid** after `marina-public-islands.unit.test.tsx`. Integration and line coverage are **Exemplary**. Critical journey, security, and curated interactive a11y gap counts are **0**.

---

## Unit Tests

Tests that verify modules in isolation — no I/O, no external services.
Targets: models, serializers, validators, utilities, hooks, guards, formatters.

### Unit Coverage by Scope

| Scope | Source Files | Unit Test Files | Unit File Coverage |
|-------|-------------:|----------------:|-------------------:|
| components | 8 | 2 | 87.5% |
| islands | 53 | 5 | 69.8% |
| lib | 12 | 12 | 100.0% |
| pages | 22 | 2 | 100.0% |
| **Total** | **95** | **21** | **82.1%** |

### Existing Unit Tests

| Scope | Test File | Approx. Tests | Modules Covered |
|-------|-----------|--------------:|-----------------|
| lib | `src/lib/*.test.ts` (excl. lib-integration) + `sampleContent.test.ts` | ~90 | queries, admin-queries, security, storage, auth, markdown, observability, sampleContent |
| islands | `marina-public-islands.unit.test.tsx` | ~5 | PortfolioGrid, ResearchOutputs, EvolutionTimeline, LatestActivity, HeroProjectSpotlight |
| islands | `admin-pages.unit.test.tsx` | ~17 | Admin Form/List shells including publications + evolution-timeline |
| islands | `admin-shell.unit.test.tsx` / `public-islands.unit.test.tsx` / `detail-islands.unit.test.tsx` | ~22 | Shell + public/detail smoke |
| pages | `tests/unit/astro-*.unit.test.ts` / `page-endpoints.unit.test.ts` | ~35 | Astro page/component contracts + robots/sitemap handlers |

### Unit Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/components/ui/StatusBadge.astro` | components | Source-contract unit assertion (integration-only today) |

> Shared admin/layout/component files with colocated `*.test.tsx` are integration-classified under ambiguous→integration, so they are not listed as hard unit gaps.

---

## Integration Tests

Tests that verify components working together across boundaries —
API endpoints, database operations, service contracts, workflows.

### Integration Coverage by Scope

| Scope | Source Files | Integration Test Files | Integration File Coverage |
|-------|-------------:|----------------------:|--------------------------:|
| components | 8 | 4 | 100.0% |
| islands | 53 | 42 | 100.0% |
| lib | 12 | 1 | 66.7% |
| pages | 22 | 9 | 90.9% |
| **Total** | **95** | **56** | **93.7%** |

### Existing Integration Tests

| Scope | Test File | Approx. Tests | Boundaries Covered |
|-------|-----------|--------------:|--------------------|
| islands | Form/List/shared/layout/auth suites + AdminApp | ~160 | Admin CRUD, shared controls, auth composition |
| islands | `marina-public-islands.test.tsx` / `public-islands.test.tsx` / `detail-islands.test.tsx` | ~29 | Public/detail islands + PublicationsList search + axe |
| lib | `lib-integration.test.ts` | ~6 | Cross-module lib contracts |
| pages / components | `tests/pages/*` + `tests/integration/astro-components.integration.test.ts` | ~47 | Astro composition contracts |

### Integration Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/lib/storage.ts` / `supabase.ts` / `supabase-auth.ts` | lib | Real import boundaries (currently unit-covered; UI suites mock storage) |
| `src/pages/robots.txt.ts` / `sitemap.xml.ts` | pages | Response integration beyond unit endpoint contracts |
| `src/data/sampleContent.ts` | lib | Optional cross-module fixture integration (unit + detail islands already exercise samples) |

---

## End-to-End (E2E) Tests

Tests that verify complete user journeys through the real application.
Tools: Playwright (`npm run test:e2e`).

> **25** of **25** critical journeys covered · **0** gaps

### Existing E2E Tests

| Test File / Suite | User Journey Covered |
|-------------------|---------------------|
| `e2e/public-and-admin.spec.ts` | Homepage load, Solutions navigation, admin protected shell |
| `e2e/cms-pages.spec.ts` | About, volunteer, team Marina/CMS hydration |
| `e2e/admin-editor-journeys.spec.ts` | Magic-link login, unauthorized user, project/news publish, media upload, archive/delete |
| `e2e/marina-nav-journeys.spec.ts` | Contact form; Services / Research / Expertise primary-nav journeys |
| `e2e/marina-secondary-journeys.spec.ts` | Programmes; publications/resources; admin publications create/publish |
| `e2e/marina-page-smokes.spec.ts` | Capacity-building; how-we-work; project/news detail sample hydration |
| `e2e/accessibility.spec.ts` | Homepage and admin login axe scans |

### E2E Tests Needed

| User Journey | Priority | What to Cover |
|-------------|----------|---------------|
| — | — | No critical journey gaps remaining from this audit cycle. |

---

## Security Tests

Tests that verify authentication, authorization, input validation,
and protection against common vulnerabilities (OWASP Top 10).

> **11** of **11** security-sensitive areas covered · **0** gaps

### Existing Security Tests

| Scope | Test File | What's Tested |
|-------|-----------|---------------|
| lib | `admin-security.test.ts` | Rate limits, allowlist, protected actions |
| lib | `auth-callback.test.ts` / `magic-link-errors.test.ts` | Callback exchange + OTP error mapping |
| lib | `admin-queries.test.ts` / `storage.test.ts` | Input validation + upload constraints |
| islands | `LoginPage` / `AuthProvider` / `AuthCallback` | Auth UX and session authorization |
| islands | `ContactForm.test.tsx` | Honeypot, maxLength, plain-text error rendering |
| islands | `VideoUpload.test.tsx` | Upload error / oversized feedback path |
| pages | `admin-page` / layout CSP contracts | Admin CSP and noindex shell |

### Security Tests Needed

| Area | Scope | What to Test |
|------|-------|--------------|
| — | — | No remaining security gaps from this audit cycle. |

---

## Accessibility Tests

Tests that verify the application is usable by people with disabilities.
Tools: jest-axe (`src/test/axe.ts`), Playwright `@axe-core/playwright`.

> **22** of **22** interactive components covered · **0** gaps

### Existing Accessibility Tests

| Scope | Test File | What's Tested |
|-------|-----------|---------------|
| islands | shared/admin controls + LoginPage + PeopleListPage | jest-axe / smoke |
| islands | `public-islands.test.tsx` | StatsCards + FeaturedProjects axe |
| islands | `marina-public-islands.test.tsx` | PortfolioGrid + ResearchOutputs / LatestActivity / EvolutionTimeline / HeroProjectSpotlight axe |
| islands | `ContactForm.test.tsx` / `ProjectShowcase.test.tsx` / detail islands | Form/card/detail axe |
| e2e | `e2e/accessibility.spec.ts` | Homepage + admin login Playwright axe |

### Accessibility Tests Needed

| Component / Page | Scope | What to Test |
|-----------------|-------|--------------|
| — | — | No curated interactive a11y gaps remaining. Optional depth: axe on remaining list/form pages (NewsList, PublicationsList, PartnerLogos, etc.). |

---

## Test Health Observations

| Test File | Observation | Impact |
|-----------|-------------|--------|
| `marina-public-islands.unit.test.tsx` | Thin unit coverage paired with existing integration suite | Closes prior Marina unit file gap |
| `evolution-timeline/*Form|List*.test.tsx` | Dedicated CRUD suites now mirror publications | Previously shell-only via `admin-pages.unit` |
| Ambiguous colocated UI tests | Classified as integration per skill rule | Unit % stays Solid rather than Exemplary despite broad colocated coverage |
| `lib/storage.ts` / `supabase*.ts` | Unit-strong; UI suites mock rather than import | Integration file coverage residual only |
| `AdminApp.integration.test.tsx` | Dashboard mocks synced after geographic-reach removal | Watch `CARD_CONFIG` drift |

---

## Recommendations

1. **[P3]** Optional: add real-import integration tests for `storage` / `supabase` / `supabase-auth` (currently mocked at UI boundary).
2. **[P3]** Optional: broaden axe to remaining public list islands and admin Form/List pages beyond the curated 22.
3. Apply `migrations/012_drop_geographic_reach.sql` in each Supabase environment that still has the table.
4. Commit the coverage + geographic-reach cleanup batch when ready.

## Acceptance Criteria

- [x] Every new Marina public island has unit and integration coverage
- [x] Publications and evolution-timeline admin pages have Form/List tests
- [x] Critical Marina nav + secondary page journeys have E2E coverage
- [x] Contact form has security + accessibility assertions
- [x] Curated interactive islands have jest-axe smoke checks
- [x] Geographic-reach app wiring removed; drop migration added (008 retained historically)
- [x] Coverage tooling runs from `.sdgqalab/config.yml`
- [x] All tests pass: `npm run test` and `npm run test:coverage`
