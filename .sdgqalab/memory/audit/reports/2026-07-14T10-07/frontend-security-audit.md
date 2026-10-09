---
schema: sdgqalab/audit@3
layer: "frontend"
layer_type: "astro-react-typescript"
quality_attribute: "security"
quality_attribute_name: "Security"
iso_characteristic: "Security"
project: "SDG AI Lab Website"
audited_at: "2026-07-14T10:07:05Z"
config_version: 2

score:
  pass: 6
  partial: 1
  fail: 4
  na: 2
  applicable: 11
  score_pct: 59.1
  rating: "Adequate"

priority_summary:
  p0_blockers: 1
  p1_critical: 3
  p2_important: 1
  p3_improvement: 0

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: "skipped_unattended"
---

# Security Audit - Frontend

> **Score**: 59.1% - Adequate
> **Results**: 6 pass - 1 partial - 4 fail - 2 n/a

## Summary

The repo has a strong baseline around secret handling, Supabase-backed authentication, RLS-based authorization, and upload restrictions. The biggest blocker is unsanitized Markdown rendered through `marked` plus `dangerouslySetInnerHTML`, which leaves published CMS content on an XSS path. Rate limiting, runtime input validation, and browser security headers are also missing from repo-controlled protections.

## Remediation Update (2026-07-14)

- `SEC-009` is remediated in repo code. Markdown rendering now goes through `src/lib/markdown.ts`, and current consumers in `src/islands/PageContent.tsx`, `src/islands/NewsDetail.tsx`, `src/islands/ProjectDetail.tsx`, and `src/islands/admin/shared/MarkdownField.tsx` render sanitized output instead of raw `marked` HTML.
- `SEC-013` is remediated in repo code. Admin CRUD writes in `src/lib/admin-queries.ts` now validate and normalize payloads at runtime before writing to Supabase.
- `SEC-012` is partially remediated in repo code. Client-side throttling now exists for admin OTP requests in `src/islands/admin/auth/LoginPage.tsx`, admin write/delete/archive flows in `src/lib/admin-queries.ts`, and storage operations in `src/lib/storage.ts`, but this still needs Supabase- or edge-enforced rate limiting to be a complete control.
- `SEC-005` is partially remediated in repo code. `src/components/layout/BaseLayout.astro` and `src/pages/admin.astro` now set CSP and referrer-policy meta tags, and analytics bootstrap moved to `public/scripts/analytics.js`, but true HTTP response headers such as HSTS still depend on deployment/platform configuration outside this repo.
- `SEC-011` was strengthened beyond the original audit finding. `src/islands/admin/auth/AuthProvider.tsx` now resolves the allowlist entry for the active session email instead of accepting an unscoped `admin_users` lookup.
- `npm run check` now passes locally after adding `@astrojs/check` and resolving follow-on TypeScript issues, so the earlier local verification gap is closed.

### Updated Status Snapshot

| Check ID | Current Status | Notes |
|----------|----------------|-------|
| SEC-005 | PARTIAL | Repo now provides meta CSP/referrer hardening; deployment headers still required for full coverage |
| SEC-009 | PASS | Sanitized Markdown rendering replaced raw `marked` + `dangerouslySetInnerHTML` flow |
| SEC-012 | PARTIAL | Client-side throttling added, but server/edge/provider enforcement is still required |
| SEC-013 | PASS | Runtime validation added on admin CRUD boundaries |

## Results

### PASS (6 items)

| Check ID | Item | Evidence |
|----------|------|----------|
| SEC-001 | Secrets in Source Control | `.gitignore` excludes `.env` and `.env.*`; public env values are documented in `.env.example` |
| SEC-010 | Authentication Implementation | `src/islands/admin/auth/LoginPage.tsx:18` uses `signInWithOtp`; `src/islands/admin/auth/LoginPage.tsx:22` sets `shouldCreateUser: false` |
| SEC-011 | Authorization & RBAC | `src/islands/admin/auth/AuthProvider.tsx:47` reads `admin_users`; `supabase/migrations/003_secure_editor_access.sql:19` enables RLS and allowlist checks |
| SEC-015 | File Upload Security | `src/lib/storage.ts:3`, `src/lib/storage.ts:11`, and `src/lib/storage.ts:13` restrict type, size, and filenames |
| SEC-026 | CI/CD Secrets Management | `.github/workflows/deploy.yml:29` and `.github/workflows/uptime-healthcheck.yml:38` read Supabase values from GitHub secrets |
| SEC-027 | Dependency Pinning | `package-lock.json` is committed and package versions are pinned to concrete resolved versions |

### PARTIAL (1 item)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| SEC-003 | Environment Variable Management | `README.md:108` documents required secrets and `.env.example` documents local variables | No repo-level runtime schema validation or production env contract enforcement beyond prose | medium |

### FAIL (4 items)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| SEC-005 | Security Headers | `src/components/layout/BaseLayout.astro` sets meta tags but no CSP, HSTS, or equivalent deployment config is present | high | P1 |
| SEC-009 | XSS Prevention | `src/islands/PageContent.tsx:59`, `src/islands/NewsDetail.tsx:112`, `src/islands/ProjectDetail.tsx:106`, and `src/islands/admin/shared/MarkdownField.tsx:48` render `marked` output through `dangerouslySetInnerHTML` with no sanitizer | critical | P0 |
| SEC-012 | Rate Limiting | No application or edge rate-limiting configuration was found for admin sign-in or content write flows | high | P1 |
| SEC-013 | Input Validation | `src/lib/admin-queries.ts` writes typed objects directly to Supabase without runtime schema validation on CRUD boundaries | high | P1 |

### N/A (2 items)

| Check ID | Item | Reason |
|----------|------|--------|
| SEC-019 | Docker Security | No container runtime is defined in this repo |
| SEC-022 | Prompt Injection Prevention | No AI/LLM features are present |