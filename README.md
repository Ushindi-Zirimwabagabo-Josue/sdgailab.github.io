# SDG AI Lab

Official website — harnessing AI for sustainable development. A UNDP initiative.

Contributions welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). Release history: [CHANGELOG.md](CHANGELOG.md).

## Overview

This is a dynamic content site that displays statistics, projects, news, team members, partners, and page content — all managed in Supabase. Non-technical editors use the admin panel at `/admin` to update content with immediate effect (no redeploy required). The site is built as a static Astro output with client-side hydration for dynamic sections.

## Tech Stack

- **Frontend**: Astro 5, React 19, Tailwind CSS
- **CMS/Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Hosting**: GitHub Pages staging at [sdg-ai-lab.github.io/sdgailab.github.io](https://sdg-ai-lab.github.io/sdgailab.github.io/) with planned custom-domain production at [sdgailab.org](https://sdgailab.org)

## Prerequisites

- Node.js 20+
- npm
- Supabase account (free tier)
- See [.env.example](.env.example) for required environment variables

## Quick Start

1. Clone and install:
   ```bash
   git clone https://github.com/SDG-AI-Lab/sdgailab.github.io.git
   cd sdgailab.github.io
   npm install
   ```

2. Copy `.env.example` to `.env` and add your Supabase credentials:
   ```bash
   cp .env.example .env
   ```

3. Set up Supabase:
   - Create a project at [app.supabase.com](https://app.supabase.com/)
   - Run migrations in the SQL Editor in order: `001_initial_schema.sql` → `002_storage_policies.sql` → `003_secure_editor_access.sql` → `004_project_portfolio_metadata.sql` → `005_admin_users_management_model.sql` (see `supabase/README.md`)
   - Create a **Storage** bucket named `public-assets` with Public access
   - Add approved CMS editors to Supabase Auth and the `admin_users` allowlist table
   - (Optional) Run `supabase/seed.sql` for sample data

4. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:4321](http://localhost:4321)

For detailed setup (editor accounts, auth redirect URLs, etc.), see:
- [specs/001-dynamic-cms-revamp/quickstart.md](specs/001-dynamic-cms-revamp/quickstart.md)
- [specs/002-admin-ui/quickstart.md](specs/002-admin-ui/quickstart.md)
- [docs/supabase-c1-staging-signoff.md](docs/supabase-c1-staging-signoff.md) — Supabase hardening on staging (C1)

## Admin Panel

Editors manage content at `/admin`:

- **Authentication**: Magic-link login for approved editor accounts only
- **Content**: Statistics, projects, news, people, partners, page content
- **Features**: Markdown editing, image uploads, publish/archive/delete workflow

Configure Supabase Auth redirect URLs to include:

- `http://localhost:4321/admin` (local development)
- `https://sdg-ai-lab.github.io/sdgailab.github.io/admin` (current staging)
- `https://sdgailab.org/admin` (future production or cutover validation)

### Adding CMS editors

Before an editor can access `/admin`:

1. Create or invite the user in Supabase Auth.
2. Add the same email address to the CMS allowlist:

   ```sql
   insert into admin_users (email, role)
   values ('editor@example.com', 'editor');
   ```

Use role `admin` for site administrators and `editor` for regular content editors. Set `active = false` to revoke access without deleting the audit record.

If you already ran the earlier migrations before editor allowlisting was added, run `supabase/migrations/003_secure_editor_access.sql` in the Supabase SQL Editor.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Dev server (port 4321) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run format` | Prettier formatting |
| `npm run lint` | ESLint (TypeScript, React, Astro) |
| `npm run check` | TypeScript + Astro diagnostics |
| `npm run test` | Vitest unit/integration tests |
| `npm run test:e2e` | Playwright end-to-end tests |

## Project Structure

```
src/
├── pages/          # Astro pages (including /admin)
├── components/     # Astro + shared components
├── islands/        # React islands (public + admin)
├── lib/            # Supabase clients, queries, storage
└── styles/         # Tailwind global styles

public/             # Static assets, CNAME
supabase/           # Migrations, seed
specs/              # Feature specs (001-dynamic-cms-revamp, 002-admin-ui)
```

## Deployment

Deployment is automated via GitHub Actions when pushing to the `new-version` branch:

1. Set repository secrets: `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`
2. Push to `new-version` — the workflow builds and deploys to GitHub Pages

- **Current staging**: [https://sdg-ai-lab.github.io/sdgailab.github.io/](https://sdg-ai-lab.github.io/sdgailab.github.io/) (base path configured and currently active)
- **Future production**: [https://sdgailab.org](https://sdgailab.org) (documented cutover target when custom domain goes live)
- Runtime notes (Pages vs optional Docker preview): [docs/deployment-runtime.md](docs/deployment-runtime.md)

## Uptime monitoring

The free uptime strategy uses `.github/workflows/uptime-healthcheck.yml`.

- Runs every 6 hours and can also be triggered manually from GitHub Actions
- Checks the public website URL, currently the staging site at `https://sdg-ai-lab.github.io/sdgailab.github.io/`
- Checks the Supabase REST API with the public anon key
- Fails the workflow if either check is unavailable
- Opens or comments on a GitHub issue labeled `uptime` and `automated-healthcheck` when a failure occurs

Required repository secrets:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`

Optional repository variable:

- `HEALTHCHECK_SITE_URL` — defaults to the staging site: `https://sdg-ai-lab.github.io/sdgailab.github.io/`

## Documentation

- **Editor Guide**: [docs/editor-guide.md](docs/editor-guide.md) — user guide for non-technical content editors
- **Specs**: [specs/](specs/) — feature specifications and quickstart guides
- **SDD**: [docs/sdd/](docs/sdd/) — spec-driven development methodology

## License

MIT License — Copyright (c) 2020 SDG-AI-Lab. See [LICENSE](LICENSE).
