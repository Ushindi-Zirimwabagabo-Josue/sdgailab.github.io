# Architecture Decision Record (ADR)

## SDG AI Lab Website Revamp -- Tech Stack

| Field | Value |
|-------|-------|
| **Document version** | 0.1.0 (Draft) |
| **Date** | February 2026 |
| **Status** | Partially confirmed (Feb 2026 meeting + follow-up decisions) |
| **Decision maker** | _TBD_ |

---

## ADR-001: Framework / Static Site Generator

### Context

The current site is 6 hand-coded HTML files with Bootstrap. Navigation and footer are copy-pasted across every page. There is no build system, no component reuse, and no templating. Adding a new page requires duplicating boilerplate into a new file. The revamp needs a solution that enables component reuse, SEO, performance optimization, and maintainability.

### Options Evaluated

| Option | Pros | Cons | Best For |
|--------|------|------|----------|
| **Astro** | Component-based, zero JS by default, excellent performance, Markdown content support, partial hydration, growing ecosystem | Newer ecosystem (though mature by 2026), smaller community than Next.js | Content-heavy static sites with optional interactivity |
| **Next.js** | Largest React ecosystem, SSG + SSR + ISR, excellent DX, huge community | Heavier than needed for a mostly-static site, React dependency, Vercel-optimized | Dynamic apps, sites needing server-side rendering |
| **Hugo** | Extremely fast builds, Go templating, no JS dependency, mature | Go templates have a learning curve, less flexible for interactive features | Pure static sites with high build speed |
| **11ty (Eleventy)** | Flexible templating (Nunjucks, Liquid, etc.), minimal opinions, fast builds, no framework lock-in | Less structured than Astro/Next, smaller ecosystem for components | Developers who want maximum flexibility |
| **Plain HTML + Build Tools** | No framework to learn, full control | No component reuse, no templating, same maintenance problems as current site | Very small sites that won't grow |

### Recommendation

**Astro** is the recommended choice for this project because:

1. **Content-first:** The SDG AI Lab site is primarily content (text, images, project descriptions). Astro's content collections and Markdown support map perfectly to this.
2. **Performance:** Astro ships zero JavaScript by default. For a site serving UNDP audiences in bandwidth-constrained regions, this is critical. Interactive elements (forms, animations) use partial hydration ("islands").
3. **Component reuse:** Astro components solve the current duplication problem (nav/footer across 6 files).
4. **Flexibility:** Astro can use React, Vue, or Svelte components for interactive parts, without committing the whole site to a framework.
5. **Static output:** Generates pure static HTML, deployable on GitHub Pages, Netlify, or Vercel without server requirements.
6. **Markdown/MDX content:** News articles, project descriptions, and team bios can be authored in Markdown, enabling a lightweight CMS-like workflow.

### Decision

> _Pending client confirmation (Q4.1). Astro is the recommended default._

---

## ADR-002: Hosting Platform

### Context

The site is currently hosted on GitHub Pages with a CNAME pointing sdgailab.org to sdgailab.github.io. GitHub Pages is free, reliable, and tightly integrated with the repository. However, it has limitations: no server-side functions, no form handling, no deploy previews for PRs, and limited build customization.

### Options Evaluated

| Option | Cost | Form Handling | Deploy Previews | CI/CD | Serverless Functions |
|--------|------|--------------|-----------------|-------|---------------------|
| **GitHub Pages** | Free | None (need external service) | None (manual branch previews only) | GitHub Actions | None |
| **Netlify** | Free tier generous | Netlify Forms (built-in, free tier) | Automatic per PR | Built-in | Netlify Functions |
| **Vercel** | Free tier generous | None (need external) | Automatic per PR | Built-in | Edge/Serverless Functions |
| **Cloudflare Pages** | Free tier generous | None (need external) | Automatic per PR | Built-in | Workers |

### Recommendation

**GitHub Pages** is the recommended choice for this revamp because it is already in use, aligns with the free-only constraint, and avoids introducing new hosting dependencies.

### Decision

> **Accepted:** Stay on GitHub Pages.

---

## ADR-003: CSS / Design System

### Context

The current site uses Bootstrap 5 with 8 additional CSS files (Article-List.css, Team-Clean.css, etc.) and 3 icon font libraries (Font Awesome, Simple Line Icons, Typicons). This results in 12 CSS file loads with significant unused CSS.

### Options Evaluated

| Option | Pros | Cons |
|--------|------|------|
| **Tailwind CSS** | Utility-first, minimal CSS output (purge unused), consistent design tokens, excellent Astro integration | Learning curve for those used to semantic CSS |
| **Bootstrap 5 (keep)** | Familiar, large component library, team already knows it | Heavy (unused CSS), opinionated design that looks "Bootstrap-y" |
| **Vanilla CSS with custom properties** | Full control, no dependencies | More work to build from scratch, no pre-built components |
| **Open Props** | Modern CSS variables library, lightweight | Smaller community, less documentation |

### Recommendation

**Tailwind CSS** is the recommended choice because:

1. **Performance:** With PurgeCSS (built into Tailwind), the final CSS bundle contains only the classes actually used. This dramatically reduces CSS size compared to the current 12-file setup.
2. **Design tokens:** Tailwind's configuration file becomes the single source of truth for colors, spacing, typography -- enabling consistent design and easy theme changes.
3. **Astro integration:** Tailwind has first-class Astro support via `@astrojs/tailwind`.
4. **Responsive design:** Tailwind's responsive utilities make mobile-first design natural.
5. **Dark mode:** Built-in dark mode support via the `dark:` variant, if the client wants it (Q3.6).

### Decision

> _Pending client confirmation. Tailwind CSS is the recommended default._

---

## ADR-004: Contact Form Backend

### Context

The current contact form uses `action="MAILTO:sdgailab@undp.org"` with `method="post"` and `enctype="text/plain"`. This opens the user's default email client rather than submitting to a server. If the user has no email client configured (common on mobile), the form silently fails.

### Options Evaluated

| Option | Cost | Setup Complexity | Spam Protection | Data Storage |
|--------|------|-----------------|-----------------|--------------|
| **Netlify Forms** | Free (100 submissions/mo) | Zero (add attribute to form HTML) | Built-in honeypot + reCAPTCHA | Netlify dashboard |
| **Formspree** | Free (50 submissions/mo) | Low (point form action to Formspree URL) | Built-in | Formspree dashboard |
| **EmailJS** | Free (200 emails/mo) | Low (JS SDK) | reCAPTCHA integration | Email only (no dashboard) |
| **Custom API** | Hosting cost | High | Must implement | Custom |

### Recommendation

- Keep `mailto:` only if the lab explicitly prefers email-client submission and accepts reliability limitations.
- If a working backend submission is required later while staying on GitHub Pages (free-only), prefer **Formspree** (free tier) or store submissions in **Supabase** (if the Supabase-backed CMS is already in place).

### Decision

> **Accepted for now:** No dedicated form backend (retain mailto).

---

## ADR-005: Content Management

### Context

The site's content (projects, news, team bios, partner logos) needs regular updates. Currently, all content is hard-coded in HTML. The client questionnaire (Q4.2) asks whether a CMS is needed.

### Options Evaluated

| Option | Cost | Technical Barrier for Editors | Setup Complexity | Content Storage |
|--------|------|------------------------------|-----------------|-----------------|
| **Markdown files in repo** | Free | Medium (needs Git knowledge or a Git-based editor) | Low | Git repository |
| **Decap CMS (formerly Netlify CMS)** | Free | Low (web-based WYSIWYG editor backed by Git) | Medium | Git repository (Markdown files) |
| **Supabase-backed CMS** | Free tier available | Low-Medium (web UI via Supabase Studio or custom admin) | Medium | Supabase Postgres |
| **Sanity** | Free tier (3 users) | Low (web-based studio) | Medium-High | Sanity cloud |
| **No CMS (manual HTML editing)** | Free | High (requires HTML knowledge) | None | Git repository |

### Recommendation

Use a **Supabase-backed CMS** as the system of record for content that changes frequently (news, projects, partners, team).

Because the team needs **immediate updates without redeploys**, the website should use **runtime client-side reads** from Supabase for CMS-driven content. To keep this safe:

- Treat the Supabase **anon** key as public (it will ship to the browser).
- Enforce access via **Row Level Security (RLS)** and allow public reads only for `published=true` rows.
- Prefer a `status`/`published_at` field and only expose rows that are published.

If SEO becomes critical for some pages later, consider a hybrid approach (static shells + runtime content, or add an auto-redeploy webhook).

### Decision

> **Accepted:** CMS is essential in Phase 1 and should be Supabase-backed.

---

## ADR-006: Analytics

### Context

The site currently has zero analytics. There is no visibility into traffic, user behavior, or conversion.

### Options Evaluated

| Option | Cost | Privacy | Setup | GDPR Cookie Consent Required |
|--------|------|---------|-------|------------------------------|
| **Plausible** | $9/mo (or self-hosted free) | Privacy-focused, no cookies | Script tag | No |
| **Google Analytics 4** | Free | Collects PII, uses cookies | Script tag + consent banner | Yes |
| **Matomo** | Free (self-hosted) or paid (cloud) | Configurable privacy | Script tag | Depends on config |
| **None** | Free | N/A | N/A | N/A |

### Recommendation

Use **Google Analytics 4** (acceptable per client decision). If cookies are used, implement a **cookie consent** mechanism and publish a **privacy notice** describing what is collected and why.

### Decision

> **Accepted:** Google Analytics is acceptable (with cookie consent if required).

---

## ADR-007: Icon System

### Context

The current site loads 3 separate icon font libraries (Font Awesome 4.7, Simple Line Icons, Typicons) but uses only a handful of icons from each. Icon fonts are an older pattern that loads entire character sets for a few glyphs.

### Recommendation

Replace all icon fonts with **inline SVG icons** or a tree-shakeable icon library like **Lucide** or **Heroicons**. This eliminates 3 font file downloads and ensures only used icons are included in the bundle.

### Decision

> _This is a non-controversial optimization. Implement during scaffold setup._

---

## Summary of Recommended Stack

| Layer | Choice | Status |
|-------|--------|--------|
| **Framework** | Astro | Proposed |
| **Styling** | Tailwind CSS | Proposed |
| **Hosting** | GitHub Pages | Accepted |
| **Form handling** | mailto (Phase 1), optional Formspree/Supabase later | Accepted (Phase 1) |
| **Content system of record** | Supabase (Postgres) | Accepted |
| **CMS** | Supabase-backed (via Supabase Studio or custom admin) | Accepted |
| **Analytics** | Google Analytics 4 | Accepted |
| **Icons** | Lucide (inline SVG) | Proposed |
| **Fonts** | Open Sans via `@fontsource` (self-hosted) | Proposed |
| **CI/CD** | GitHub Actions (build + deploy to GitHub Pages) | Proposed |

---

Remaining decisions to finalize: framework choice (Gatsby vs alternatives), CSS approach (keep Bootstrap vs Tailwind), and whether the contact form should remain mailto or move to backend submissions.
