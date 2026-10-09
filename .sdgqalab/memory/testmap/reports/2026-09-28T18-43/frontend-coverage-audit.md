---
schema: sdgqalab/testmap@3
layer: "frontend"
project: "SDG AI Lab Website"
audited_at: "2026-09-28T18:43:00Z"
config_version: 3

coverage:
  total_source_files: 98
  unit:
    test_files: 35
    file_coverage_pct: 80.6
    file_coverage_rating: "Solid"
  integration:
    test_files: 33
    file_coverage_pct: 70.4
    file_coverage_rating: "Solid"
  e2e:
    journeys_identified: 22
    journeys_covered: 14
    gaps: 8
  security:
    areas_identified: 11
    areas_covered: 9
    gaps: 2
  accessibility:
    components_identified: 22
    components_covered: 14
    gaps: 8
  line_coverage_pct: 71.15
  line_coverage_rating: "Adequate"
  test_count: 335

by_scope:
  "components":
    source_files: 8
    unit_test_files: 2
    unit_file_coverage_pct: 100.0
    integration_test_files: 4
    integration_file_coverage_pct: 100.0
  "islands":
    source_files: 56
    unit_test_files: 22
    unit_file_coverage_pct: 76.8
    integration_test_files: 20
    integration_file_coverage_pct: 64.3
  "lib":
    source_files: 12
    unit_test_files: 12
    unit_file_coverage_pct: 100.0
    integration_test_files: 1
    integration_file_coverage_pct: 58.3
  "pages":
    source_files: 22
    unit_test_files: 3
    unit_file_coverage_pct: 72.7
    integration_test_files: 9
    integration_file_coverage_pct: 81.8

delta:
  previous_audit: "2026-07-22T20:54"
  unit_file_coverage_change: -19.4
  integration_file_coverage_change: -28.2
  line_coverage_change: -18.57
  e2e_gaps_change: 8
  security_gaps_change: 2
  accessibility_gaps_change: 8
---

# Frontend Test Audit

> **Unit File Coverage**: 80.6% (79/98 files) · Solid
> **Integration File Coverage**: 70.4% (69/98 files) · Solid
> **Line Coverage**: 71.15% · Adequate
> **Tests**: 335 Vitest + 14 Playwright E2E
> **Audited**: 2026-09-28T18:43 UTC

---

## Audit Status

Marina redesign expanded the source tree from **73 → 98** files. Coverage tooling was blocked by stale page-contract assertions and incomplete dashboard mocks for `publications`; those were fixed so `npm run test:coverage` could complete (68 files / 335 tests passing).

File coverage remains **Solid**, but line coverage dropped from **89.72% → 71.15% (Adequate)** because new public islands and admin modules ship with **0% line coverage**.

---

## Unit Tests

Tests that verify modules in isolation — no I/O, no external services.
Targets: models, serializers, validators, utilities, hooks, guards, formatters.

### Unit Coverage by Scope

| Scope | Source Files | Unit Test Files | Unit File Coverage |
|-------|-------------:|----------------:|-------------------:|
| components | 8 | 2 | 100.0% |
| islands | 56 | 22 | 76.8% |
| lib | 12 | 12 | 100.0% |
| pages | 22 | 3 | 72.7% |
| **Total** | **98** | **35** | **80.6%** |

### Existing Unit Tests

| Scope | Test File | Approx. Tests | Modules Covered |
|-------|-----------|--------------:|-----------------|
| lib | `src/lib/*.test.ts` (11 files) | ~70 | url, markdown, types, auth-callback, magic-link-errors, admin-security, observability, storage, supabase, queries, admin-queries |
| lib | `src/data/sampleContent.test.ts` | ~6 | sampleContent fixtures |
| islands | `src/islands/admin/admin-pages.unit.test.tsx` | ~15 | Dashboard + core admin Form/List pages (excl. publications & geographic-reach) |
| islands | `src/islands/admin/admin-shell.unit.test.tsx` | ~4 | Admin shell wiring |
| islands | `src/islands/public-islands.unit.test.tsx` | ~8 | PublicationsList + selected public islands |
| islands | `src/islands/detail-islands.unit.test.tsx` | ~2 | Detail island smoke |
| islands | colocated `*.test.tsx` under admin/shared, layout, auth, components | ~80 | Shared form controls, AuthProvider, StatusBadge, ObservabilityBoundary |
| pages | `tests/unit/astro-pages.unit.test.ts` | ~14 | Core Astro page source contracts |
| pages | `tests/unit/astro-components.unit.test.ts` | ~11 | Header/Footer/BaseLayout/UI Astro components |
| pages | `tests/unit/page-endpoints.unit.test.ts` | ~4 | robots.txt / sitemap.xml handlers |

### Unit Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/islands/ContactForm.tsx` | islands | Field validation, mailto payload construction, disabled/submit states |
| `src/islands/PortfolioGrid.tsx` | islands | Filter/search rendering, empty/error states with mocked queries |
| `src/islands/HeroProjectSpotlight.tsx` | islands | Fallback content, loading/error paths |
| `src/islands/ResearchOutputs.tsx` | islands | List rendering and empty state |
| `src/islands/GeographicReach.tsx` | islands | Published reach cards + fallback when query empty |
| `src/islands/EvolutionTimeline.tsx` | islands | Timeline render + fallback data |
| `src/islands/LatestActivity.tsx` | islands | Activity feed states |
| `src/islands/admin/shared/VideoUpload.tsx` | islands | Accept/reject file types, preview, replace/remove |
| `src/islands/components/ProjectShowcase.tsx` | islands | Card grid rendering for featured project props |
| `src/islands/admin/geographic-reach/GeographicReachFormPage.tsx` | islands | Create/edit form shell + validation |
| `src/islands/admin/geographic-reach/GeographicReachListPage.tsx` | islands | List/archive/delete shell |
| `src/islands/admin/publications/PublicationFormPage.tsx` | islands | Create/edit form shell + validation |
| `src/islands/admin/publications/PublicationsListPage.tsx` | islands | List/archive/delete shell |
| `src/pages/services.astro` | pages | Source-contract checks for Marina services layout |
| `src/pages/research.astro` | pages | Source-contract checks for research layout |
| `src/pages/programmes.astro` | pages | Source-contract checks for programmes layout |
| `src/pages/capacity-building.astro` | pages | Source-contract checks for capacity-building layout |
| `src/pages/focus-areas.astro` | pages | Source-contract checks for expertise/focus-areas layout |
| `src/pages/how-we-work.astro` | pages | Source-contract checks if page remains published |

---

## Integration Tests

Tests that verify components working together across boundaries —
API endpoints, database operations, service contracts, workflows.

### Integration Coverage by Scope

| Scope | Source Files | Integration Test Files | Integration File Coverage |
|-------|-------------:|----------------------:|--------------------------:|
| components | 8 | 4 | 100.0% |
| islands | 56 | 20 | 64.3% |
| lib | 12 | 1 | 58.3% |
| pages | 22 | 9 | 81.8% |
| **Total** | **98** | **33** | **70.4%** |

### Existing Integration Tests

| Scope | Test File | Approx. Tests | Boundaries Covered |
|-------|-----------|--------------:|--------------------|
| islands | `AdminApp.integration.test.tsx` | ~3 | Lazy route loading with mocked admin queries |
| islands | `AuthStack.integration.test.tsx` / `AuthCallback.integration.test.tsx` | ~2 | Auth provider + callback composition |
| islands | `AdminShell.integration.test.tsx` / `AdminFormShell.integration.test.tsx` | ~2 | Layout navigation + form shell |
| islands | colocated Form/List `*.test.tsx` | ~40 | Admin CRUD UI with mocked `admin-queries` |
| islands | `public-islands.test.tsx` / `detail-islands.test.tsx` | ~20 | Public islands with mocked queries + a11y |
| islands | `IslandComponents.integration.test.tsx` | ~1 | ProjectCard/StatusBadge composition |
| lib | `src/lib/lib-integration.test.ts` | ~6 | Cross-module lib contracts |
| pages | `tests/pages/*.test.ts` | ~30 | Astro page composition and Marina contracts |
| components | `tests/integration/astro-components.integration.test.ts` | ~10 | Layout/UI Astro composition |

### Integration Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/islands/ContactForm.tsx` | islands | Form → mailbox href integration with validation errors |
| `src/islands/PortfolioGrid.tsx` | islands | Query → filter → card grid workflow |
| `src/islands/HeroProjectSpotlight.tsx` | islands | Featured project query + CTA rendering |
| `src/islands/ResearchOutputs.tsx` | islands | Research query → list boundary |
| `src/islands/GeographicReach.tsx` | islands | Reach query → map/list boundary |
| `src/islands/EvolutionTimeline.tsx` | islands | Timeline query → public render boundary |
| `src/islands/LatestActivity.tsx` | islands | Activity query composition |
| `src/islands/PublicationsList.tsx` | islands | Publications query → search/filter (unit exists; add integration path) |
| `src/islands/admin/publications/*` | islands | Publications list/form CRUD with mocked Supabase |
| `src/islands/admin/geographic-reach/*` | islands | Geographic reach list/form CRUD with mocked Supabase |
| `src/islands/admin/evolution-timeline/*` | islands | Full create/edit/archive flows beyond unit shell |
| `src/islands/admin/shared/VideoUpload.tsx` | islands | Upload/replace path with storage mock |
| `src/pages/focus-areas.astro` | pages | Page composition contract |
| `src/pages/how-we-work.astro` | pages | Page composition contract (if retained) |
| `src/pages/robots.txt.ts` | pages | Endpoint response integration |
| `src/pages/sitemap.xml.ts` | pages | Endpoint response integration |
| `src/lib/storage.ts` | lib | Upload path with ImageUpload/VideoUpload workflows |
| `src/lib/supabase.ts` / `supabase-auth.ts` | lib | Client init + auth client boundary (optional; unit exists) |

---

## End-to-End (E2E) Tests

Tests that verify complete user journeys through the real application.
Tools: Playwright (`npm run test:e2e`).

> **14** of **22** critical journeys covered · **8** gaps

### Existing E2E Tests

| Test File / Suite | User Journey Covered |
|-------------------|---------------------|
| `e2e/public-and-admin.spec.ts` | Homepage load, Solutions navigation, admin protected shell |
| `e2e/cms-pages.spec.ts` | About, volunteer, and team Marina/CMS hydration |
| `e2e/admin-editor-journeys.spec.ts` | Magic-link login, unauthorized user, project publish, news publish, media upload, archive/delete |
| `e2e/accessibility.spec.ts` | Homepage and admin login axe scans |

### E2E Tests Needed

| User Journey | Priority | What to Cover |
|-------------|----------|---------------|
| Contact request flow | P1 | Contact page loads; form fields produce expected mailto/request UX |
| Services page | P1 | Primary nav → Services; key offer sections visible |
| Research & Advisory page | P1 | Primary nav → Research; ResearchOutputs island hydrates |
| Expertise / focus-areas page | P1 | Primary nav → Expertise; content sections visible |
| Programmes page | P2 | Footer/nav path → programmes cohorts layout |
| Publications / resources page | P2 | Publications list island hydrates and is reachable |
| Admin publications CRUD | P2 | Create/publish/archive a publication as editor |
| Admin geographic-reach CRUD | P3 | Create/archive a geographic reach item as editor |

---

## Security Tests

Tests that verify authentication, authorization, input validation,
and protection against common vulnerabilities (OWASP Top 10).

> **9** of **11** security-sensitive areas covered · **2** gaps

### Existing Security Tests

| Scope | Test File | What's Tested |
|-------|-----------|---------------|
| lib | `src/lib/admin-security.test.ts` | Rate limits, allowlist, protected actions |
| lib | `src/lib/auth-callback.test.ts` | PKCE/hash callback exchange |
| lib | `src/lib/magic-link-errors.test.ts` | OTP error mapping |
| lib | `src/lib/admin-queries.test.ts` | Input validation guards |
| lib | `src/lib/storage.test.ts` | Upload path/type constraints |
| islands | `src/islands/admin/auth/LoginPage.test.tsx` | Login flow and error display |
| islands | `src/islands/admin/auth/AuthProvider.test.tsx` | Session authorization |
| islands | `src/islands/admin/auth/AuthCallback.test.tsx` | Callback error handling |
| pages | `tests/pages/admin-astro.test.ts` | Admin CSP and noindex shell |

### Security Tests Needed

| Area | Scope | What to Test |
|------|-------|--------------|
| Contact form input handling | islands | Sanitize/encode user fields in mailto construction; reject oversized payloads |
| Video upload validation | islands | Reject non-video MIME/types and oversized files in `VideoUpload` |

---

## Accessibility Tests

Tests that verify the application is usable by people with disabilities.
Tools: jest-axe (`src/test/axe.ts`), Playwright `@axe-core/playwright`.

> **14** of **22** interactive components covered · **8** gaps

### Existing Accessibility Tests

| Scope | Test File | What's Tested |
|-------|-----------|---------------|
| islands | `LoginPage.test.tsx` | jest-axe on login form |
| islands | `ConfirmDialog.test.tsx` | jest-axe when open |
| islands | `Sidebar.test.tsx` | `expectAccessible` navigation |
| islands | `Toast.test.tsx` | `expectAccessible` notifications |
| islands | `ContentForm.test.tsx` | `expectAccessible` form shell |
| islands | `ImageUpload.test.tsx` | `expectAccessible` upload control |
| islands | `PeopleListPage.test.tsx` | `expectAccessible` list page |
| islands | `detail-islands.test.tsx` | `expectAccessible` on detail views |
| islands | `ContentTable.test.tsx` | jest-axe on populated table |
| islands | `StatusSelect.test.tsx` | jest-axe on labeled select |
| islands | `MarkdownField.test.tsx` | jest-axe on editor + preview |
| islands | `SlugField.test.tsx` | jest-axe on slug input |
| islands | `FormFeedback.test.tsx` | jest-axe on alert feedback |
| islands | `public-islands.test.tsx` | jest-axe on `StatsCards` |
| e2e | `e2e/accessibility.spec.ts` | Playwright axe on homepage + admin login |

### Accessibility Tests Needed

| Component / Page | Scope | What to Test |
|-----------------|-------|--------------|
| `ContactForm.tsx` | islands | Labels, error association, keyboard submit |
| `PortfolioGrid.tsx` | islands | Filter controls + axe smoke |
| `HeroProjectSpotlight.tsx` | islands | Landmark/CTA names + axe smoke |
| `ResearchOutputs.tsx` | islands | List semantics + axe smoke |
| `GeographicReach.tsx` | islands | Interactive map/list a11y |
| `EvolutionTimeline.tsx` | islands | Timeline structure + axe smoke |
| `VideoUpload.tsx` | islands | File input labeling + keyboard replace/remove |
| `ProjectShowcase.tsx` | islands | Card link names + axe smoke |

---

## Test Health Observations

| Test File | Observation | Impact |
|-----------|-------------|--------|
| `src/islands/ContactForm.tsx` (+ 6 other public islands) | **0% line coverage** — modules exist but are not imported by current suites | Inflates perceived coverage vs Marina UI reality |
| `src/islands/admin/publications/*` | **0% line coverage**; routes exist in `AdminApp` but no unit/integration suite | Publications CMS untested |
| `src/islands/admin/geographic-reach/*` | **0% line coverage**; mocked in `admin-pages.unit` but never rendered | Geographic CMS untested |
| `src/lib/admin-queries.ts` | 55.93% line coverage | CRUD happy paths covered; many mutation branches unused |
| `src/lib/queries.ts` | 54.9% line coverage | Public loader error branches lightly exercised |
| `src/islands/admin/shared/VideoUpload.tsx` | 36.79% line coverage via ProjectForm only | Upload edge paths unprotected |
| `AdminApp.integration.test.tsx` | React `act(...)` / suspense noise historically; dashboard mock previously missing `publications` | Fixed for this audit; watch for future entity drift |

---

## Recommendations

1. **[P1]** Add unit + integration coverage for zero-line public islands (`ContactForm`, `PortfolioGrid`, `HeroProjectSpotlight`, `ResearchOutputs`, `GeographicReach`, `EvolutionTimeline`, `LatestActivity`) — largest driver of the line-coverage drop.
2. **[P1]** Extend `admin-pages.unit.test.tsx` (and dedicated Form/List tests) to publications and geographic-reach admin modules; keep dashboard mocks in sync with `CARD_CONFIG`.
3. **[P1]** Add Playwright journeys for Marina primary nav pages: Contact, Services, Research, Expertise.
4. **[P2]** Add jest-axe smoke tests for new interactive islands and `VideoUpload`.
5. **[P2]** Raise `admin-queries.ts` / `queries.ts` line coverage above 75% with negative-path tests.
6. **[P3]** Add E2E coverage for publications and geographic-reach editor CRUD.

## Acceptance Criteria

- [ ] Every new Marina public island has unit and integration coverage
- [ ] Publications and geographic-reach admin pages have Form/List tests
- [ ] Critical Marina nav journeys have E2E coverage
- [ ] Contact form and VideoUpload have security assertions
- [ ] New interactive islands have jest-axe smoke checks
- [x] Coverage tooling runs from `.sdgqalab/config.yml`
- [x] All tests pass: `npm run test` and `npm run test:coverage`
