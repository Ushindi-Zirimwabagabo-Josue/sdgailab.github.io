# Technical Research: Dynamic CMS Revamp

**Branch**: `001-dynamic-cms-revamp` | **Date**: 2026-02-28

## Research Areas

### 1. Astro Static Output + Islands Architecture

**Question**: Can Astro serve as a static shell on GitHub Pages while hydrating individual components client-side for dynamic Supabase reads?

**Answer**: Yes. Astro's default output mode is `static` — it generates plain HTML/CSS/JS files at build time. The `client:load` directive on island components tells Astro to ship the component's JavaScript to the browser and hydrate it on page load. This is the ideal pattern for our use case:

- The page shell (layout, navigation, footer, particles hero) is static HTML with zero JavaScript.
- Only island components (StatsCards, ProjectList, etc.) ship JS and fetch from Supabase at runtime.
- This keeps the overall bundle small — only pages with dynamic content load the Supabase SDK.

**Configuration**:
```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  site: 'https://sdgailab.org',
  integrations: [react(), tailwind()],
});
```

**Key constraint**: Astro's `getStaticPaths()` requires knowing all routes at build time. Since our content is fully dynamic (not known at build), we cannot use `[slug].astro` dynamic routes. Instead, we use static detail pages with query parameters (see Research Area #4).

---

### 2. Supabase Client-Side Reads with RLS

**Question**: Is the Supabase anon key safe to ship in client-side JavaScript?

**Answer**: Yes, by design. Supabase's architecture expects the anon key to be public. Security is enforced entirely by Row Level Security policies on the database:

```sql
-- Only published rows are visible to the anon role
CREATE POLICY "anon_read_published" ON statistics
  FOR SELECT TO anon
  USING (status = 'published');
```

The anon key grants the `anon` PostgreSQL role, which RLS restricts to SELECT on published rows only. No writes, no access to drafts or archived content.

**Client initialization**:
```ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);
```

**Performance note**: The Supabase JS client is ~12KB gzipped. It's loaded once per island and shared across components on the same page via ES module caching.

---

### 3. Tailwind CSS with Astro

**Question**: How to recreate the current Bootstrap-based design using Tailwind?

**Answer**: Astro's `@astrojs/tailwind` integration provides first-class support. The migration approach:

1. **Extract design tokens** from the current `style.css` and Bootstrap theme:
   - Colors (primary blue, accent colors, text/bg shades)
   - Typography (Open Sans font family, font sizes, line heights)
   - Spacing (section padding, card gaps)
   - Breakpoints (Bootstrap's 576/768/992/1200 → Tailwind's sm/md/lg/xl)

2. **Map to tailwind.config.mjs**:
   ```js
   export default {
     theme: {
       extend: {
         colors: {
           primary: { DEFAULT: '#1a237e', light: '#534bae', dark: '#000051' },
           // ... extracted from current CSS
         },
         fontFamily: {
           sans: ['"Open Sans"', 'sans-serif'],
         },
       },
     },
   };
   ```

3. **Self-host fonts**: Move Open Sans from Google Fonts CDN to local `public/fonts/` for better performance and privacy. Use `@font-face` declarations in `global.css`.

---

### 4. Detail Pages on GitHub Pages (Static Hosting)

**Question**: How to implement `/projects/detail/?slug=my-project` style detail pages with Astro on static hosting?

**Answer**: Create a static Astro page at `src/pages/projects/detail.astro`. This generates `dist/projects/detail/index.html` at build time. The page contains an island component that reads the `slug` from the URL:

```astro
---
// src/pages/projects/detail.astro
import BaseLayout from '../../components/layout/BaseLayout.astro';
import ProjectDetail from '../../islands/ProjectDetail';
---
<BaseLayout title="Project Details">
  <ProjectDetail client:load />
</BaseLayout>
```

```tsx
// src/islands/ProjectDetail.tsx
export default function ProjectDetail() {
  const slug = new URLSearchParams(window.location.search).get('slug');
  // fetch from Supabase where slug = slug
}
```

**URL pattern**: Listing pages link to `/projects/detail/?slug=my-project`. This is clean, bookmarkable, and works perfectly with static hosting (no server-side routing needed).

**Alternative considered**: SPA-style 404 fallback (GitHub Pages serves `404.html` for unknown routes → client-side router handles `/projects/my-project`). Rejected because it's a hack, causes a 404 HTTP status for valid pages, and hurts any future SEO work.

---

### 5. Particles.js in Astro

**Question**: How to integrate particles.js (from the current site) into an Astro component?

**Answer**: Wrap particles.js in an Astro component that loads the library as a client-side script:

```astro
---
// src/components/sections/ParticlesHero.astro
---
<section id="particles-hero" class="relative h-[60vh] min-h-[400px]">
  <div id="particles-js" class="absolute inset-0"></div>
  <div class="relative z-10 flex items-center justify-center h-full">
    <slot />  <!-- Hero content overlay -->
  </div>
</section>

<script>
  import 'particles.js';
  particlesJS.load('particles-js', '/particles-config.json');
</script>
```

The `particles-config.json` file in `public/` is migrated from the current site's inline configuration. The `<script>` tag in an Astro component only runs in the browser (not at build time).

**npm package**: `particles.js` is available on npm. Install via `npm install particles.js` rather than copying the vendor file.

---

### 6. GitHub Actions Deployment

**Question**: How to deploy an Astro static site to GitHub Pages via GitHub Actions?

**Answer**: Astro provides an official GitHub Pages deployment guide. The workflow:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [001-dynamic-cms-revamp]  # or main after merge

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
        env:
          PUBLIC_SUPABASE_URL: ${{ secrets.PUBLIC_SUPABASE_URL }}
          PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.PUBLIC_SUPABASE_ANON_KEY }}
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

**Key points**:
- Supabase credentials are injected as secrets at build time (they become part of the client JS bundle, which is intentional — RLS protects data).
- The `CNAME` file in `public/` is automatically included in `dist/`, preserving the custom domain.
- GitHub Pages must be configured to deploy from GitHub Actions (Settings → Pages → Source → GitHub Actions).

---

### 7. Markdown Rendering for Content Bodies

**Question**: How to render Markdown content from Supabase in island components?

**Answer**: Use a lightweight Markdown-to-HTML library in the browser. Options:

| Library | Size (gzipped) | Features |
|---------|----------------|----------|
| `marked` | ~8KB | Full CommonMark, fast, widely used |
| `markdown-it` | ~12KB | Extensible, plugin ecosystem |
| `micromark` | ~6KB | Minimal, spec-compliant |

**Recommendation**: `marked` — good balance of size, speed, and compatibility. Used in the island components:

```tsx
import { marked } from 'marked';

function ArticleBody({ body }: { body: string }) {
  const html = marked.parse(body);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

**Security note**: Since content is authored by trusted editors (not user-submitted), XSS risk from `dangerouslySetInnerHTML` is acceptable. If needed later, add `DOMPurify` (~7KB) for sanitization.

---

### 8. Accessibility Approach

**Question**: What tooling and patterns ensure WCAG 2.1 AA compliance?

**Answer**:

1. **Semantic HTML**: Use proper heading hierarchy, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`.
2. **ARIA attributes**: Add `aria-label`, `aria-current`, `role` where semantic HTML isn't sufficient.
3. **Color contrast**: Tailwind's design tokens must meet 4.5:1 contrast ratio (text) and 3:1 (large text/UI). Verify with browser DevTools or WebAIM contrast checker.
4. **Keyboard navigation**: All interactive elements reachable via Tab; visible focus indicators; skip-to-content link.
5. **Alt text**: All images require `alt` attributes. Partner logos use the partner name. Team photos use the person's name.
6. **Motion**: `prefers-reduced-motion` media query to disable particles.js animation for users who prefer reduced motion.
7. **Testing**: Manual testing with axe DevTools browser extension; Lighthouse accessibility audit.
