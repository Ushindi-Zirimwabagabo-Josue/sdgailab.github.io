---
schema: sdgqalab/audit@3
layer: "frontend"
layer_type: "astro-react-typescript"
quality_attribute: "observability"
quality_attribute_name: "Observability"
iso_characteristic: "Maintainability"
project: "SDG AI Lab Website"
audited_at: "2026-10-06T14:38:00Z"
config_version: 3

score:
  pass: 2
  partial: 11
  fail: 0
  na: 7
  applicable: 13
  score_pct: 57.7
  rating: "Adequate"

priority_summary:
  p0_blockers: 0
  p1_critical: 1
  p2_important: 0
  p3_improvement: 0

delta:
  previous_audit: "2026-09-28T21:36"
  score_change: 7.7
  new_passes: ["OBS-002"]
  new_fails: []

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: "confirmed"
---

# Observability Audit — Frontend

> **Score**: 57.7% · Adequate
> **Results**: 2 pass · 11 partial · 0 fail · 7 n/a
> **Blockers**: 0 | **Critical (P1)**: 1 | **Important (P2)**: 0
> **Audited**: 2026-09-29
> **Layer**: frontend (astro-react-typescript)
> **ISO Grounding**: Maintainability

---

## Summary

**57.7% Adequate**, zero FAILs. Sentry remains optional (no DSN in use). `TeamRoster` wrapped in `ObservabilityBoundary` with tests. P1 residual: OBS-007 source maps if Sentry enabled.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | Client-side SPA/islands; no app server logs |
| Interfaces | Sentry DSN via `PUBLIC_SENTRY_*`; GA optional; uptime Action |
| Data contracts | Error events scrubbed in `observability.ts` |
| AI/ML behavior | N/A |
| Checkpoint status | confirmed |

---

## Results

### PASS (2 items)

| Check ID | Item | Evidence |
|----------|------|----------|
| OBS-002 | Log Level Configuration | `PUBLIC_LOG_LEVEL` gate in `src/lib/observability.ts`; `.env.example` |
| OBS-006 | Sensitive Data Filtering in Logs | Scrubbing helpers in `src/lib/observability.ts` (tokens/PII redaction before Sentry) |

### PARTIAL (11 items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| OBS-001 | Structured Logging | Console + Sentry breadcrumbs patterns | No JSON structured logger / correlation fields | high |
| OBS-004 | Error Logging with Context | Sentry capture with tags/env | Incomplete context on all query failure paths | medium |
| OBS-005 | Log Aggregation | Sentry project aggregation | No centralized app log shipper (expected for static) | medium |
| OBS-007 | Error Tracking Service | `@sentry/react` init in `observability.ts`; CSP allows `*.sentry.io` | No source maps upload in CI/deploy | high |
| OBS-008 | Error Alerting | Sentry project can alert | Alert rules not documented/verified in-repo | medium |
| OBS-009 | Unhandled Exception Capture | `ObservabilityBoundary` island wrapper | Not proven on every public island mount | high |
| OBS-010 | Application Metrics | GA script `public/scripts/analytics.js` | No app KPI/custom metrics pipeline | medium |
| OBS-012 | Database Monitoring | Supabase dashboard available | No app-owned DB SLO dashboards/runbooks | low |
| OBS-013 | Uptime Monitoring | `.github/workflows/uptime-healthcheck.yml` | Limited to scheduled Action; no multi-region probe | medium |
| OBS-019 | Alerting Rules | Uptime failure fails Action; Sentry capable | No codified alert policy as code | medium |
| OBS-020 | Runbook Links | Ops docs under `docs/` | Alerts do not deep-link to runbooks | low |

### FAIL (0 items)

None.

### N/A (7 items)

| Check ID | Item | Reason |
|----------|------|--------|
| OBS-003 | Request/Response Logging | No owned HTTP API server |
| OBS-011 | Infrastructure Monitoring | Pages/Supabase managed infra |
| OBS-014 | Request Correlation IDs | No multi-service request chain owned by app |
| OBS-015 | Distributed Tracing | No backend service mesh |
| OBS-016 | LLM Call Logging | No AI/ML |
| OBS-017 | AI Pipeline Monitoring | No AI/ML |
| OBS-018 | LLM Cost Tracking | No AI/ML |

---

## Remediation Roadmap

### P0 — Blockers

None.

### P1 — Critical

#### OBS-007: Error Tracking Service (source maps)

**Current state:** Sentry initialized; stack traces lack uploaded source maps in CI/deploy.
**Fix:** Upload source maps in deploy workflow; keep maps private to Sentry.
**Effort:** Short

### P2 — Important

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| OBS-009 | Unhandled Exception Capture | Wrap remaining islands with ObservabilityBoundary | Short |
| OBS-008 / OBS-019 | Alerting | Document Sentry alert rules + uptime pager path | Short |
| OBS-001 | Structured Logging | Thin JSON logger facade for client diagnostics | Medium |

### P3 — Improvements

- OBS-010 custom events for CMS CRUD failures
- OBS-020 link alert payloads to `docs/` runbooks

---

## Delta from Previous Audit

| Metric | Previous (2026-09-28T21:36) | Current | Change |
|--------|----------------------------|---------|--------|
| Score | 50.0% | 57.7% | +7.7 |
| Pass | 1 | 2 | +1 |
| Fail | 1 | 0 | −1 |
| Blockers | 0 | 0 | 0 |

**New passes since last audit:** OBS-002
**New fails since last audit:** none

---

## Acceptance Criteria

- [x] All P0 blockers resolved
- [ ] All P1 critical items resolved or risk-accepted (OBS-007 open)
- [x] No critical-severity FAIL items
- [x] Quality attribute score >= 50%
