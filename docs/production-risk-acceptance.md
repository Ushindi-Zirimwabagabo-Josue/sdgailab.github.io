# SDG AI Lab Website — Production Risk Acceptance (Staging → Production)

**Document purpose:** Record conscious acceptance of known gaps identified by the SDG AI Lab QA Kit audit (`sdgqalab-audit`, 2026-10-06) and operational sign-off (`docs/supabase-c1-staging-signoff.md`, **C1 complete** on staging).

**Scope:** Public site (GitHub Pages) + browser admin CMS (Supabase Auth, Postgres, Storage). **Not in scope:** custom application servers, AI/ML inference, multi-region IaC.

**Audit summary:** **73.1% Solid · CONDITIONALLY READY** · 0 P0 blockers · 0 critical-severity **FAIL** items on security/data controls that gate editor/public access.

---

## 1. What we assert is in good shape

| Area | Evidence |
|------|----------|
| **Editor access** | Magic link only; `admin_users` allowlist; RLS `is_admin_user()` on all CMS tables and `public-assets` storage |
| **Public data exposure** | Anon reads limited to published rows; verified via `supabase/verify_c1_hardening.sql` |
| **Application security** | DOMPurify on markdown HTML; CSP meta tags; contact edge CORS allowlist; no service-role key in frontend |
| **Supply chain / CI** | `npm run check`, lint, Vitest (412), Playwright, `npm audit:ci`, gitleaks CLI (`.gitleaks.toml`) |
| **Staging operations** | C1 signed off 2026-10-06 (`docs/supabase-c1-staging-signoff.md`) |

**Staging URL (current):** `https://sdg-ai-lab.github.io/sdgailab.github.io/`  
**Target production URL (C2):** `https://sdgailab.org`

---

## 2. Accepted risks (documented, not blocking staging)

These items score **FAIL** or low % in the audit because the **checklist targets enterprise patterns** we deliberately do not use for this architecture.

| ID / theme | Finding | Why it is accepted | Compensating control |
|------------|---------|--------------------|----------------------|
| **FLX-008** | No async task queue | Static site; no background workers | GitHub Actions + Supabase only |
| **FLX-015** | No cloud IaC (Terraform, etc.) | Hosting is GitHub Pages + Supabase dashboard | Versioned migrations in git; manual Supabase ops |
| **INT-014** | No internationalization | English-only institutional site | Product decision |
| **MNT-011** | No pre-commit hooks | Hooks optional when CI enforces quality | `.github/workflows/test.yml` on every PR/push |
| **OBS (low score)** | Limited APM / no Sentry DSN in use | Static client; optional Sentry | Uptime workflow; `ObservabilityBoundary` + scrubbed logging if DSN added later |
| **REL-013 / DOC-013** | Manual backups only (Supabase **free tier**) | No PITR on plan | `docs/supabase-backup-restore.md` + C1 §F; export before C2 and major migrations |

**Acceptance statement:** The SDG AI Lab team accepts the risks above for **staging and for production launch** unless/until budget or policy requires Supabase Pro backups, Sentry, or full IaC.

---

## 3. Partial controls — known gaps with mitigations

| Theme | Gap | Mitigation today | Before / at C2 |
|-------|-----|------------------|----------------|
| **SEC-005** | Platform HTTP headers (HSTS, etc.) not fully configurable on GitHub Pages | CSP + `upgrade-insecure-requests` in `BaseLayout.astro` | Confirm headers on `sdgailab.org` after cutover |
| **SEC-012** | No custom API gateway rate limits | Supabase Auth rate limits; client throttles; contact honeypot | Tighten Supabase limits; optional edge rate limit on `contact-submit` |
| **SEC-028** | Branch protection not verifiable in-repo | `CODEOWNERS`, `docs/branch-protection.md` | Apply branch protection in GitHub org settings |
| **DQ-013** | Contact PII retention not proven in ops logs | `docs/contact-form/pii-retention.md`, purge SQL | Run/schedule purge per policy; record date in ops log |
| **DOC-011** | No single incident-response playbook | Hardening, cutover, backup docs | Add short IR doc linking uptime + Supabase + editor revoke steps |

---

## 4. Required before production cutover (C2)

Not optional for go-live on **sdgailab.org**:

1. Complete **`docs/production-cutover-checklist.md`** (DNS, `GITHUB_PAGES_BASE=/`, Supabase Site URL, uptime target).
2. **Manual Supabase export** immediately before cutover (free tier).
3. **Smoke test** on production: public pages, magic-link admin, one CRUD + upload.
4. Close or explicitly accept **DQ-013** and **SEC-028** with named owner and date.

Observability uplift (Sentry DSN, source maps) is **recommended**, not required for cutover.

---

## 5. Sign-off

| Role | Name | Acceptance (Accepted / Not applicable) | Date |
|------|------|----------------------------------------|------|
| Technical lead | | | |
| Product / programme owner | | | |

**References**

- Audit: `.sdgqalab/memory/audit/executive-summary.md` (2026-10-06T14:38 UTC)
- C1: `docs/supabase-c1-staging-signoff.md`
- Cutover: `docs/production-cutover-checklist.md`
- Backups: `docs/supabase-backup-restore.md`
