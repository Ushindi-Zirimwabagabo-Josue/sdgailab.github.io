---
schema: sdgqalab/audit@3
layer: "frontend"
layer_type: "astro-react-typescript"
quality_attribute: "observability"
quality_attribute_name: "Observability"
iso_characteristic: "Maintainability"
project: "SDG AI Lab Website"
audited_at: "2026-09-28T21:36:00Z"
config_version: 3

score:
  pass: 1
  partial: 11
  fail: 1
  na: 7
  applicable: 13
  score_pct: 50.0
  rating: "Adequate"

priority_summary:
  p0_blockers: 0
  p1_critical: 0
  p2_important: 1
  p3_improvement: 0

delta:
  previous_audit: '2026-07-22T20:59'
  score_change: 32.1
  new_passes: ['OBS-006']
  new_fails: []

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: "skipped_unattended"
---
# Observability Audit — Frontend

> **Score**: 50.0% · Adequate
> **Results**: 1 pass · 11 partial · 1 fail · 7 n/a
> **Blockers**: 0 | **Critical (P1)**: 0 | **Important (P2)**: 1
> **Audited**: 2026-09-28
> **Layer**: frontend (astro-react-typescript)
> **ISO Grounding**: Maintainability

---

## Summary

Observability exited **Critical (17.9%)** and is now **Adequate (50.0%)** after adding Sentry (`@sentry/react`, `src/lib/observability.ts`) and `ObservabilityBoundary`. Scrubbing passes (OBS-006). Remaining gaps: no `LOG_LEVEL` (OBS-002 FAIL), Sentry without source maps, thin metrics/alerting/runbook linkage.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | Client-side SPA/islands; no app server logs |
| Interfaces | Sentry DSN via `PUBLIC_SENTRY_*`; GA optional; uptime Action |
| Data contracts | Error events scrubbed in `observability.ts` |
| AI/ML behavior | N/A |
| Checkpoint status | skipped_unattended |

---

## Results

### PASS (1 item)

| Check ID | Item | Evidence |
|----------|------|----------|
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

### FAIL (1 item)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| OBS-002 | Log Level Configuration | No `LOG_LEVEL` / `PUBLIC_LOG_LEVEL` env or logger level gate | medium | P2 |

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

None (no critical FAIL). Continue hardening PARTIAL OBS-007 source maps as high priority.

### P2 — Important

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| OBS-002 | Log Level Configuration | Add `PUBLIC_LOG_LEVEL` gate around console helpers | Quick win |
| OBS-007 | Error Tracking Service | Upload source maps in deploy workflow | Short |
| OBS-009 | Unhandled Exception Capture | Wrap remaining islands with ObservabilityBoundary | Short |
| OBS-008 / OBS-019 | Alerting | Document Sentry alert rules + uptime pager path | Short |
| OBS-001 | Structured Logging | Thin JSON logger facade for client diagnostics | Medium |

### P3 — Improvements

- OBS-010 custom events for CMS CRUD failures
- OBS-020 link alert payloads to `docs/` runbooks

---

## Delta from Previous Audit

| Metric | Previous | Current | Change |
|--------|----------|---------|--------|
| Score | 17.9% | 50.0% | +32.1 |
| Pass | 0 | 1 | +1 |
| Fail | 9 | 1 | −8 |
| Rating | Critical | Adequate | ↑ |
| Blockers | 0 | 0 | 0 |

**New passes since last audit:** OBS-006
**New fails since last audit:** none (OBS-002 remains the sole FAIL; former OBS FAILs moved to PARTIAL via Sentry)

---

## Acceptance Criteria

- [x] All P0 blockers resolved
- [x] No critical-severity FAIL items
- [x] Quality attribute score >= 50%
- [x] Domain exited Critical rating band
