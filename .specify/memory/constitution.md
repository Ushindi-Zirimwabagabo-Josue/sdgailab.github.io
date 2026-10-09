# SDG AI Lab Website Revamp Constitution (SDD)

This constitution is the project’s single source of truth for **non-negotiables**, **decisions**, and **default assumptions** for the SDG AI Lab website revamp.

## Core Principles

### 1) Spec-Driven Development (SDD) First
- Work is driven by the artifacts in `docs/sdd/` (questionnaire → PRD → IA → ADR → wireframes → scaffold → content pipeline → detailed spec).
- Implementation must map back to an explicit requirement and acceptance criteria (no “random improvements”).
- When requirements change, update the relevant `docs/sdd/*` artifact(s) before changing code.

### 2) Dynamic-First Content (Non-Technical Editors)
- **Almost all content is dynamic** and managed in **Supabase** so non-technical users can update it immediately (no redeploy required).
- The site uses **runtime client-side reads** from Supabase for CMS-driven content.
- “Immediate update” definition: editors publish in Supabase → site reflects changes on refresh (seconds).

### 3) Security by Design (RLS is Non-Negotiable)
- The Supabase **anon key is public** (shipped to the browser). Security relies on:
  - **Row Level Security (RLS)** enabled on every public table.
  - Public users can only `SELECT` rows where `status='published'` (or `published=true`).
  - Writes (`INSERT/UPDATE/DELETE`) are restricted to authenticated editor roles only.
- Public storage (images/logos/headshots) must be in explicitly public buckets; sensitive assets must never be publicly accessible.

### 4) Accessibility + Mobile-First (WCAG 2.1 AA)
- Target standard: **WCAG 2.1 AA**.
- Mobile-first responsive design is required.
- No content or functionality may depend solely on hover, color, or mouse input.

### 5) Design Continuity (Modernize Without Rebranding)
- Preserve the current SDG AI Lab “look and feel” while modernizing implementation.
- **Particles hero remains** (particles.js) for now.
- Dark mode is **not** required.
- Multilingual support is **not** required now, but the architecture should not block it later.

### 6) Cost Discipline (Free / Open-Source Only)
- Assume free/open-source tooling and services.
- Supabase is acceptable under its free tier (within limits).

## Technology & Architecture Decisions (Current)

### Frontend
- **Framework**: Astro (static site shell + islands for dynamic content).
- **Styling**: Tailwind CSS (recreate the current design).
- **Hosting**: GitHub Pages (retain `CNAME` for `sdgailab.org`).
- **Analytics**: Google Analytics 4 is acceptable. Add cookie consent if required by policy.

### CMS / Data Layer
- **CMS**: Supabase-backed (Supabase Studio used as the editing UI initially).
- **Read pattern**: runtime reads in the browser (not build-time sync).
- **Publish workflow**: every content entity uses a publish gate:
  - recommended: `status` in `{draft, published, archived}` plus `published_at`.

### Forms
- Contact form backend is not required initially; `mailto:` is acceptable for Phase 1.
- If/when a reliable submission pipeline is needed, prefer storing submissions in Supabase (with strict RLS) or using a free form service.

## Content / IA Decisions (Current)

### Homepage content strategy
- Prioritize **impact statistics cards** (and optionally a simple world map visualization) over long explanatory text blocks.
- “Our Approach” should live primarily on the **About** page.
- “Volunteer Data Scientist Initiative” should be a dedicated **Volunteer/Volunteering with us** page.

### Projects
- Projects must show at least a **status indicator**.
- Supported statuses (default): `active`, `completed`, `under_development`, `on_hold`.
- “Deployed/not deployed” is a separate dimension and should be modeled separately if needed (not as a status).

### Newsroom
- News should be updated and can be hosted on-site as dynamic content.
- SEO/social previews for detail pages are **not important for now**.

### People (Team + Advisory Board)
- Default decision: keep both **Team** and **Advisory Board** as dynamic data sets (a single `people` model with grouping is acceptable).
- If the Advisory Board page is later removed, the data model should still allow showing board members in other contexts.

## Non-Goals (For Now)
- Search is not required (may be added later).
- Heavy dashboards/interactive analytics are not required (only lightweight stats + optional simple map).
- Staging/preview environments are not required.
- Formal weekly review cadence is not required (ad-hoc review is acceptable).

## Workflow & Quality Gates
- Branch: work continues on `new-version`.
- Must maintain:
  - Mobile responsiveness across core breakpoints
  - WCAG 2.1 AA adherence for new UI
  - Safe Supabase access patterns (RLS, published gating)
  - Performance appropriate for bandwidth-constrained users (avoid unnecessary large client bundles)

## Governance
- This constitution supersedes informal discussions.
- Any change to core decisions (hosting, CMS model, dynamic-vs-static approach, accessibility target, analytics) must be recorded by updating:
  - `docs/sdd/04-architecture-decision-record.md` (ADR), and
  - any impacted specs in `docs/sdd/08-detailed-spec.md`.
- When uncertain, choose the simplest approach that preserves: **instant content updates**, **RLS safety**, **mobile-first**, and **WCAG AA**.

**Version**: 1.0.0 | **Ratified**: 2026-02-22 | **Last Amended**: 2026-02-22
