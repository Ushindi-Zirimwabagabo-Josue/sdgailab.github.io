---
schema: sdgqalab/audit@3
layer: "frontend"
layer_type: "astro-react-typescript"
quality_attribute: "security"
quality_attribute_name: "Security"
iso_characteristic: "Security"
project: "SDG AI Lab Website"
audited_at: "2026-09-28T21:36:00Z"
config_version: 3

score:
  pass: 11
  partial: 8
  fail: 1
  na: 8
  applicable: 20
  score_pct: 75.0
  rating: "Solid"

priority_summary:
  p0_blockers: 0
  p1_critical: 1
  p2_important: 1
  p3_improvement: 0

delta:
  previous_audit: '2026-07-22T20:59'
  score_change: 8.3
  new_passes: ['SEC-001', 'SEC-002', 'SEC-026']
  new_fails: []

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: "skipped_unattended"
---
# Security Audit — Frontend

> **Score**: 75.0% · Solid
> **Results**: 11 pass · 8 partial · 1 fail · 8 n/a
> **Blockers**: 0 | **Critical (P1)**: 1 | **Important (P2)**: 1
> **Audited**: 2026-09-28
> **Layer**: frontend (astro-react-typescript)
> **ISO Grounding**: Security

---

## Summary

Security rose from 66.7% (Adequate) to **75.0% (Solid)** after CI gained gitleaks, Dependabot, and `npm audit --audit-level=critical` (`audit:ci`). Magic-link auth, RLS, and CSP remain solid. Top residual risk is XSS sanitization without DOMPurify (SEC-009, critical→P1); branch protection/CODEOWNERS still unverifiable (SEC-028).

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | Static Astro + React islands; Supabase Auth/RLS/Storage (`astro.config.mjs`, `src/lib/supabase.ts`) |
| Interfaces | Public pages `src/pages/`; admin `#/` SPA; `contact-submit` edge function |
| Data contracts | `src/lib/types.ts`; validators in `src/lib/admin-queries.ts`; migrations `001`–`012` |
| AI/ML behavior | N/A |
| Checkpoint status | skipped_unattended |

---

## Results

### PASS (11 items)

| Check ID | Item | Evidence |
|----------|------|----------|
| SEC-001 | Secrets in Source Control | `.env` gitignored; gitleaks job in `.github/workflows/test.yml` |
| SEC-002 | Dependency Vulnerability Scanning | `npm run audit:ci` + Dependabot (`.github/dependabot.yml`) |
| SEC-003 | Environment Variable Management | `.env.example`; `PUBLIC_*` via `import.meta.env`; deploy secrets |
| SEC-004 | HTTPS Enforcement | Site `https://sdgailab.org`; CSP `upgrade-insecure-requests` in `BaseLayout.astro` |
| SEC-007 | CSRF Protection | Supabase JWT bearer; no cookie session CSRF surface |
| SEC-008 | SQL Injection Prevention | Supabase query builder + RLS (`003_secure_editor_access.sql`) |
| SEC-010 | Authentication Implementation | Magic link + PKCE/hash (`LoginPage.tsx`, `auth-callback.ts`, `AuthProvider.tsx`) |
| SEC-016 | API Authentication | RLS `is_admin_user()`; anon key only for public reads |
| SEC-017 | API Input Sanitization | Hand validators before writes in `admin-queries.ts` |
| SEC-018 | API Response Data Filtering | Explicit `.select()`; `magic-link-errors.ts` scrubbed messages |
| SEC-026 | CI/CD Secrets Management | GitHub Actions secrets for deploy/Sentry; no secrets in workflows |

### PARTIAL (8 items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| SEC-005 | Security Headers | CSP meta in `BaseLayout.astro` / `admin.astro` | Platform-level HSTS/XFO/Referrer-Policy not fully asserted on Pages | high |
| SEC-006 | CORS Configuration | Supabase project CORS controls edge | Browser/edge surfaces may allow broad origins (`*`) | medium |
| SEC-009 | XSS Prevention | Markdown sanitize path in `src/lib/markdown.ts` | No DOMPurify / audited HTML sanitizer | critical |
| SEC-011 | Authorization & RBAC | Allowlisted `admin_users` + RLS | Role field unused for differentiated UI privileges | medium |
| SEC-012 | Rate Limiting | Contact honeypot + client checks | No server-side rate limit on `contact-submit` / auth | high |
| SEC-013 | Input Validation | Entity validators in `admin-queries.ts` | Hand-rolled; no Zod/schema lib | medium |
| SEC-015 | File Upload Security | MIME/size checks in `storage.ts` / `ImageUpload.tsx` | SVG allowed; no magic-byte validation | high |
| SEC-027 | Dependency Pinning | `package-lock.json` locks npm deps | GitHub Actions use version tags, not commit SHAs | medium |

### FAIL (1 item)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| SEC-028 | Branch Protection | No CODEOWNERS; branch protection not verifiable from repo | medium | P2 |

### N/A (8 items)

| Check ID | Item | Reason |
|----------|------|--------|
| SEC-014 | Cookie Security | No first-party session cookies; Supabase manages auth storage |
| SEC-019 | Docker Security | No Dockerfile / container runtime |
| SEC-020 | Container Secrets Management | No containers |
| SEC-021 | Network Segmentation | Static Pages + managed Supabase; no app VPC |
| SEC-022 | Prompt Injection Prevention | No AI/ML runtime |
| SEC-023 | API Key Protection for LLM Services | No LLM keys |
| SEC-024 | Model Access Control | No models |
| SEC-025 | Data Leakage Prevention (AI) | No AI outputs |

---

## Remediation Roadmap

### P0 — Blockers

None.

### P1 — Critical

#### SEC-009: XSS Prevention

**Current state:** Custom markdown sanitization without DOMPurify.
**Required state:** Proven HTML sanitizer on all rendered CMS HTML.
**Fix:** Add `dompurify` (+ types); sanitize in `src/lib/markdown.ts` before `dangerouslySetInnerHTML`.
**Effort:** Short (1–4h)

### P2 — Important

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| SEC-028 | Branch Protection | Enable required reviews + status checks; add CODEOWNERS | Short |
| SEC-005 | Security Headers | Document Pages header limits; tighten CSP | Short |
| SEC-012 | Rate Limiting | Edge rate limit / Supabase Auth rate policies | Medium |
| SEC-015 | File Upload Security | Disallow SVG or sanitize; magic-byte checks | Short |
| SEC-027 | Dependency Pinning | Pin Actions to full commit SHAs | Quick win |
| SEC-006 | CORS | Restrict Supabase allowed origins to prod/staging | Short |
| SEC-011 | Authorization | Use role in admin UI or drop unused column | Short |
| SEC-013 | Input Validation | Adopt Zod shared schemas | Medium |

### P3 — Improvements

None beyond PARTIAL hardening above.

---

## Delta from Previous Audit

| Metric | Previous (2026-07-22) | Current | Change |
|--------|----------------------|---------|--------|
| Score | 66.7% | 75.0% | +8.3 |
| Pass | 8 | 11 | +3 |
| Fail | 2 | 1 | −1 |
| Blockers | 0 | 0 | 0 |

**New passes since last audit:** SEC-001, SEC-002, SEC-026 (gitleaks / Dependabot / audit:ci)
**New fails since last audit:** none (SEC-028 remains FAIL; SEC-002 flipped PASS)

---

## Acceptance Criteria

- [ ] All P0 blockers resolved
- [x] No P0 blockers
- [ ] All P1 critical items resolved or risk-accepted with sign-off (SEC-009 open)
- [x] Quality attribute score >= 50% (Adequate minimum for launch)
- [ ] No critical-severity items in FAIL state (SEC-009 is PARTIAL critical)
