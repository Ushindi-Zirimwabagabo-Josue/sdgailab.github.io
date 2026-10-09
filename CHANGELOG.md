# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
for the application package version in `package.json`.

## [Unreleased]

### Added

- ESLint flat config and CI lint gate (`npm run lint`)
- Optional Docker preview image (`Dockerfile`) and [deployment runtime notes](docs/deployment-runtime.md)
- Contact enquiry PII retention policy and purge script ([docs/contact-form/pii-retention.md](docs/contact-form/pii-retention.md))
- Short-TTL client cache for public CMS reads
- DOMPurify sanitization for rendered markdown HTML
- `PUBLIC_LOG_LEVEL` for DEV console verbosity
- Contributor guide ([CONTRIBUTING.md](CONTRIBUTING.md))
- CODEOWNERS + [branch protection checklist](docs/branch-protection.md)
- Server-side pagination for admin lists and public news (load more); public list caps
- Contact-submit CORS allowlist (`CONTACT_ALLOWED_ORIGINS`)

### Changed

- Image/video replace uploads new asset before deleting the old one
- Backup/restore docs: RTO/RPO targets and operator verification checklist
- Contact edge function no longer defaults notification mail to a personal address

### Removed

- Geographic reach feature from application code (optional DB drop: `supabase/migrations/012_drop_geographic_reach.sql`)

## [2.0.0] - 2026-07-23

Major CMS and public-site refresh (package version `2.0.0`).

### Added

- Dynamic CMS on Supabase (projects, news, people, partners, statistics, page content)
- Admin panel at `/admin` with magic-link auth and allowlisted editors
- Publications and evolution timeline CMS entities
- Contact form → Supabase Edge Function pipeline
- Vitest + Playwright CI, Dependabot, gitleaks, npm audit gate
- Sentry client observability (`@sentry/react`)
- Marina-aligned public redesign (navigation, hero, projects, research, credibility)

### Changed

- Static Astro 5 + React 19 islands on GitHub Pages
- Staging deploy via `new-version` → GitHub Pages; production target `sdgailab.org`

### Security

- RLS-backed editor access (`admin_users`)
- Markdown escape + sanitize path for CMS HTML rendering
- Client rate limiting helpers for admin actions

[Unreleased]: https://github.com/SDG-AI-Lab/sdgailab.github.io/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/SDG-AI-Lab/sdgailab.github.io/releases/tag/v2.0.0
