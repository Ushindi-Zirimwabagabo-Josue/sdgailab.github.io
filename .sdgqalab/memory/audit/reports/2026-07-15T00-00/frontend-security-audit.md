---
schema: sdgqalab/audit@3
layer: "frontend"
layer_type: "astro-react-typescript"
quality_attribute: "security"
quality_attribute_name: "Security"
iso_characteristic: "Security"
project: "SDG AI Lab Website"
audited_at: "2026-07-15T00:00:00+02:00"
config_version: 2

score:
  pass: 8
  partial: 3
  fail: 0
  na: 2
  applicable: 11
  score_pct: 86.4
  rating: "Exemplary"

priority_summary:
  p0_blockers: 0
  p1_critical: 0
  p2_important: 2
  p3_improvement: 1

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: "skipped_unattended"
---

# Security Audit - Frontend

> **Score**: 86.4% - Exemplary
> **Results**: 8 pass - 3 partial - 0 fail - 2 n/a

## Summary

This focused re-audit reflects the current hardened staging state of the SDG AI Lab website. The previous P0 XSS path is closed, admin writes now enforce runtime validation, and client-side abuse controls exist around magic-link requests, content mutations, and storage operations. The remaining security gaps are now mainly deployment- and platform-level: true HTTP response headers and backend-enforced rate limiting still sit outside repo-only controls.

## Project Context Used

- The site is currently operating in staging at `https://sdg-ai-lab.github.io/sdgailab.github.io/`, with production cutover to `https://sdgailab.org` documented but intentionally deferred.
- Supabase remains the backend for Auth, Postgres, and Storage, with editor allowlisting through `admin_users` and public asset delivery through the `public-assets` bucket.
- `npm run check` now passes locally after the remediation work, so this re-audit includes code-level and local verification signals that were unavailable during the original unattended pass.

## Results

### PASS (8 items)

| Check ID | Item | Evidence |
|----------|------|----------|
| SEC-001 | Secrets in Source Control | `.gitignore` excludes `.env` and `.env.*`; public env values are documented in `.env.example` |
| SEC-009 | XSS Prevention | `src/lib/markdown.ts:1` sanitizes Markdown output before rendering; current consumers use the shared renderer in `src/islands/PageContent.tsx:5`, `src/islands/NewsDetail.tsx:5`, `src/islands/ProjectDetail.tsx:5`, and `src/islands/admin/shared/MarkdownField.tsx:4` |
| SEC-010 | Authentication Implementation | `src/islands/admin/auth/LoginPage.tsx:33` uses `signInWithOtp`; `src/islands/admin/auth/LoginPage.tsx:37` sets `shouldCreateUser: false` |
| SEC-011 | Authorization & RBAC | `src/islands/admin/auth/AuthProvider.tsx:61` verifies the active session email against `admin_users`; `supabase/migrations/003_secure_editor_access.sql:17` and live hardening procedures keep RLS allowlisting in place |
| SEC-013 | Input Validation | `src/lib/admin-queries.ts:104` and entity validators below it normalize and validate admin payloads before Supabase writes |
| SEC-015 | File Upload Security | `src/lib/storage.ts:4`, `src/lib/storage.ts:10`, and `src/lib/storage.ts:25` restrict MIME type, file size, and filenames before upload |
| SEC-026 | CI/CD Secrets Management | `.github/workflows/deploy.yml:29` and `.github/workflows/uptime-healthcheck.yml:38` read Supabase values from GitHub secrets |
| SEC-027 | Dependency Pinning | `package-lock.json` is committed and resolved package versions are pinned |

### PARTIAL (3 items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| SEC-003 | Environment Variable Management | `.env.example` documents browser-exposed variables and the repo now has stronger runtime validation at admin write boundaries | No repo-level production env contract/schema enforcement beyond documentation and deployment configuration | medium |
| SEC-005 | Security Headers | `src/components/layout/BaseLayout.astro:19` and `src/pages/admin.astro:5` now set CSP and referrer-policy meta tags; analytics bootstrap moved out of inline script usage | True HTTP response headers such as HSTS and platform-level CSP enforcement still depend on the hosting layer, not the repo alone | high |
| SEC-012 | Rate Limiting | `src/islands/admin/auth/LoginPage.tsx:13`, `src/lib/admin-security.ts:81`, `src/lib/admin-queries.ts:104`, and `src/lib/storage.ts:14` provide client-side throttling and shared protected admin actions | Backend- or provider-enforced rate limiting is still required for robust abuse prevention | high |

### FAIL (0 items)

No failing frontend security checks remain in the current repo-controlled scope.

### N/A (2 items)

| Check ID | Item | Reason |
|----------|------|--------|
| SEC-019 | Docker Security | No container runtime is defined in this repo |
| SEC-022 | Prompt Injection Prevention | No AI/LLM features are present |

## Current Priority View

- **P2**: Complete platform-side security headers enforcement during future production cutover.
- **P2**: Enable Supabase/provider-side auth and abuse rate limits to backstop the client-side throttles.
- **P3**: Define a clearer production env contract if the deployment surface grows.