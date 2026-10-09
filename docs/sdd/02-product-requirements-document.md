# Product Requirements Document (PRD)

## SDG AI Lab Website Revamp

| Field | Value |
|-------|-------|
| **Document version** | 0.1.0 (Draft) |
| **Date** | February 2026 |
| **Status** | Awaiting client input |
| **Owner** | SDG AI Lab Development Team |
| **Stakeholders** | _TBD -- see Section 7 of client questionnaire_ |

---

## 1. Executive Summary

The SDG AI Lab website ([sdgailab.org](https://sdgailab.org)) is being revamped to address outdated content (last updated mid-2021), modernize the design and technology stack, and better represent the lab's current work and organizational position under UNDP's Digital, AI and Innovation Hub (since 2025).

This PRD captures the baseline state of the site, defines the scope of the revamp, and will be updated with confirmed requirements once client questionnaire responses are received.

---

## 2. Background and Current State

### 2.1 What is SDG AI Lab?

A joint initiative of UNDP's Bureau for Policy and Programme Support (BPPS) and the Sustainable Finance Hub, hosted under UNDP IICPSD in Istanbul, Turkey. Established in 2019. Since 2025, operating under UNDP's Digital, AI and Innovation Hub. The lab provides AI/ML research and advisory support for sustainable development.

### 2.2 Current Site Audit

| Dimension | Current State | Issue |
|-----------|--------------|-------|
| **Pages** | 6 static HTML files (Home, About Us, Advisory Board, Projects, Newsroom, Contact Us) | No templating; nav/footer duplicated across all files |
| **Tech stack** | Bootstrap 5, jQuery, particles.js, AOS, Font Awesome, Simple Line Icons, Typicons | No build system, no package manager, no framework |
| **Hosting** | GitHub Pages (sdgailab.github.io) with CNAME to sdgailab.org | No CI/CD beyond GitHub Pages auto-deploy |
| **Content freshness** | Last substantive update: June 2021 (v0.1.1) | 5-year-old project descriptions, newsroom articles from 2020-2021 |
| **SEO** | No meta descriptions, no Open Graph tags, no structured data, no sitemap.xml, no robots.txt | Invisible to search engines and social sharing |
| **Analytics** | None | Zero visibility into traffic or user behavior |
| **Contact form** | `mailto:` action -- opens email client, no server submission | Unreliable; loses submissions silently |
| **Accessibility** | Recent improvements (PR #60) but no formal standard targeted | No WCAG compliance claim |
| **Performance** | 12 CSS files, 10+ JS files loaded synchronously; both particles.js AND particles.min.js loaded | Redundant loads, no bundling, no minification pipeline |
| **Social links** | Twitter follow button (still says "Twitter", not "X"), GitHub follow button | Outdated branding |
| **Mobile** | Responsive via Bootstrap grid, but not mobile-first designed | Functional but not optimized |

### 2.3 Codebase Structure

```
sdgailab.github.io/
  index.html              # Homepage with particles.js hero
  about-us.html           # Lab description and team structure (roles only, no names)
  advisory-board.html     # 8 board members with photos
  active-projects.html    # 5 project cards (content from ~2021)
  newsroom.html           # 5 external article links (2020-2021)
  contact-us.html         # mailto: form
  CNAME                   # sdgailab.org
  README.md               # Version history (v0.1.0, v0.1.1)
  assets/
    bootstrap/            # Bootstrap CSS + JS (local)
    css/                  # 8 CSS files (style.css + component-specific)
    js/                   # 10 JS files (jQuery, particles, AOS, theme, etc.)
    fonts/                # Font Awesome, Simple Line Icons, Typicons
    img/                  # Logo, hero image, partner logos, board photos, news images
  icons/                  # Favicons, webmanifest, browserconfig
```

### 2.4 Git Branch Landscape

| Branch | Purpose |
|--------|---------|
| `main` | Production (current live site) |
| `new-version` | **Active revamp branch** (current work) |
| `develop` | Development integration |
| `blog-style-newsroom` | Prior exploration: blog-style newsroom layout |
| `nav-colors` | Prior exploration: navigation color scheme |
| `harmonize-fonts` | Merged: font standardization to Open Sans |
| `improve-accessibility-and-code-quality` | Merged: accessibility + code quality fixes |
| `fix/html-validation-errors` | Merged: HTML validation |
| `feat/dynamic-copyright-year` | Merged: dynamic copyright year |
| `fix-ids-duplicates` | Merged: duplicate ID removal |

---

## 3. Goals

> _To be confirmed by client. Draft goals based on site audit:_

| # | Goal | Priority | Status |
|---|------|----------|--------|
| G1 | Update all content to reflect current (2026) state of the lab | **Must have** | _Awaiting confirmation_ |
| G2 | Modernize visual design and UX | **Must have** | _Awaiting confirmation_ |
| G3 | Migrate to a component-based framework with build pipeline | **Should have** | _Awaiting confirmation_ |
| G4 | Add SEO metadata (descriptions, OG tags, structured data) | **Should have** | _Awaiting confirmation_ |
| G5 | Implement a working contact form with server-side submission | **Should have** | _Awaiting confirmation_ |
| G6 | Add analytics tracking | **Should have** | _Awaiting confirmation_ |
| G7 | Integrate CMS for non-technical content updates | **Could have** | _Awaiting confirmation_ |
| G8 | Add interactive features (AI showcase, impact dashboard) | **Could have** | _Awaiting confirmation_ |

---

## 4. Target Audience

> _To be confirmed by client. Preliminary audience mapping:_

| Audience | Needs | Priority |
|----------|-------|----------|
| **Partner organizations** (UN agencies, GEF, Global Fund, etc.) | Understand the lab's capabilities, see active projects, find contact info | _TBD_ |
| **Volunteer data scientists** | Learn about volunteer opportunities, understand the engagement model, apply | _TBD_ |
| **UNDP internal teams** | Discover how the lab can support their projects, request collaboration | _TBD_ |
| **Academic researchers** | Access publications, datasets, open-source tools | _TBD_ |
| **Donors / funders** | See impact metrics, understand the lab's value proposition | _TBD_ |
| **General public** | Learn what SDG AI Lab does, browse news | _TBD_ |

---

## 5. Functional Requirements

### 5.1 Must Have (Baseline)

| ID | Requirement | Notes |
|----|-------------|-------|
| FR-01 | All pages render correctly on desktop, tablet, and mobile | Mobile-first responsive design |
| FR-02 | Navigation works across all pages with consistent structure | Currently duplicated HTML; should use shared component |
| FR-03 | Homepage communicates the lab's mission and key offerings | Current hero + approach sections as baseline |
| FR-04 | Projects page displays current project portfolio | Content update required from client |
| FR-05 | About Us page describes the lab, its organizational placement, and team | Content update required from client |
| FR-06 | Contact form submits data reliably to a backend | Replace current mailto: with real form handler |
| FR-07 | Footer contains current social media links and copyright | Update Twitter to X; confirm other channels |

### 5.2 Should Have

| ID | Requirement | Notes |
|----|-------------|-------|
| FR-08 | SEO metadata on all pages (title, description, OG tags, canonical URLs) | Currently absent entirely |
| FR-09 | Analytics integration | Platform TBD by client |
| FR-10 | Performance-optimized build (bundled CSS/JS, minification, image optimization) | Current: 22+ unoptimized asset loads |
| FR-11 | Accessibility compliance (WCAG 2.1 AA target) | Level TBD by client |
| FR-12 | Newsroom with current articles | On-site hosting vs. external links TBD |
| FR-13 | Advisory Board page with verified, current member information | Content update required from client |
| FR-14 | Updated partner/supporter logos | Verification required from client |

### 5.3 Could Have

| ID | Requirement | Notes |
|----|-------------|-------|
| FR-15 | CMS for non-technical content updates | Tool and approach TBD |
| FR-16 | Blog / on-site article hosting | Depends on newsroom strategy |
| FR-17 | Publications / Resources page | Depends on client interest |
| FR-18 | Volunteer application portal | Depends on client interest |
| FR-19 | AI Showcase page with embedded demos | Depends on client interest |
| FR-20 | Impact metrics / dashboard | Depends on client interest |
| FR-21 | SDG icon tagging on projects | Depends on client interest |
| FR-22 | Newsletter subscription | Depends on client interest |
| FR-23 | Search functionality | Depends on content volume |
| FR-24 | Dark mode | Depends on client interest |
| FR-25 | Multilingual support | Depends on client requirement |

---

## 6. Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01 | Page load time (Largest Contentful Paint) | < 2.5 seconds on 3G |
| NFR-02 | Lighthouse Performance score | >= 90 |
| NFR-03 | Lighthouse Accessibility score | >= 90 |
| NFR-04 | Lighthouse SEO score | >= 90 |
| NFR-05 | Browser support | Last 2 versions of Chrome, Firefox, Safari, Edge |
| NFR-06 | Uptime | 99.9% (GitHub Pages SLA) |
| NFR-07 | Deployment | Automated via CI/CD on push to main branch |
| NFR-08 | Code maintainability | Component-based architecture, linted, formatted |

---

## 7. Constraints

| Constraint | Details |
|------------|---------|
| **Domain** | Must retain sdgailab.org (CNAME currently configured) |
| **Branding** | Must comply with UNDP guidelines (if applicable -- awaiting confirmation) |
| **Budget** | _TBD -- awaiting client input_ |
| **Hosting** | _TBD -- GitHub Pages is default; alternatives under consideration_ |
| **Content ownership** | Content must be provided/approved by SDG AI Lab team |

---

## 8. Success Metrics

> _To be confirmed by client. Proposed metrics:_

| Metric | Baseline (Current) | Target |
|--------|-------------------|--------|
| Lighthouse Performance | _Not measured_ | >= 90 |
| Lighthouse Accessibility | _Not measured_ | >= 90 |
| Lighthouse SEO | _Not measured_ | >= 90 |
| Contact form submissions / month | 0 (form is broken) | _TBD_ |
| Monthly unique visitors | Unknown (no analytics) | _TBD_ |
| Average session duration | Unknown | _TBD_ |
| Volunteer inquiries / month | Unknown | _TBD_ |

---

## 9. Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Content not delivered on time by client | Delays launch | High | Establish content pipeline with deadlines early; use placeholder content for development |
| Scope creep from "could have" features | Delays launch, increases cost | Medium | Strict phased approach; lock scope per phase |
| UNDP branding constraints discovered late | Rework of design | Medium | Ask about branding in questionnaire (Q1.4); research UNDP design standards proactively |
| Partner logo / advisory board political sensitivity | Diplomatic issues | Low | Require explicit client sign-off on every logo and name |
| Chosen tech stack unfamiliar to maintainers | Long-term maintenance burden | Medium | Choose framework with good documentation and wide adoption; document everything |

---

## 10. Open Questions

These map directly to the client questionnaire and will be resolved upon receiving responses:

1. Primary driver and KPIs for the revamp (Q1.1, Q1.6)
2. Target audience prioritization (Q1.2)
3. Sitemap expansion or consolidation (Q2.1)
4. Project, advisory board, and partner content updates (Q2.2, Q2.4, Q2.7)
5. Newsroom strategy: on-site vs. external (Q2.3)
6. Team member visibility: named bios vs. role-only (Q2.5)
7. Framework / SSG selection (Q4.1)
8. CMS requirement (Q4.2)
9. Hosting platform (Q4.3)
10. Analytics platform (Q4.5)
11. Budget constraints (Q6.4)
12. Timeline and phasing (Q6.1, Q6.3)
13. Approval chain and review cadence (Q7.1, Q7.2)

---

## Appendix A: Content Inventory

| Page | Content Items | Last Updated | Action Needed |
|------|--------------|--------------|---------------|
| **Home** | Hero tagline, "Our Approach" (5 points), "Volunteer Data Scientist Initiative" (4 boxes), Partner logos (12+) | ~2021 | Verify all text; update partner logos |
| **About Us** | Lab description paragraph, Team structure (5 generic roles, no names/photos) | ~2021 (text updated to mention 2025 change) | Verify text; decide on named team members |
| **Advisory Board** | 8 member cards with photos, names, titles | ~2021 | Verify all members are current |
| **Active Projects** | 5 project cards with descriptions | ~2021 | Major update needed; identify active vs. completed |
| **Newsroom** | 5 article cards linking to external IICPSD pages | 2020-2021 | Add recent news; decide hosting strategy |
| **Contact Us** | Form (name, email, comments) with mailto: action | ~2021 | Replace with working form backend |
| **Footer** (all pages) | Twitter button, GitHub button, copyright | ~2021 | Update Twitter to X; add other channels |
| **Navigation** (all pages) | 6-item nav: Home, About Us, Advisory board, projects, Newsroom, Contact Us | ~2021 | Fix capitalization inconsistency ("projects" lowercase) |

---

_This document will be updated to version 1.0.0 once client questionnaire responses are incorporated._
