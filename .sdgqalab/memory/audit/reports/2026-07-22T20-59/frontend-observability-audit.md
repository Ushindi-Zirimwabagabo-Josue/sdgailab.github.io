---
schema: sdgqalab/audit@3
layer: "frontend"
layer_type: "astro-react-typescript"
quality_attribute: "observability"
quality_attribute_name: "Observability"
iso_characteristic: "Maintainability"
project: "SDG AI Lab Website"
audited_at: "2026-07-22T20:59:00Z"
config_version: 3

score:
  pass: 0
  partial: 5
  fail: 9
  na: 6
  applicable: 14
  score_pct: 17.9
  rating: "Critical"

priority_summary:
  p0_blockers: 0
  p1_critical: 0
  p2_important: 9
  p3_improvement: 0

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: "skipped_unattended"
---

# Observability Audit — Frontend

> **Score**: 17.9% · Critical
> **Results**: 0 pass · 5 partial · 9 fail · 6 n/a

## Summary

This is the **primary production blocker**. The app has basic Google Analytics (`public/scripts/analytics.js`) and a 6-hour uptime GitHub Action, but lacks error tracking, structured logging, log aggregation, and React error boundaries. Failures in production would be invisible except via user reports.

## Project Context Used

- Static client-side app; no server middleware logging surface.
- Uptime workflow: `.github/workflows/uptime-healthcheck.yml`.
- 304 unit/integration tests provide dev-time signal but no runtime telemetry.

## Results

### PASS (0)

No observability checks fully pass.

### PARTIAL (5)

| Check ID | Item | What Passes | What's Missing |
|----------|------|-------------|----------------|
| OBS-006 | Sensitive Data Filtering | Minimal logging reduces leakage | No redaction layer when logging added |
| OBS-008 | Error Alerting | Uptime failures open GitHub issues | No app-error alerting |
| OBS-010 | Application Metrics | GA page/click events when configured | No Web Vitals or error rates |
| OBS-012 | Database Monitoring | Uptime probes Supabase REST | No dashboard alert cadence documented |
| OBS-013 | Uptime Monitoring | External curl checks every 6h | Interval > 5min; no `/health` route |
| OBS-019 | Alerting Rules | Uptime ? GitHub issue labels | No latency/error-rate alerts |
| OBS-020 | Runbook Links | `docs/supabase-hardening-runbook.md` exists | Uptime issues don't link runbooks |

### FAIL (9)

| Check ID | Item | Evidence | Remediation |
|----------|------|----------|-------------|
| OBS-001 | Structured Logging | Only `console.warn` in `supabase.ts` | Add structured client logger |
| OBS-002 | Log Level Configuration | No `LOG_LEVEL` env | Env-driven levels when logging added |
| OBS-004 | Error Logging with Context | UI shows errors; catch blocks don't log | Log with action context, redact PII |
| OBS-005 | Log Aggregation | No ELK/Datadog/Loki | Integrate error service + Supabase logs |
| OBS-007 | Error Tracking Service | No Sentry/Bugsnag in `package.json` | Add `@sentry/react` with env DSN |
| OBS-009 | Unhandled Exception Capture | No `ErrorBoundary` in `AdminApp.tsx` | Wrap admin + key islands |

### N/A (6)

Request/response logging, distributed tracing, correlation IDs, infrastructure/container monitoring — not applicable to static GitHub Pages deployment.

## Recommendations

1. **[P1]** Integrate Sentry (or equivalent) + React ErrorBoundary in `AdminApp.tsx`.
2. **[P1]** Add structured error logging wrapper for admin mutations and auth flows.
3. **[P2]** Increase uptime check frequency; link alerts to runbooks.
4. **[P2]** Report Web Vitals alongside GA.
