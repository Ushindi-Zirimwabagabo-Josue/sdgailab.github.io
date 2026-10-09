# Project Scaffold Specification

## SDG AI Lab Website Revamp

| Field | Value |
|-------|-------|
| **Document version** | 0.1.0 (Draft) |
| **Date** | February 2026 |
| **Status** | Ready to execute once tech stack is confirmed |

---

## 1. Prerequisites

Before scaffolding, ensure the following are confirmed:

- [ ] Framework decision (ADR-001) -- default: Astro
- [ ] Hosting decision (ADR-002) -- **GitHub Pages**
- [ ] CSS decision (ADR-003) -- default: Tailwind CSS
- [ ] CMS decision (ADR-005) -- **Supabase-backed**
- [ ] Analytics decision (ADR-006) -- **Google Analytics 4** (and cookie consent if required)
- [ ] Node.js 18+ installed
- [ ] Git configured with access to SDG-AI-Lab/sdgailab.github.io

---

## 2. Branch Strategy

```
main              ← production (current live site, do not touch until launch)
  └── new-version ← integration branch for the revamp
       ├── feat/* ← feature branches (one per page or feature)
       └── fix/*  ← bug fix branches
```

All work happens on `new-version` or feature branches off of it. The `main` branch remains the live site until the revamp is launched.

---

## 3. Scaffold Commands

### 3.1 Initialize Astro Project

```bash
# From the repository root, on the new-version branch
npm create astro@latest . -- --template minimal --no-install

# Install dependencies
npm install

# Add Tailwind CSS integration
npx astro add tailwind

# Add sitemap integration (for SEO)
npx astro add sitemap
```

### 3.2 Install Additional Dependencies

```bash
# Icons (tree-shakeable SVG icons)
npm install lucide-astro

# Self-hosted fonts (eliminates Google Fonts CDN dependency)
npm install @fontsource/open-sans

# Supabase client (for runtime reads)
npm install @supabase/supabase-js

# Prettier + Astro plugin for formatting
npm install -D prettier prettier-plugin-astro prettier-plugin-tailwindcss

# ESLint for linting
npm install -D eslint @eslint/js
```

### 3.3 Optional Dependencies (based on client decisions)

```bash
# If hosting on GitHub Pages:
npx astro add @astrojs/github-pages
```

---

## 4. Project Structure

This structure assumes **GitHub Pages hosting** and a **Supabase-backed CMS** as the system of record, with **runtime reads** so non-technical editors see changes immediately after publishing in Supabase (no redeploy).

```
sdgailab.github.io/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navigation.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── ProjectCard.astro
│   │   ├── TeamMember.astro
│   │   ├── PartnerLogo.astro
│   │   ├── NewsCard.astro
│   │   ├── ContactForm.astro
│   │   ├── ImpactCounter.astro
│   │   └── SdgBadge.astro
│   │
│   ├── layouts/             # Page layout templates
│   │   ├── BaseLayout.astro  # HTML head, nav, footer, analytics
│   │   └── ArticleLayout.astro # Layout for news articles
│   │
│   ├── pages/               # Route-based pages (file = URL)
│   │   ├── index.astro       # Home (/)
│   │   ├── about/
│   │   │   ├── index.astro   # About Overview (/about)
│   │   │   ├── team.astro    # Team (/about/team)
│   │   │   └── advisory-board.astro # Board (/about/advisory-board)
│   │   ├── projects/
│   │   │   ├── index.astro   # Active Projects (/projects)
│   │   │   ├── completed.astro # Completed (/projects/completed)
│   │   │   └── [slug].astro  # Individual project (/projects/[slug])
│   │   ├── resources/
│   │   │   ├── index.astro   # Resources overview (/resources)
│   │   │   ├── publications.astro
│   │   │   └── open-source.astro
│   │   ├── news/
│   │   │   ├── index.astro   # News list (/news)
│   │   │   └── [slug].astro  # Individual article (/news/[slug])
│   │   ├── get-involved/
│   │   │   ├── volunteer.astro
│   │   │   └── partner.astro
│   │   └── contact.astro     # Contact form (/contact)
│   │
│   ├── data/                # Local types + defaults (optional)
│   │   └── schema.ts         # Shared TS types mirroring Supabase tables
│   │
│   ├── lib/                 # Data access utilities
│   │   └── supabase.ts       # Supabase client (browser-safe; anon key)
│   │
│   ├── islands/             # Client-side components (Astro islands)
│   │   ├── ProjectsGrid.tsx  # Fetch + render projects from Supabase
│   │   ├── NewsGrid.tsx      # Fetch + render news from Supabase
│   │   └── PartnersGrid.tsx  # Fetch + render partner logos from Supabase
│   │
│   └── styles/              # Global styles
│       └── global.css        # Tailwind directives + custom base styles
│
├── public/                  # Static assets (copied as-is to build output)
│   ├── images/
│   │   ├── logos/            # Partner logos
│   │   ├── team/             # Team member photos
│   │   ├── board/            # Board member photos
│   │   └── news/             # News article images
│   ├── fonts/                # Self-hosted font files (if not using @fontsource)
│   └── favicon.ico           # (migrate from icons/ directory)
│
├── docs/                    # SDD documentation (this directory)
│   └── sdd/
│
├── astro.config.mjs         # Astro configuration
├── tailwind.config.mjs      # Tailwind configuration (design tokens)
├── tsconfig.json            # TypeScript config
├── package.json
├── .prettierrc              # Prettier config
├── .eslintrc.js             # ESLint config
├── .gitignore               # Updated for Astro
├── CNAME                    # Retain for domain mapping
└── README.md                # Updated project documentation
```

---

## 5. Configuration Files

### 5.1 astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sdgailab.org',
  integrations: [tailwind(), sitemap()],
  output: 'static',
});
```

### 5.2 tailwind.config.mjs

```javascript
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#0468B1',  // UNDP Blue (adjust per branding guidelines)
          600: '#035d9e',
          700: '#024e85',
          800: '#013f6b',
          900: '#003052',
        },
      },
      fontFamily: {
        sans: ['"Open Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### 5.3 GitHub Pages deployment

Use the GitHub Pages adapter (`@astrojs/github-pages`) and a GitHub Actions workflow that builds and deploys the static site. Supabase data is fetched at runtime in the browser, so no CI secrets are required for content reads (the anon key is public and protected by RLS).

### 5.4 .prettierrc

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "plugins": ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ]
}
```

### 5.5 .gitignore (Astro additions)

```
# Astro
dist/
.astro/

# Dependencies
node_modules/

# Environment
.env
.env.*

# IDE
.idea/
.vscode/
*.swp

# OS
.DS_Store
Thumbs.db

# Build
*.log
```

---

## 6. Content Collection Schemas

### src/content/config.ts

```typescript
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['active', 'completed']),
    sdgGoals: z.array(z.number().min(1).max(17)),
    startDate: z.date(),
    endDate: z.date().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

const news = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    author: z.string().optional(),
    excerpt: z.string(),
    image: z.string().optional(),
    category: z.string().optional(),
    externalUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
  }),
});

const team = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    title: z.string(),
    photo: z.string().optional(),
    stream: z.enum(['management', 'technical', 'operational', 'professional']),
    order: z.number().default(0),
  }),
});

const board = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    title: z.string(),
    affiliation: z.string().optional(),
    photo: z.string().optional(),
    order: z.number().default(0),
  }),
});

export const collections = { projects, news, team, board };
```

---

## 7. CI/CD Pipeline

### 7.1 Netlify (Primary)

Netlify automatically builds and deploys on every push. Deploy previews are generated for every PR. No additional configuration needed beyond `netlify.toml`.

### 7.2 GitHub Actions (Fallback -- for GitHub Pages)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

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
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

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

---

## 8. npm Scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "format": "prettier --write .",
    "lint": "eslint src/",
    "check": "astro check"
  }
}
```

---

## 9. Migration Checklist

When scaffolding the new project, migrate these assets from the current site:

- [ ] Logo image (`assets/img/Webp.net-resizeimage.jpg`) → `public/images/logo.jpg`
- [ ] Hero image (`assets/img/Webp.net-resizeimage.png`) → `public/images/hero.png` (if keeping)
- [ ] Partner logos (`assets/img/logos/`) → `public/images/logos/`
- [ ] Board member photos → `public/images/board/`
- [ ] News images → `public/images/news/`
- [ ] Favicon set (`icons/`) → `public/` (rename/restructure)
- [ ] CNAME file → keep at root
- [ ] Content text from each HTML page → Markdown files in `src/content/`

---

_Execute this scaffold once the tech stack decisions in ADR-001 through ADR-007 are confirmed by the client._
