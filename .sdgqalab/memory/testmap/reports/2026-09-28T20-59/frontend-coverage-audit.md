---
schema: sdgqalab/testmap@3
layer: "frontend"
project: "SDG AI Lab Website"
audited_at: "2026-09-28T20:59:00Z"
config_version: 3

coverage:
  total_source_files: 95
  unit:
    test_files: 20
    file_coverage_pct: 76.8
    file_coverage_rating: "Solid"
  integration:
    test_files: 54
    file_coverage_pct: 89.5
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
  line_coverage_pct: 90.29
  line_coverage_rating: "Exemplary"
  test_count: 383

by_scope:
  "components":
    source_files: 8
    unit_test_files: 2
    unit_file_coverage_pct: 87.5
    integration_test_files: 4
    integration_file_coverage_pct: 100.0
  "islands":
    source_files: 53
    unit_test_files: 4
    unit_file_coverage_pct: 60.4
    integration_test_files: 40
    integration_file_coverage_pct: 94.3
  "lib":
    source_files: 12
    unit_test_files: 12
    unit_file_coverage_pct: 100.0
    integration_test_files: 1
    integration_file_coverage_pct: 58.3
  "pages":
    source_files: 22
    unit_test_files: 2
    unit_file_coverage_pct: 100.0
    integration_test_files: 9
    integration_file_coverage_pct: 90.9

delta:
  previous_audit: "2026-09-28T18:43"
  unit_file_coverage_change: -3.8
  integration_file_coverage_change: 19.1
  line_coverage_change: 19.14
  e2e_gaps_change: -8
  security_gaps_change: -1
  accessibility_gaps_change: -6
---

# Frontend Test Audit

> **Unit File Coverage**: 76.8% (73/95 files) · Solid
> **Integration File Coverage**: 89.5% (85/95 files) · Exemplary
> **Line Coverage**: 90.29% · Exemplary
> **Tests**: 383 Vitest + 21 Playwright E2E journeys
> **Audited**: 2026-09-28T20:59 UTC

---

## Audit Status

P1/P2 Marina coverage work landed, and unused **Geographic Reach** was removed from the app (public island, admin CMS, queries/types, `d3-geo` / topojson deps). Source tree is **98 → 95** files (`types.ts` excluded; `src/data/sampleContent.ts` counted under lib for continuity).

Line coverage recovered from **71.15% → 90.29% (Exemplary)**. Integration file coverage rose to **Exemplary** after Marina island + publications suites. Unit file coverage is **Solid** under the skill rule that classifies ambiguous colocated UI tests as **integration** (stricter than the prior audit’s treatment of shared `*.test.tsx` as unit).

Critical Marina nav + secondary journeys now have Playwright coverage; geographic-reach E2E is no longer applicable.

---

## Unit Tests

Tests that verify modules in isolation — no I/O, no external services.
Targets: models, serializers, validators, utilities, hooks, guards, formatters.

### Unit Coverage by Scope

| Scope | Source Files | Unit Test Files | Unit File Coverage |
|-------|-------------:|----------------:|-------------------:|
| components | 8 | 2 | 87.5% |
| islands | 53 | 4 | 60.4% |
| lib | 12 | 12 | 100.0% |
| pages | 22 | 2 | 100.0% |
| **Total** | **95** | **20** | **76.8%** |

### Existing Unit Tests

| Scope | Test File | Approx. Tests | Modules Covered |
|-------|-----------|--------------:|-----------------|
| lib | `src/lib/*.test.ts` (11 unit files) + `sampleContent.test.ts` | ~86 | url, markdown, auth-callback, magic-link-errors, admin-security, observability, storage, supabase, queries, admin-queries, sampleContent |
| islands | `admin-pages.unit.test.tsx` | ~17 | Dashboard + admin Form/List shells including publications + evolution-timeline |
| islands | `admin-shell.unit.test.tsx` | ~5 | Admin shell wiring |
| islands | `public-islands.unit.test.tsx` | ~15 | PublicationsList + selected public islands |
| islands | `detail-islands.unit.test.tsx` | ~2 | Detail island smoke |
| pages | `tests/unit/astro-pages.unit.test.ts` | ~20 | Marina Astro page source contracts |
| pages | `tests/unit/astro-components.unit.test.ts` | ~11 | Header/Footer/BaseLayout/UI Astro components |
| pages | `tests/unit/page-endpoints.unit.test.ts` | ~4 | robots.txt / sitemap.xml handlers |

### Unit Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/components/ui/StatusBadge.astro` | components | Source-contract unit assertion (integration-only today) |

> Marina public islands now have `marina-public-islands.unit.test.tsx`. Many admin shared/layout/component files already have colocated `*.test.tsx` counted as **integration** under ambiguous→integration.

---

## Integration Tests

Tests that verify components working together across boundaries —
API endpoints, database operations, service contracts, workflows.

### Integration Coverage by Scope

| Scope | Source Files | Integration Test Files | Integration File Coverage |
|-------|-------------:|----------------------:|--------------------------:|
| components | 8 | 4 | 100.0% |
| islands | 53 | 40 | 94.3% |
| lib | 12 | 1 | 58.3% |
| pages | 22 | 9 | 90.9% |
| **Total** | **95** | **54** | **89.5%** |

### Existing Integration Tests

| Scope | Test File | Approx. Tests | Boundaries Covered |
|-------|-----------|--------------:|--------------------|
| islands | `AdminApp.integration.test.tsx` / `AdminApp.test.tsx` | ~10 | Lazy routes + auth gate |
| islands | `AuthStack` / `AuthCallback` integration | ~3 | Auth provider + callback composition |
| islands | `AdminShell` / `AdminFormShell` integration | ~3 | Layout navigation + form shell |
| islands | colocated Form/List/shared/layout `*.test.tsx` (incl. publications, ContactForm, VideoUpload) | ~120 | Admin CRUD UI, shared controls, Marina public islands |
| islands | `marina-public-islands.test.tsx` | ~9 | Marina islands + query mocks + axe |
| islands | `public-islands.test.tsx` / `detail-islands.test.tsx` | ~18 | Public/detail islands with mocked queries |
| islands | `IslandComponents.integration.test.tsx` | ~1 | ProjectCard/StatusBadge composition |
| lib | `src/lib/lib-integration.test.ts` | ~6 | Cross-module lib contracts |
| pages | `tests/pages/*.test.ts` | ~37 | Astro page composition and Marina contracts |
| components | `tests/integration/astro-components.integration.test.ts` | ~10 | Layout/UI Astro composition |

### Integration Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/lib/storage.ts` / `supabase*.ts` / `observability.ts` | lib | Client/upload/observability boundaries (unit exists) |
| `src/pages/robots.txt.ts` / `sitemap.xml.ts` | pages | Response integration beyond unit source contracts |

---

## End-to-End (E2E) Tests

Tests that verify complete user journeys through the real application.
Tools: Playwright (`npm run test:e2e`).

> **25** of **25** critical journeys covered · **0** gaps

### Existing E2E Tests

| Test File / Suite | User Journey Covered |
|-------------------|---------------------|
| `e2e/public-and-admin.spec.ts` | Homepage load, Solutions navigation, admin protected shell |
| `e2e/cms-pages.spec.ts` | About, volunteer, and team Marina/CMS hydration |
| `e2e/admin-editor-journeys.spec.ts` | Magic-link login, unauthorized user, project publish, news publish, media upload, archive/delete |
| `e2e/marina-nav-journeys.spec.ts` | Contact form surface; Services / Research / Expertise primary-nav journeys |
| `e2e/marina-secondary-journeys.spec.ts` | Programmes cohorts; publications/resources hydration; admin publications create/publish |
| `e2e/marina-page-smokes.spec.ts` | Capacity-building; how-we-work; project/news detail sample hydration |
| `e2e/accessibility.spec.ts` | Homepage and admin login axe scans |

### E2E Tests Needed

| User Journey | Priority | What to Cover |
|-------------|----------|---------------|
| — | — | No journey gaps remaining from this audit cycle. |

> Geographic-reach admin CRUD was previously listed as P3 and is **obsolete** after app unwiring (DB migrations retained as legacy artifacts).

---

## Security Tests

Tests that verify authentication, authorization, input validation,
and protection against common vulnerabilities (OWASP Top 10).

> **11** of **11** security-sensitive areas covered · **0** gaps

### Existing Security Tests

| Scope | Test File | What's Tested |
|-------|-----------|---------------|
| lib | `src/lib/admin-security.test.ts` | Rate limits, allowlist, protected actions |
| lib | `src/lib/auth-callback.test.ts` | PKCE/hash callback exchange |
| lib | `src/lib/magic-link-errors.test.ts` | OTP error mapping |
| lib | `src/lib/admin-queries.test.ts` | Input validation guards |
| lib | `src/lib/storage.test.ts` | Upload path/type constraints |
| islands | `LoginPage.test.tsx` | Login flow and error display |
| islands | `AuthProvider.test.tsx` | Session authorization |
| islands | `AuthCallback.test.tsx` | Callback error handling |
| islands | `VideoUpload.test.tsx` | Upload error / oversized feedback path |
| islands | `ContactForm.test.tsx` | Honeypot, maxLength, plain-text error rendering |
| pages | `tests/pages/admin-astro.test.ts` | Admin CSP and noindex shell |

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
| islands | `LoginPage.test.tsx` | jest-axe on login form |
| islands | `ConfirmDialog.test.tsx` | jest-axe when open |
| islands | `Sidebar.test.tsx` / `Toast.test.tsx` | Navigation + notifications |
| islands | shared form controls (`ContentForm`, `ContentTable`, `StatusSelect`, `SlugField`, `MarkdownField`, `FormFeedback`, `ImageUpload`, `VideoUpload`) | jest-axe / smoke |
| islands | `PeopleListPage.test.tsx` | List page axe |
| islands | `detail-islands.test.tsx` | Detail views axe |
| islands | `public-islands.test.tsx` | `StatsCards` + `FeaturedProjects` axe |
| islands | `marina-public-islands.test.tsx` | PortfolioGrid + ResearchOutputs / LatestActivity / EvolutionTimeline / HeroProjectSpotlight axe |
| islands | `ProjectShowcase.test.tsx` | Card grid axe smoke |
| islands | `ContactForm.test.tsx` | Form labels + axe smoke |
| e2e | `e2e/accessibility.spec.ts` | Homepage + admin login Playwright axe |

### Accessibility Tests Needed

| Component / Page | Scope | What to Test |
|-----------------|-------|--------------|
| — | — | No accessibility gaps remaining from this audit cycle. |

---

## Test Health Observations

| Test File | Observation | Impact |
|-----------|-------------|--------|
| `src/islands/marina-public-islands.unit.test.tsx` | Thin unit coverage for Marina public islands | Closes prior unit-only gap for PortfolioGrid / ResearchOutputs / EvolutionTimeline / LatestActivity / HeroProjectSpotlight |
| `src/islands/admin/evolution-timeline/*` | Dedicated Form/List suites added | Create/update/archive/delete paths covered |
| `src/lib/admin-queries.ts` | 77.45% line coverage (was ~56%) | Improved; remaining gaps are less-used mutation branches |
| `src/islands/ContactForm.test.tsx` | Security + axe assertions added for honeypot, maxLength, and plain-text errors | P2 residual closed |
| Classification note | Ambiguous colocated UI `*.test.tsx` counted as **integration** (skill rule) | Unit % is lower than the prior audit’s looser unit bucket; integration % is correspondingly higher |
| `AdminApp.integration.test.tsx` | Dashboard mocks kept in sync after geographic-reach removal | Watch for future `CARD_CONFIG` drift |

---

## Recommendations

1. **[done]** P1/P2/P3 coverage gaps from the Marina redesign audit are closed.
2. Re-run `/sdgqalab-testmap` after merging to refresh numeric file-coverage ratings with the new suites.
3. Apply `migrations/012_drop_geographic_reach.sql` in each Supabase environment that still has the table.

## Acceptance Criteria

- [x] Every new Marina public island has unit and integration coverage
- [x] Publications admin pages have Form/List tests
- [x] Critical Marina nav journeys have E2E coverage
- [x] Contact form has security + accessibility assertions
- [x] Evolution-timeline admin pages have dedicated Form/List tests
- [x] New interactive Marina islands have jest-axe smoke checks
- [x] FeaturedProjects has jest-axe coverage
- [x] Project/news detail + capacity-building + how-we-work have E2E smoke
- [x] Geographic-reach app wiring removed; drop migration added (008 retained historically)
- [x] Coverage tooling runs from `.sdgqalab/config.yml`
- [x] All tests pass: `npm run test` and `npm run test:coverage`
