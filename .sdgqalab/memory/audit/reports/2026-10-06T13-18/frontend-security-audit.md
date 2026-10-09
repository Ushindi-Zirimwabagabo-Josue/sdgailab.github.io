---
schema: sdgqalab/audit@3
layer: "frontend"
layer_type: "astro-react-typescript"
quality_attribute: "security"
quality_attribute_name: "Security"
iso_characteristic: "Security"
project: "SDG AI Lab Website"
audited_at: "2026-10-06T13:18:00Z"
config_version: 3

score:
  pass: 13
  partial: 7
  fail: 0
  na: 8
  applicable: 20
  score_pct: 82.5
  rating: "Solid"

priority_summary:
  p0_blockers: 0
  p1_critical: 1
  p2_important: 0
  p3_improvement: 0

delta:
  previous_audit: "2026-09-29T01:24"
  score_change: 0
  new_passes: ["SEC-006", "SEC-009"]
  new_fails: []

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: "confirmed"
---

# Security Audit — Frontend

> **Score**: 82.5% · Solid
> **Results**: 13 pass · 7 partial · 0 fail · 8 n/a
> **Blockers**: 0 | **Critical (P1)**: 1 | **Important (P2)**: 0
> **Audited**: 2026-09-29
> **Layer**: frontend (astro-react-typescript)
> **ISO Grounding**: Security

---

## Summary

**82.5% Solid**, zero FAILs. **SEC-001** now uses gitleaks **8.24.2 CLI** + `.gitleaks.toml` (works on free org repos without `GITLEAKS_LICENSE`). Residual: SEC-028 branch protection ops-applied; SEC-012 server-side rate limits; HTTP security headers on Pages (SEC-005).

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | Static Astro + React islands; Supabase Auth/RLS/Storage (`astro.config.mjs`, `src/lib/supabase.ts`) |
| Interfaces | Public pages `src/pages/`; admin `#/` SPA; `contact-submit` edge function |
| Data contracts | `src/lib/types.ts`; validators in `src/lib/admin-queries.ts`; migrations `001`–`012` |
| AI/ML behavior | N/A |
| Checkpoint status | confirmed |

---

## Results

### PASS (13 items)

| Check ID | Item | Evidence |
|----------|------|----------|
| SEC-001 | Secrets in Source Control | `.env` gitignored; `gitleaks detect` in `.github/workflows/test.yml`; `.gitleaks.toml` allowlists |
| SEC-002 | Dependency Vulnerability Scanning | `npm run audit:ci` + Dependabot (`.github/dependabot.yml`) |
| SEC-003 | Environment Variable Management | `.env.example`; `PUBLIC_*` via `import.meta.env`; deploy secrets |
| SEC-004 | HTTPS Enforcement | Site `https://sdgailab.org`; CSP `upgrade-insecure-requests` in `BaseLayout.astro` |
| SEC-006 | CORS Configuration | `CONTACT_ALLOWED_ORIGINS` allowlist in `supabase/functions/contact-submit/index.ts` |
| SEC-007 | CSRF Protection | Supabase JWT bearer; no cookie session CSRF surface |
| SEC-008 | SQL Injection Prevention | Supabase query builder + RLS (`003_secure_editor_access.sql`) |
| SEC-009 | XSS Prevention | DOMPurify in `src/lib/markdown.ts` before HTML render |
| SEC-010 | Authentication Implementation | Magic link + PKCE/hash (`LoginPage.tsx`, `auth-callback.ts`, `AuthProvider.tsx`) |
| SEC-016 | API Authentication | RLS `is_admin_user()`; anon key only for public reads |
| SEC-017 | API Input Sanitization | Hand validators before writes in `admin-queries.ts` |
| SEC-018 | API Response Data Filtering | Explicit `.select()`; `magic-link-errors.ts` scrubbed messages |
| SEC-026 | CI/CD Secrets Management | GitHub Actions secrets for deploy/Sentry; no secrets in workflows |

### PARTIAL (7 items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| SEC-005 | Security Headers | CSP meta in `BaseLayout.astro` / `admin.astro` | Platform-level HSTS/XFO/Referrer-Policy not fully asserted on Pages | high |
| SEC-011 | Authorization & RBAC | Allowlisted `admin_users` + RLS | Role field unused for differentiated UI privileges | medium |
| SEC-012 | Rate Limiting | Contact honeypot + client checks | No server-side rate limit on `contact-submit` / auth | high |
| SEC-013 | Input Validation | Entity validators in `admin-queries.ts` | Hand-rolled; no Zod/schema lib | medium |
| SEC-015 | File Upload Security | MIME/size checks in `storage.ts` / `ImageUpload.tsx` | SVG allowed; no magic-byte validation | high |
| SEC-027 | Dependency Pinning | `package-lock.json` locks npm deps | GitHub Actions use version tags, not commit SHAs | medium |
| SEC-028 | Branch Protection | `.github/CODEOWNERS`; `docs/branch-protection.md` | GitHub branch-protection settings still operator-applied / unverifiable in-repo | medium |

### FAIL (0 items)

None.

### N/A (8 items)

| Check ID | Item | Reason |
|----------|------|--------|
| SEC-014 | Cookie Security | No first-party session cookies; Supabase manages auth storage |
| SEC-019 | Docker Security | Preview Dockerfile only; not production runtime |
| SEC-020 | Container Secrets Management | No production containers |
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

#### SEC-028: Branch Protection (ops residual)

**Current state:** CODEOWNERS + runbook present; live GitHub protection not evidenced from repo alone.
**Fix:** Enable required reviews + status checks per `docs/branch-protection.md`; capture screenshot/settings export in ops log.
**Effort:** Short

### P2 — Important

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| SEC-005 | Security Headers | Document Pages header limits; tighten CSP | Short |
| SEC-012 | Rate Limiting | Edge rate limit / Supabase Auth rate policies | Medium |
| SEC-015 | File Upload Security | Disallow SVG or sanitize; magic-byte checks | Short |
| SEC-027 | Dependency Pinning | Pin Actions to full commit SHAs | Quick win |
| SEC-011 | Authorization | Use role in admin UI or drop unused column | Short |
| SEC-013 | Input Validation | Adopt Zod shared schemas | Medium |

### P3 — Improvements

None beyond PARTIAL hardening above.

---

## Delta from Previous Audit

| Metric | Previous (2026-09-28T21:36) | Current | Change |
|--------|----------------------------|---------|--------|
| Score | 75.0% | 82.5% | +7.5 |
| Pass | 11 | 13 | +2 |
| Fail | 1 | 0 | −1 |
| Blockers | 0 | 0 | 0 |

**New passes since last audit:** SEC-006 (CORS allowlist), SEC-009 (DOMPurify)
**New fails since last audit:** none (SEC-028 FAIL → PARTIAL)

---

## Acceptance Criteria

- [x] All P0 blockers resolved
- [ ] All P1 critical items resolved or risk-accepted with sign-off (SEC-028 open)
- [x] Quality attribute score >= 50%
- [x] No critical-severity items in FAIL state
