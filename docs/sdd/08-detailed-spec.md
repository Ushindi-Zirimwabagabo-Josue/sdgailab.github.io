# Detailed Specification (SDD)

## SDG AI Lab Website Revamp

| Field | Value |
|-------|-------|
| **Document version** | 0.1.0 (Draft) |
| **Date** | February 2026 |
| **Status** | Draft -- acceptance criteria to be validated after client input |

---

## Overview

This document specifies the functional behavior, content requirements, and acceptance criteria for each page and feature of the revamped SDG AI Lab website. It is the core artifact of the Spec Driven Development (SDD) process: each item here will be built to this spec, reviewed against these criteria, and signed off before moving to the next.

**References:**
- [PRD](02-product-requirements-document.md) -- requirements and constraints
- [IA](03-information-architecture.md) -- sitemap and navigation
- [ADR](04-architecture-decision-record.md) -- tech stack decisions
- [Wireframes](05-wireframes.md) -- structural layouts
- [Scaffold](06-project-scaffold.md) -- project setup
- [Content Pipeline](07-content-pipeline.md) -- content delivery tracker

---

## SPEC-001: Base Layout

### Purpose
Shared HTML structure wrapping every page: `<head>` metadata, navigation, footer, analytics script, and global styles.

### Requirements
- Render correct `<title>` per page (format: `Page Name - SDG AI Lab`)
- Include meta description per page (unique, 150-160 characters)
- Include Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- Include Twitter Card tags: `twitter:card`, `twitter:site`, `twitter:title`, `twitter:description`, `twitter:image`
- Include canonical URL
- Include favicon references (ICO, 32x32 PNG, Apple touch icon)
- Include self-hosted Open Sans font via `@fontsource`
- Include Plausible analytics script (or chosen analytics)
- Render Navigation component
- Render Footer component
- Render `<main>` content slot between nav and footer
- Apply Tailwind base styles
- Support light mode (dark mode as future enhancement)

### Acceptance Criteria
- [ ] Every page passes Lighthouse SEO audit with score >= 90
- [ ] Every page has unique, non-empty `<title>` and `meta description`
- [ ] OG tags render correctly when URL is pasted into Slack, Twitter/X, LinkedIn
- [ ] Favicon displays in browser tab across Chrome, Firefox, Safari, Edge
- [ ] Font renders as Open Sans on first paint (no FOUT/FOIT flash)
- [ ] Analytics script loads and records page views
- [ ] HTML validates with no errors (W3C validator)

---

## SPEC-002: Navigation Component

### Purpose
Global navigation bar providing access to all top-level sections.

### Requirements
- Fixed to top of viewport on scroll
- Left: logo image + "SDG AI Lab" wordmark (links to home)
- Right: nav links -- About (dropdown), Projects (dropdown), Resources, News, Get Involved (dropdown), Contact
- Dropdown sub-items as defined in IA Section 3
- Active page/section highlighted
- Collapse to hamburger menu below 768px
- Hamburger opens full-height mobile menu with accordion sub-items
- Skip-to-content link for accessibility (visually hidden, visible on focus)

### Acceptance Criteria
- [ ] Logo links to homepage from every page
- [ ] Active page link is visually distinguished (underline, color, or weight)
- [ ] Dropdowns open on hover (desktop) and click (mobile/touch)
- [ ] Hamburger menu opens/closes with animation on mobile
- [ ] Mobile menu sub-items expand/collapse on tap
- [ ] Keyboard navigable: Tab through links, Enter/Space to activate, Escape to close dropdowns
- [ ] ARIA attributes: `aria-expanded`, `aria-haspopup`, `aria-current="page"`
- [ ] Navigation is identical in structure across all pages (rendered from shared component)

---

## SPEC-003: Footer Component

### Purpose
Global footer with navigation links, social media icons, and legal text.

### Requirements
- 4-column link grid: About, Projects, Resources, Connect
- Social media icons: X (Twitter), GitHub, LinkedIn (confirm with client)
- Attribution line: "UNDP Digital, AI and Innovation Hub"
- Copyright: "© [dynamic year] SDG AI Lab"
- Links open in the same tab (internal) or new tab (external, with `rel="noopener noreferrer"`)

### Acceptance Criteria
- [ ] All footer links resolve to correct pages (no 404s)
- [ ] External links open in new tab with `rel="noopener noreferrer"`
- [ ] Social icons link to correct profiles
- [ ] Copyright year updates automatically (client-side JS or build-time)
- [ ] Footer is visually consistent across all pages

---

## SPEC-004: Home Page

### Purpose
First impression. Communicate the lab's mission, showcase impact, highlight key projects, display partners, and drive visitors toward primary CTAs.

### Sections (in order)

#### 4.1 Hero
- Background: gradient, subtle animation, or static image (replacing particles.js -- confirm with client)
- Headline: primary tagline (content from pipeline)
- Sub-headline: one sentence describing the lab
- CTA buttons: "Explore Projects" (→ /projects), "Get Involved" (→ /get-involved/volunteer)

#### 4.2 Impact Numbers
- 3-4 metric cards with icon, number, and label
- Numbers can be static or animated (count-up on scroll into view)
- Content: projects count, volunteer count, countries reached, partners count

#### 4.3 Our Approach
- Section heading
- Brief intro paragraph
- 3-5 methodology cards (icon + short description)

#### 4.4 Featured Projects
- Section heading
- 2-3 project cards (pulled from content collection, filtered by `featured: true`)
- Each card: SDG badges, title, excerpt, "Learn more" link
- "View all projects" link at bottom

#### 4.5 Partners & Supporters
- Section heading
- Logo grid: partner logos in rows (auto-wrap)
- Government supporters sub-section with attribution text
- Each logo links to partner website (new tab)

#### 4.6 CTA Banner
- Background: contrasting color
- Headline: "Interested in collaborating?"
- Two buttons: "Contact Us" (→ /contact), "Become a Volunteer" (→ /get-involved/volunteer)

### Acceptance Criteria
- [ ] Hero renders without layout shift on load
- [ ] CTA buttons navigate to correct pages
- [ ] Impact numbers display correctly (no NaN, no missing values)
- [ ] Featured project cards pull from content collection (not hard-coded HTML)
- [ ] All partner logos display, are clickable, and open correct URLs in new tabs
- [ ] Page loads in < 3 seconds on simulated 3G (Lighthouse)
- [ ] Lighthouse Performance score >= 85
- [ ] All images have alt text
- [ ] Mobile layout matches wireframe: stacked sections, 2x2 impact grid, single-column cards

---

## SPEC-005: About > Overview Page

### Purpose
Explain what the lab is, its history, organizational placement, and methodology.

### Requirements
- Breadcrumb: Home > About > Overview
- Lab description (2-3 paragraphs, from content pipeline)
- Optional: photo or illustration alongside text
- Methodology section (expanded version of homepage approach)
- Navigation cards to Team and Advisory Board sub-pages

### Acceptance Criteria
- [ ] Breadcrumb links are functional
- [ ] Text content matches approved copy from content pipeline
- [ ] Cards link to /about/team and /about/advisory-board
- [ ] Page is accessible: heading hierarchy (h1 > h2 > h3), sufficient color contrast

---

## SPEC-006: About > Team Page

### Purpose
Display named team members with photos, titles, and bios (if approved by client).

### Requirements
- Grid of team member cards
- Each card: photo (circular crop), name, title, stream label, short bio
- Grouped by stream: Management, Technical, Operational, Professional
- Pulled from `team` content collection
- Fallback: if client prefers roles-only (no names), display role cards without personal details

### Acceptance Criteria
- [ ] Team members render from content collection, sorted by `order` field
- [ ] Stream grouping is visually clear (section headings or visual separators)
- [ ] Photos are lazy-loaded with `loading="lazy"`
- [ ] All photos have alt text: "{name}, {title}"
- [ ] Page renders gracefully with 0 team members (shows "Coming soon" message)

---

## SPEC-007: About > Advisory Board Page

### Purpose
Display advisory board members with photos, names, titles, and affiliations.

### Requirements
- Grid of board member cards
- Each card: photo, name, title, affiliation, optional short bio
- Pulled from `board` content collection
- Cards are consistent in size regardless of content length

### Acceptance Criteria
- [ ] Board members render from content collection, sorted by `order` field
- [ ] All 8 current members display (updated per client verification)
- [ ] Photos display at consistent dimensions
- [ ] Responsive: 3 columns desktop, 2 tablet, 1 mobile

---

## SPEC-008: Projects Page

### Purpose
Showcase the lab's active and completed projects with SDG tagging.

### Requirements
- Tab/toggle: "Active" (default) and "Completed"
- Project cards pulled from `projects` content collection
- Each card: SDG goal badges, title, description excerpt, status indicator, "Learn more" link
- Optional filter bar: filter by SDG goal or topic
- Active tab shows projects where `status: 'active'`
- Completed tab shows projects where `status: 'completed'`

### Acceptance Criteria
- [ ] Active/Completed toggle works without page reload (client-side)
- [ ] Project cards pull from content collection (not hard-coded)
- [ ] SDG badges display correct goal icons with tooltips ("Goal X: Name")
- [ ] Status indicator: green dot for active, gray for completed
- [ ] "Learn more" links to individual project page (/projects/[slug])
- [ ] Responsive: 2 columns desktop, 1 column mobile
- [ ] Page shows meaningful state when 0 projects exist in a category

---

## SPEC-009: Individual Project Page

### Purpose
Deep-dive into a single project with full description, SDG alignment, and outcomes.

### Requirements
- Breadcrumb: Home > Projects > [Project Title]
- Full project description (Markdown body from content collection)
- SDG goal badges with full goal names
- Status, date range
- Outcomes section (if completed)
- "Back to Projects" link
- Optional: related projects sidebar

### Acceptance Criteria
- [ ] Dynamic route renders correct project based on URL slug
- [ ] Markdown content renders correctly (headings, lists, links, images)
- [ ] 404 page displayed for non-existent project slugs
- [ ] Breadcrumb links are functional
- [ ] Page has unique meta description and OG tags

---

## SPEC-010: News Page

### Purpose
Display news articles in reverse chronological order.

### Requirements
- Featured article at top (latest or manually flagged)
- Article grid below (3 columns desktop, 1 mobile)
- Each card: image, date, category tag, title, excerpt, "Read more" link
- If article has `externalUrl`, "Read more" opens external URL in new tab
- If article is hosted on-site, "Read more" links to /news/[slug]
- Pagination or "Load more" if > 9 articles

### Acceptance Criteria
- [ ] Articles sorted by date, newest first
- [ ] Featured article is visually distinct (larger card, full-width)
- [ ] External links open in new tab with `rel="noopener noreferrer"`
- [ ] Date format is consistent: "Month DD, YYYY"
- [ ] Page shows meaningful state with 0 articles
- [ ] Pagination works correctly if implemented

---

## SPEC-011: Contact Page

### Purpose
Enable visitors to send messages to the SDG AI Lab team.

### Requirements
- Contact form: Name (required), Email (required), Subject (optional), Message (required)
- Form submits to backend (Netlify Forms or Formspree, per ADR-004)
- Honeypot field for spam prevention (hidden from users, visible to bots)
- Client-side validation with clear error messages
- Success state: inline confirmation message after submission
- Error state: inline error message with retry option
- Sidebar or section: direct email, location (Istanbul, Turkey), social links

### Acceptance Criteria
- [ ] Form submits successfully and data reaches the configured backend
- [ ] Validation prevents submission with empty required fields
- [ ] Email field validates email format
- [ ] Honeypot field is hidden via CSS (not `display:none` which bots detect, but off-screen positioning)
- [ ] Success message appears after submission without page reload
- [ ] Error message appears if submission fails
- [ ] Form is keyboard-accessible: Tab through fields, Enter to submit
- [ ] Labels are associated with inputs via `for`/`id` attributes
- [ ] Form works without JavaScript (progressive enhancement: falls back to standard form POST)

---

## SPEC-012: Volunteer Page

### Purpose
Recruit volunteer data scientists by explaining the program and providing an application pathway.

### Requirements
- Program description: what volunteers do, time commitment, benefits
- "How it works" step-by-step (3 steps, per wireframe)
- Requirements section: skills, availability, interest areas
- Application form or link to external application (UNV platform)
- If form: Name, Email, LinkedIn URL, Skills (multi-select or text), Availability, Motivation (textarea)

### Acceptance Criteria
- [ ] Page clearly communicates what is expected of volunteers
- [ ] Application form submits successfully (or external link works)
- [ ] Form fields have appropriate validation
- [ ] Page is accessible and mobile-friendly
- [ ] "How it works" section is visually engaging (icons, step indicators)

---

## SPEC-013: Resources Page (if approved)

### Purpose
Surface the lab's publications, open-source tools, and datasets.

### Requirements
- Sub-sections: Publications, Open Source, Datasets (or tabs)
- Publications: list with title, authors, date, abstract snippet, download/link
- Open Source: repository cards with name, description, stars, language, link to GitHub
- Datasets: name, description, format, download/link

### Acceptance Criteria
- [ ] Content renders from Markdown files or data files (not hard-coded)
- [ ] External links open in new tab
- [ ] Page handles 0 items in any category gracefully
- [ ] Responsive layout

---

## SPEC-014: SEO and Social Sharing

### Purpose
Ensure the site is discoverable by search engines and renders correctly when shared on social media.

### Requirements
- Every page has: `<title>`, `<meta name="description">`, canonical URL
- Every page has OG tags: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- Every page has Twitter Card tags: `twitter:card=summary_large_image`, `twitter:site`
- `robots.txt` at site root allowing all crawlers
- `sitemap.xml` auto-generated by Astro sitemap integration
- Structured data (JSON-LD) for Organization on homepage:
  - name, url, logo, description, sameAs (social URLs)

### Acceptance Criteria
- [ ] `robots.txt` is accessible at /robots.txt
- [ ] `sitemap.xml` is accessible at /sitemap.xml and lists all pages
- [ ] Google Rich Results Test passes for structured data on homepage
- [ ] Sharing any page URL on Slack/Twitter/LinkedIn renders correct title, description, and image
- [ ] No duplicate `<title>` or `<meta description>` across pages
- [ ] Lighthouse SEO score >= 90 on all pages

---

## SPEC-015: Performance

### Purpose
Ensure fast load times, especially for users in bandwidth-constrained regions.

### Requirements
- Bundle CSS and JS (Astro handles this by default)
- Optimize images: WebP format, responsive `srcset`, lazy loading
- Self-host fonts (eliminate Google Fonts CDN request)
- Minimize third-party scripts (analytics only)
- Preload critical assets (fonts, hero image)
- No render-blocking resources in `<head>`

### Acceptance Criteria
- [ ] Lighthouse Performance score >= 85 on all pages (target: >= 90)
- [ ] Largest Contentful Paint (LCP) < 2.5s on simulated fast 3G
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] First Input Delay (FID) < 100ms
- [ ] Total transfer size < 500KB for homepage (excluding cached assets)
- [ ] All images served in WebP format with appropriate fallbacks
- [ ] No unused CSS in production build (Tailwind purge)

---

## SPEC-016: Accessibility

### Purpose
Ensure the site is usable by people with disabilities and meets accessibility standards.

### Requirements
- Target: WCAG 2.1 AA compliance (confirm with client, Q3.4)
- Semantic HTML: proper heading hierarchy, landmarks (`<nav>`, `<main>`, `<footer>`, `<article>`, `<section>`)
- All images have descriptive alt text
- Color contrast ratio >= 4.5:1 for normal text, >= 3:1 for large text
- Focus indicators visible on all interactive elements
- Skip-to-content link
- Form labels associated with inputs
- ARIA attributes where semantic HTML is insufficient

### Acceptance Criteria
- [ ] Lighthouse Accessibility score >= 90 on all pages
- [ ] axe-core automated scan: 0 critical/serious violations
- [ ] Keyboard-only navigation: all interactive elements reachable and operable
- [ ] Screen reader testing: NVDA or VoiceOver can navigate all content
- [ ] Focus is never trapped (except in modal dialogs, which must have Escape to close)
- [ ] Color is not the only means of conveying information (e.g., error states use icon + text, not just red color)
- [ ] Text can be zoomed to 200% without loss of content or functionality

---

## SPEC-017: 404 Page

### Purpose
Provide a helpful experience when a visitor reaches a non-existent URL.

### Requirements
- Friendly message: "Page not found"
- Link back to homepage
- Optionally: search box or suggested pages
- Consistent layout (uses BaseLayout with nav and footer)

### Acceptance Criteria
- [ ] Returns HTTP 404 status code
- [ ] Displays helpful message with link to homepage
- [ ] Uses the site's standard layout (nav, footer, styling)
- [ ] Does not display a blank page or browser default error

---

## Development Phases

### Phase 1: Foundation (Priority: Must Have)

| Spec | Description |
|------|-------------|
| SPEC-001 | Base Layout |
| SPEC-002 | Navigation |
| SPEC-003 | Footer |
| SPEC-004 | Home Page |
| SPEC-005 | About Overview |
| SPEC-011 | Contact Page |
| SPEC-014 | SEO |
| SPEC-015 | Performance |
| SPEC-016 | Accessibility |
| SPEC-017 | 404 Page |

### Phase 2: Content Pages (Priority: Should Have)

| Spec | Description |
|------|-------------|
| SPEC-006 | Team Page |
| SPEC-007 | Advisory Board |
| SPEC-008 | Projects Page |
| SPEC-009 | Individual Project Page |
| SPEC-010 | News Page |

### Phase 3: Enhanced Features (Priority: Could Have)

| Spec | Description |
|------|-------------|
| SPEC-012 | Volunteer Page |
| SPEC-013 | Resources Page |

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | Feb 2026 | Initial draft |

---

_This specification will be updated to version 1.0.0 once client questionnaire responses confirm the feature scope. Each spec will then be assigned to a developer and tracked through the build-review-approve cycle._
