---
schema: sdgqalab/testmap@3
layer: "frontend"
project: "SDG AI Lab Website"
audited_at: "2026-07-15T01:40:00+02:00"
config_version: 3

coverage:
  total_source_files: 68
  unit:
    test_files: 3
    file_coverage_pct: 4.4
    file_coverage_rating: "Critical"
  integration:
    test_files: 0
    file_coverage_pct: 0.0
    file_coverage_rating: "Critical"
  e2e:
    journeys_identified: 6
    journeys_covered: 0
    gaps: 6
  security:
    areas_identified: 8
    areas_covered: 3
    gaps: 5
  accessibility:
    components_identified: 12
    components_covered: 0
    gaps: 12
  line_coverage_pct: 14.38
  line_coverage_rating: "Critical"
  test_count: 10

by_scope:
  "components":
    source_files: 8
    unit_test_files: 0
    unit_file_coverage_pct: 0.0
    integration_test_files: 0
    integration_file_coverage_pct: 0.0
  "islands":
    source_files: 39
    unit_test_files: 0
    unit_file_coverage_pct: 0.0
    integration_test_files: 0
    integration_file_coverage_pct: 0.0
  "lib":
    source_files: 8
    unit_test_files: 3
    unit_file_coverage_pct: 37.5
    integration_test_files: 0
    integration_file_coverage_pct: 0.0
  "pages":
    source_files: 12
    unit_test_files: 0
    unit_file_coverage_pct: 0.0
    integration_test_files: 0
    integration_file_coverage_pct: 0.0

delta:
  previous_audit: "2026-07-15T00:10"
  unit_file_coverage_change: 4.4
  integration_file_coverage_change: 0.0
  line_coverage_change: 14.38
  e2e_gaps_change: 0
  security_gaps_change: -3
  accessibility_gaps_change: 0
---

# Frontend Test Audit

> **Unit File Coverage**: 4.4% (3/68 files) - Critical
> **Integration File Coverage**: 0.0% (0/68 files) - Critical
> **Line Coverage**: 14.38% - Critical
> **Tests**: 10
> **Audited**: 2026-07-15

---

## Audit Status

This audit now includes a working coverage-tool run via `vitest run --coverage`.

- A minimal Vitest setup is now present in the repo.
- Three unit test files exist under `src/lib/`.
- Structural coverage remains very low because there are still no integration, E2E, or accessibility tests.
- The current line coverage reflects only the library-focused first test slice.

## Unit Tests

Tests that verify modules in isolation - no I/O, no external services.
Targets: utilities, hooks, guards, validation logic, shared components, state/context helpers.

### Unit Coverage by Scope

| Scope | Source Files | Unit Test Files | Unit File Coverage |
|-------|-------------:|----------------:|-------------------:|
| components | 8 | 0 | 0.0% |
| islands | 39 | 0 | 0.0% |
| lib | 8 | 3 | 37.5% |
| pages | 12 | 0 | 0.0% |
| **Total** | **68** | **3** | **4.4%** |

### Existing Unit Tests

| Scope | Test File | Approx. Tests | Modules Covered |
|-------|-----------|---------------|-----------------|
| lib | `src/lib/url.test.ts` | 2 | `src/lib/url.ts` |
| lib | `src/lib/markdown.test.ts` | 4 | `src/lib/markdown.ts` |
| lib | `src/lib/admin-security.test.ts` | 4 | `src/lib/admin-security.ts` |

### Unit Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/lib/admin-queries.ts` | lib | Runtime validators for slugs, URLs, dates, booleans, enums, and published-at normalization |
| `src/lib/storage.ts` | lib | MIME type filtering, file-size rejection, filename sanitization, and error handling |
| `src/lib/queries.ts` | lib | Public-data query mapping, fallback behavior, and error paths |
| `src/islands/components/ProjectCard.tsx` | islands | Status/SDG rendering and conditional UI variations |
| `src/islands/admin/shared/SlugField.tsx` | islands | Slug normalization and derived-field behavior |
| `src/islands/admin/shared/StatusSelect.tsx` | islands | Status transitions and published/draft selection logic |
| `src/islands/admin/auth/AuthProvider.tsx` | islands | Session state handling, unauthorized-user branch, and sign-out resets |

---

## Integration Tests

Tests that verify components working together across boundaries - page rendering, Supabase reads/writes, auth, storage, and admin workflows.

### Integration Coverage by Scope

| Scope | Source Files | Integration Test Files | Integration File Coverage |
|-------|-------------:|----------------------:|--------------------------:|
| components | 8 | 0 | 0.0% |
| islands | 39 | 0 | 0.0% |
| lib | 8 | 0 | 0.0% |
| pages | 12 | 0 | 0.0% |
| **Total** | **68** | **0** | **0.0%** |

### Existing Integration Tests

No integration test files were found.

### Integration Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/islands/PageContent.tsx` | islands | Supabase content fetch, fallback/error states, and sanitized HTML rendering |
| `src/islands/NewsDetail.tsx` | islands | Article loading, missing-content path, metadata rendering, and Markdown display |
| `src/islands/ProjectDetail.tsx` | islands | Project fetch, detail rendering, and content fallback behavior |
| `src/islands/admin/auth/LoginPage.tsx` | islands | Magic-link submission, throttle error path, and non-allowlisted response handling |
| `src/islands/admin/shared/ImageUpload.tsx` | islands | Upload, replace, and remove flows with mocked storage responses |
| `src/islands/admin/projects/ProjectFormPage.tsx` | islands | Create/update workflow, validation errors, and success navigation |
| `src/islands/admin/news/NewsFormPage.tsx` | islands | Create/update workflow, validation errors, and draft/published behavior |
| `src/islands/admin/statistics/StatisticsListPage.tsx` | islands | List fetch, archive/delete actions, and loading/error states |
| `src/pages/admin.astro` | pages | Admin shell bootstrapping and client-only app rendering |

---

## End-to-End (E2E) Tests

Tests that verify complete user journeys through the real application.

> **0** of **6** critical journeys covered - **6** gaps

### Existing E2E Tests

No E2E framework or E2E test files were found.

### E2E Tests Needed

| User Journey | Priority | What to Cover |
|-------------|----------|---------------|
| Editor magic-link login | P1 | Request link, return to `/admin`, establish session, and land on dashboard |
| Unauthorized editor denial | P1 | Sign in with a non-allowlisted account and confirm access is blocked |
| Create and publish a project | P1 | Full admin create flow, publish, and verify public visibility |
| Create and publish a news article | P1 | Full admin create flow with Markdown and public detail-page verification |
| Upload and replace media | P1 | Add image, replace image, and verify resulting public URL behavior |
| Archive and delete content | P2 | Archive an item, confirm removal from public views, then permanently delete |

---

## Security Tests

Tests that verify authentication, authorization, input validation, and protection against common vulnerabilities.

> **3** of **8** security-sensitive areas covered - **5** gaps

### Existing Security Tests

| Scope | Test File | What's Tested |
|-------|-----------|---------------|
| lib | `src/lib/markdown.test.ts` | Markdown sanitization, unsafe URL neutralization, and safe data-image handling |
| lib | `src/lib/admin-security.test.ts` | Rate-limit helper behavior and retry timing |
| lib | `src/lib/url.test.ts` | Environment-derived staging/base-path behavior relevant to route construction |

### Security Tests Needed

| Area | Scope | What to Test |
|------|-------|--------------|
| Session allowlist enforcement | islands | Active session is rejected when no matching `admin_users` entry exists |
| Runtime admin validation | lib | Invalid slugs, URLs, dates, and enums are rejected before write calls |
| Protected admin mutations | lib | Create/update/archive/delete paths require authorized admin context |
| Storage abuse controls | lib | Upload/remove actions reject rapid abuse and invalid file inputs |
| Security header presence | pages | Admin/public layouts emit CSP and referrer-policy meta tags |

---

## Accessibility Tests

Tests that verify the application is usable by people with disabilities.

> **0** of **12** interactive components covered - **12** gaps

### Existing Accessibility Tests

No accessibility testing tooling or assertions were found.

### Accessibility Tests Needed

| Component / Page | Scope | What to Test |
|-----------------|-------|--------------|
| `src/components/layout/Header.astro` | components | Keyboard navigation, mobile menu state, and aria attributes |
| `src/pages/index.astro` | pages | Landmark structure, heading order, and CTA accessibility |
| `src/pages/admin.astro` | pages | Admin shell semantics and noindex/structure smoke checks |
| `src/islands/admin/auth/LoginPage.tsx` | islands | Form labels, error messaging, and submit-button state |
| `src/islands/admin/shared/ContentForm.tsx` | islands | Focus order, submit states, and error feedback semantics |
| `src/islands/admin/shared/ConfirmDialog.tsx` | islands | Dialog labeling, focus trapping, and keyboard dismissal |
| `src/islands/admin/shared/ImageUpload.tsx` | islands | File input labeling and error announcement |
| `src/islands/admin/layout/Sidebar.tsx` | islands | Navigation roles and active-page indicators |
| `src/islands/admin/layout/Toast.tsx` | islands | `aria-live` behavior and dismiss controls |
| `src/islands/admin/people/PeopleListPage.tsx` | islands | Filter buttons and keyboard access |
| `src/islands/NewsDetail.tsx` | islands | Loading/error states and content semantics |
| `src/islands/ProjectDetail.tsx` | islands | Loading/error states and interactive details |

---

## Test Health Observations

No issues observed in the current test files. The present gap is breadth, not test quality.

---

## Recommendations

1. **[P1]** Add integration tests around the admin auth, CRUD, and storage workflows because these are the highest-risk user and security paths.
2. **[P1]** Add unit tests for `src/lib/admin-queries.ts`, `src/lib/storage.ts`, and `src/lib/queries.ts` to lift both file and line coverage quickly.
3. **[P1]** Add focused security tests for allowlist enforcement, protected mutations, and storage abuse controls to preserve the recent hardening work.
4. **[P2]** Introduce an E2E framework for the core editor journeys once the integration layer is in place.
5. **[P2]** Add accessibility smoke tests (for example axe-based checks) for the admin UI and public interactive components.

## Acceptance Criteria

- [ ] Every scope has at least one dedicated automated test module
- [ ] All public data loaders and admin CRUD flows have at least one positive and one negative automated test
- [ ] Critical security logic has automated tests
- [ ] Key editor journeys have E2E coverage
- [ ] Core interactive components have accessibility checks
- [ ] Coverage tooling continues to run from `.sdgqalab/config.yml`
- [ ] All tests pass: `npm run test`