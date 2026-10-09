---
schema: sdgqalab/testmap@3
layer: "frontend"
project: "SDG AI Lab Website"
audited_at: "2026-07-15T00:10:00+02:00"
config_version: 3

coverage:
  total_source_files: 68
  unit:
    test_files: 0
    file_coverage_pct: 0.0
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
    areas_covered: 0
    gaps: 8
  accessibility:
    components_identified: 12
    components_covered: 0
    gaps: 12
  line_coverage_pct: 0.0
  line_coverage_rating: "Critical"
  test_count: 0

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
    unit_test_files: 0
    unit_file_coverage_pct: 0.0
    integration_test_files: 0
    integration_file_coverage_pct: 0.0
  "pages":
    source_files: 12
    unit_test_files: 0
    unit_file_coverage_pct: 0.0
    integration_test_files: 0
    integration_file_coverage_pct: 0.0

delta:
  previous_audit: null
  unit_file_coverage_change: null
  integration_file_coverage_change: null
  line_coverage_change: null
  e2e_gaps_change: null
  security_gaps_change: null
  accessibility_gaps_change: null
---

# Frontend Test Audit

> **Unit File Coverage**: 0.0% (0/68 files) - Critical
> **Integration File Coverage**: 0.0% (0/68 files) - Critical
> **Line Coverage**: Blocked - no `coverage_command` is configured in `.sdgqalab/config.yml`
> **Tests**: 0
> **Audited**: 2026-07-15

---

## Audit Status

This audit is structurally complete but operationally blocked at the mandatory coverage-tool step.

- No test files matched the configured patterns under `src/`.
- `package.json` exposes `npm run check`, but no unit/integration/E2E test runner is configured.
- `.sdgqalab/config.yml` sets `coverage_command: ""`, so line-level coverage cannot be measured.
- Per the `sdgqalab-testmap` workflow, coverage-tool failure or absence blocks a complete coverage audit.

## Unit Tests

Tests that verify modules in isolation - no I/O, no external services.
Targets: utilities, hooks, guards, validation logic, shared components, state/context helpers.

### Unit Coverage by Scope

| Scope | Source Files | Unit Test Files | Unit File Coverage |
|-------|-------------:|----------------:|-------------------:|
| components | 8 | 0 | 0.0% |
| islands | 39 | 0 | 0.0% |
| lib | 8 | 0 | 0.0% |
| pages | 12 | 0 | 0.0% |
| **Total** | **68** | **0** | **0.0%** |

### Existing Unit Tests

No unit test files were found.

### Unit Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/lib/markdown.ts` | lib | Sanitization behavior for raw HTML, unsafe links, allowed Markdown, and edge-case payloads |
| `src/lib/admin-security.ts` | lib | Rate-limit state transitions, retry timing, auth cache behavior, and email normalization |
| `src/lib/admin-queries.ts` | lib | Runtime validators for slugs, URLs, dates, booleans, enums, and published-at normalization |
| `src/lib/storage.ts` | lib | MIME type filtering, file-size rejection, filename sanitization, and error handling |
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

> **0** of **8** security-sensitive areas covered - **8** gaps

### Existing Security Tests

No security-focused automated tests were found.

### Security Tests Needed

| Area | Scope | What to Test |
|------|-------|--------------|
| Magic-link login throttling | islands | Repeated login attempts return client-side throttle errors |
| Session allowlist enforcement | islands | Active session is rejected when no matching `admin_users` entry exists |
| Runtime admin validation | lib | Invalid slugs, URLs, dates, and enums are rejected before write calls |
| Markdown sanitization | lib | XSS payloads are neutralized before HTML reaches renderers |
| Protected admin mutations | lib | Create/update/archive/delete paths require authorized admin context |
| Storage abuse controls | lib | Upload/remove actions reject rapid abuse and invalid file inputs |
| Security header presence | pages | Admin/public layouts emit CSP and referrer-policy meta tags |
| Public content rendering | islands | Sanitized HTML output is used in content/detail renderers |

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

No issues observed - no automated tests currently exist.

---

## Recommendations

1. **[P1]** Add a real test runner and configure `coverage_command` in `.sdgqalab/config.yml` (for example Vitest plus coverage) so line coverage can be measured at all.
2. **[P1]** Add integration tests around the admin auth, CRUD, and storage workflows because these are the highest-risk user and security paths.
3. **[P1]** Add focused security tests for Markdown sanitization, runtime write validation, and admin throttling to preserve the recent hardening work.
4. **[P2]** Introduce an E2E framework for the core editor journeys once the integration layer is in place.
5. **[P2]** Add accessibility smoke tests (for example axe-based checks) for the admin UI and public interactive components.

## Acceptance Criteria

- [ ] Every scope has a dedicated test module
- [ ] All public data loaders and admin CRUD flows have at least one positive and one negative automated test
- [ ] Critical security logic has automated tests
- [ ] Key editor journeys have E2E coverage
- [ ] Core interactive components have accessibility checks
- [ ] Coverage tooling is configured and runnable from `.sdgqalab/config.yml`
- [ ] All tests pass: `npm run check`