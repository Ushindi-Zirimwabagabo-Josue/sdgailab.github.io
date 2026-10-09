---
schema: sdgqalab/testmap@3
layer: "frontend"
project: "SDG AI Lab Website"
audited_at: "2026-07-22T14:33:00Z"
config_version: 3

coverage:
  total_source_files: 73
  unit:
    test_files: 32
    file_coverage_pct: 87.7
    file_coverage_rating: "Exemplary"
  integration:
    test_files: 32
    file_coverage_pct: 89.0
    file_coverage_rating: "Exemplary"
  e2e:
    journeys_identified: 14
    journeys_covered: 14
    gaps: 0
  security:
    areas_identified: 9
    areas_covered: 9
    gaps: 0
  accessibility:
    components_identified: 14
    components_covered: 8
    gaps: 6
  line_coverage_pct: 87.66
  line_coverage_rating: "Solid"
  test_count: 269

by_scope:
  "components":
    source_files: 8
    unit_test_files: 1
    unit_file_coverage_pct: 37.5
    integration_test_files: 4
    integration_file_coverage_pct: 100.0
  "islands":
    source_files: 39
    unit_test_files: 19
    unit_file_coverage_pct: 100.0
    integration_test_files: 23
    integration_file_coverage_pct: 97.4
  "lib":
    source_files: 10
    unit_test_files: 11
    unit_file_coverage_pct: 100.0
    integration_test_files: 1
    integration_file_coverage_pct: 70.0
  "pages":
    source_files: 16
    unit_test_files: 2
    unit_file_coverage_pct: 75.0
    integration_test_files: 8
    integration_file_coverage_pct: 75.0

delta:
  previous_audit: "2026-07-15T17:26"
  unit_file_coverage_change: -12.3
  integration_file_coverage_change: -11.0
  line_coverage_change: -0.56
  e2e_gaps_change: 0
  security_gaps_change: 0
  accessibility_gaps_change: 6
---

# Frontend Test Audit

> **Unit File Coverage**: 87.7% (64/73 files) · Exemplary
> **Integration File Coverage**: 89.0% (65/73 files) · Exemplary
> **Line Coverage**: 87.66% · Solid
> **Tests**: 269 Vitest + 14 Playwright E2E
> **Audited**: 2026-07-22T14:33 UTC

---

## Audit Status

Coverage remains strong after auth-callback and magic-link error-mapping work, but **six new source files** expanded the inventory and reopened **page-scope** and **accessibility** gaps.

- **65** Vitest files and **269** tests pass (`npm run test`).
- **14** Playwright E2E tests pass across 4 spec files (`npm run test:e2e`).
- Line coverage **87.66%** (Solid), down 0.56pp from the prior audit.
- New modules `auth-callback.ts` and `magic-link-errors.ts` are fully unit-tested.
- Four new pages/endpoints lack any mapped unit or integration test.

## Unit Tests

### Unit Coverage by Scope

| Scope | Source Files | Unit Test Files | Unit File Coverage |
|-------|-------------:|----------------:|-------------------:|
| components | 8 | 1 | 37.5% |
| islands | 39 | 19 | 100.0% |
| lib | 10 | 11 | 100.0% |
| pages | 16 | 2 | 75.0% |
| **Total** | **73** | **32** | **87.7%** |

### Existing Unit Tests

| Scope | Test File | Approx. Tests | Modules Covered |
|-------|-----------|---------------|-----------------|
| lib | `src/lib/*.test.ts` (11 files) | 55 | All `lib/` modules incl. `auth-callback`, `magic-link-errors` |
| pages | `tests/unit/astro-pages.unit.test.ts` | 12 | 12 Astro pages (source contracts) |
| components | `tests/unit/astro-components.unit.test.ts` | 4 | `BaseLayout.astro`, `Header.astro` |
| islands | `src/islands/**/*.unit.test.tsx` (3 files) | 15 | Public islands, detail islands, admin pages/shell |
| islands | `src/islands/admin/shared/*.test.tsx` (9 files) | 30 | Shared admin form primitives |
| islands | `src/islands/components/*.test.tsx` (2 files) | 4 | `ProjectCard`, `StatusBadge` |
| islands | `src/islands/admin/auth/*.test.tsx` (4 files) | 18 | Auth shell modules |
| data | `src/data/sampleContent.test.ts` | 6 | Sample fallback content helpers |

### Unit Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/pages/launch-readiness.astro` | pages | Source contract: layout, metadata, expected sections |
| `src/pages/resources.astro` | pages | Source contract: layout, island wiring |
| `src/pages/robots.txt.ts` | pages | Endpoint returns expected robots directives |
| `src/pages/sitemap.xml.ts` | pages | Endpoint emits sitemap entries for public routes |
| `src/components/layout/Footer.astro` | components | Dedicated unit contract (currently integration-only) |
| `src/components/sections/ParticlesHero.astro` | components | Dedicated unit contract (currently integration-only) |
| `src/components/ui/EmptyState.astro` | components | Dedicated unit contract (currently integration-only) |
| `src/components/ui/LoadingSpinner.astro` | components | Dedicated unit contract (currently integration-only) |
| `src/components/ui/SDGWheel.astro` | components | Dedicated unit contract (currently integration-only) |

---

## Integration Tests

### Integration Coverage by Scope

| Scope | Source Files | Integration Test Files | Integration File Coverage |
|-------|-------------:|----------------------:|--------------------------:|
| components | 8 | 4 | 100.0% |
| islands | 39 | 23 | 97.4% |
| lib | 10 | 1 | 70.0% |
| pages | 16 | 8 | 75.0% |
| **Total** | **73** | **32** | **89.0%** |

### Existing Integration Tests

| Scope | Test File | Approx. Tests | Boundaries Covered |
|-------|-----------|---------------|--------------------|
| components | `tests/integration/astro-components.integration.test.ts` | 11 | Astro layout/UI composition |
| components | `tests/pages/components.test.ts` | 6 | UI + section Astro components |
| lib | `src/lib/lib-integration.test.ts` | 3 | Cross-module auth and query boundaries |
| islands | `src/islands/admin/*.integration.test.tsx` (6 files) | 12 | Admin shell, lazy routes, auth callback |
| islands | `src/islands/public-islands.test.tsx` | 9 | Public list/content islands |
| islands | `src/islands/detail-islands.test.tsx` | 6 | Detail islands (+ axe) |
| islands | `src/islands/admin/**/*.test.tsx` (17 files) | 95+ | Admin CRUD workflows |
| pages | `tests/pages/public-pages.test.ts` | 10 | Public page island wiring |
| pages | `tests/pages/index-page.test.ts` | 3 | Homepage composition |
| pages | `tests/pages/admin-page.test.ts` | 2 | Admin CSP/noindex source |
| pages | `tests/pages/admin-astro.test.ts` | 1 | Admin island bootstrap |
| pages | `tests/pages/layout-*.test.ts` | 6 | Header/base layout source |

### Integration Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/pages/launch-readiness.astro` | pages | Page composes expected layout and content blocks |
| `src/pages/resources.astro` | pages | Page composes expected layout and links |
| `src/pages/robots.txt.ts` | pages | HTTP handler returns crawl rules |
| `src/pages/sitemap.xml.ts` | pages | HTTP handler lists public routes |
| `src/lib/auth-callback.ts` | lib | Cross-module flow with `AuthCallback` + `AuthProvider` |
| `src/lib/magic-link-errors.ts` | lib | Error mapping surfaced through `LoginPage` for all codes |
| `src/islands/admin/shared/ContentTable.tsx` | islands | Table actions in composed list-page workflows |

---

## End-to-End (E2E) Tests

> **14** of **14** critical journeys covered · **0** gaps

### Existing E2E Tests

| Test File / Suite | User Journey Covered |
|-------------------|---------------------|
| `e2e/public-and-admin.spec.ts` | Public homepage loads with navigation and hero |
| `e2e/public-and-admin.spec.ts` | Homepage → Projects navigation |
| `e2e/public-and-admin.spec.ts` | Admin route serves protected noindex shell with client island |
| `e2e/cms-pages.spec.ts` | About page hydrates CMS content sections |
| `e2e/cms-pages.spec.ts` | Volunteer page hydrates CMS content |
| `e2e/cms-pages.spec.ts` | Team page finishes loading people grid |
| `e2e/admin-editor-journeys.spec.ts` | Editor magic-link request and dashboard landing |
| `e2e/admin-editor-journeys.spec.ts` | Non-allowlisted account blocked with unauthorized page |
| `e2e/admin-editor-journeys.spec.ts` | Create and publish a project |
| `e2e/admin-editor-journeys.spec.ts` | Create and publish a news article |
| `e2e/admin-editor-journeys.spec.ts` | Upload and replace project media |
| `e2e/admin-editor-journeys.spec.ts` | Archive and permanently delete a project |
| `e2e/accessibility.spec.ts` | Homepage serious-violation axe scan |
| `e2e/accessibility.spec.ts` | Admin login surface serious-violation axe scan |

### E2E Tests Needed

None for identified critical journeys. Consider adding E2E smoke for `resources.astro` and `launch-readiness.astro` when those pages go live.

---

## Security Tests

> **9** of **9** security-sensitive areas covered · **0** gaps

### Existing Security Tests

| Scope | Test File | What's Tested |
|-------|-----------|---------------|
| lib | `src/lib/admin-security.test.ts` | Rate limits, allowlist, email normalization |
| lib | `src/lib/supabase-auth.test.ts` | Auth client singleton and browser guard |
| lib | `src/lib/auth-callback.test.ts` | Magic-link/PKCE callback param handling |
| lib | `src/lib/magic-link-errors.test.ts` | Auth error mapping (rate limit, allowlist, redirect) |
| lib | `src/lib/storage.test.ts` | Upload path sanitization |
| islands | `src/islands/admin/auth/AuthProvider.test.tsx` | Session bootstrap, allowlist gate |
| islands | `src/islands/admin/auth/LoginPage.test.tsx` | OTP request, throttling, error surfaces |
| islands | `src/islands/admin/auth/AuthCallback.*.test.tsx` | Callback exchange and redirect |
| pages | `tests/pages/admin-page.test.ts` | Admin CSP and noindex metadata |

### Security Tests Needed

None.

---

## Accessibility Tests

> **8** of **14** interactive components covered · **6** gaps

### Existing Accessibility Tests

| Scope | Test File | What's Tested |
|-------|-----------|---------------|
| islands | `src/islands/admin/auth/LoginPage.test.tsx` | jest-axe on login form |
| islands | `src/islands/admin/shared/ConfirmDialog.test.tsx` | jest-axe when open |
| islands | `src/islands/admin/layout/Sidebar.test.tsx` | `expectAccessible` navigation |
| islands | `src/islands/admin/layout/Toast.test.tsx` | `expectAccessible` notifications |
| islands | `src/islands/admin/shared/ContentForm.test.tsx` | `expectAccessible` form shell |
| islands | `src/islands/admin/shared/ImageUpload.test.tsx` | `expectAccessible` upload control |
| islands | `src/islands/admin/people/PeopleListPage.test.tsx` | `expectAccessible` list page |
| islands | `src/islands/detail-islands.test.tsx` | `expectAccessible` on detail views |
| e2e | `e2e/accessibility.spec.ts` | Playwright axe on homepage + admin login |

### Accessibility Tests Needed

| Component / Page | Scope | What to Test |
|-----------------|-------|--------------|
| `ContentTable.tsx` | islands | jest-axe smoke on table actions |
| `StatusSelect.tsx` | islands | Label association and keyboard use |
| `MarkdownField.tsx` | islands | Editor label/preview semantics |
| `SlugField.tsx` | islands | Input label and error states |
| `StatsCards.tsx` | islands | jest-axe after `aria-label` additions |
| `FormFeedback.tsx` | islands | Error/status announcement semantics |

---

## Test Health Observations

| Test File | Observation | Impact |
|-----------|-------------|--------|
| `tests/pages/*.test.ts` | Source-file assertions only | Fast regression guard; not rendered HTML checks |
| `tests/unit/astro-pages.unit.test.ts` | Covers 12 of 16 pages | New pages (`launch-readiness`, `resources`, `robots.txt`, `sitemap.xml`) unmapped |
| `src/lib/admin-security.ts` | 50.5% line coverage | `getAuthorizedAdmin` / `runProtectedAdminAction` paths lightly exercised |
| `e2e/admin-editor-journeys.spec.ts` | Supabase mocked via Playwright routes | Exercises real UI flows without staging credentials |

---

## Recommendations

1. **[P1]** Add source-contract tests for `launch-readiness.astro`, `resources.astro`, `robots.txt.ts`, and `sitemap.xml.ts` in `tests/unit/astro-pages.unit.test.ts` and `tests/pages/public-pages.test.ts`.
2. **[P2]** Add jest-axe smoke tests for `ContentTable`, `StatusSelect`, `StatsCards`, and `MarkdownField`.
3. **[P3]** Extend `lib-integration.test.ts` to cover `auth-callback` + `magic-link-errors` through composed login/callback flows.
4. **[P3]** Raise line coverage on `admin-security.ts` and `admin-queries.ts` with focused negative-path tests.

## Acceptance Criteria

- [ ] Every scope has a dedicated test module for all source files (4 page gaps remain)
- [x] All public data loaders and admin CRUD flows have positive and negative automated tests
- [x] Critical security logic has automated tests (9/9 areas)
- [x] Key editor journeys have E2E coverage (14/14)
- [ ] Core interactive components have accessibility checks (8/14 covered)
- [x] Coverage tooling runs from `.sdgqalab/config.yml`
- [x] All tests pass: `npm run test` and `npm run test:coverage`
