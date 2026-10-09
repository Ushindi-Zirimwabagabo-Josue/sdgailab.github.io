# Quickstart: Dynamic CMS Revamp

**Branch**: `001-dynamic-cms-revamp` | **Date**: 2026-02-28

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 20 LTS or later | [nodejs.org](https://nodejs.org/) |
| npm | 10+ (ships with Node 20) | Included with Node.js |
| Git | Any recent version | [git-scm.com](https://git-scm.com/) |
| Supabase account | Free tier | [supabase.com](https://supabase.com/) |

Optional (for local Supabase development):

| Tool | Version | Install |
|------|---------|---------|
| Supabase CLI | Latest | `npm install -g supabase` |
| Docker | Latest | Required by Supabase CLI for local dev |

## 1. Clone and Install

```bash
git clone https://github.com/SDG-AI-Lab/sdgailab.github.io.git
cd sdgailab.github.io
git checkout 001-dynamic-cms-revamp
npm install
```

## 2. Set Up Supabase

### Option A: Use Supabase Cloud (recommended for quick start)

1. Create a new project at [app.supabase.com](https://app.supabase.com/).
2. Go to **Project Settings → API** and copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public key** (safe to expose — RLS protects data)
3. Run the initial migration in the Supabase SQL Editor:
   - Open **SQL Editor** in the Supabase dashboard.
   - Paste and execute the contents of `supabase/migrations/001_initial_schema.sql`.
4. (Optional) Seed the database with migrated content:
   - Paste and execute `supabase/seed.sql` in the SQL Editor.
5. Create a public storage bucket:
   - Go to **Storage** in the dashboard.
   - Create a bucket named `public-assets` with **Public** access.
6. Add Storage RLS policies (required for admin image uploads):
   - Open **SQL Editor** in the Supabase dashboard.
   - Paste and execute the contents of `supabase/migrations/002_storage_policies.sql`.

### Option B: Use Supabase CLI (local development)

```bash
supabase init
supabase start
supabase db reset    # Applies migrations + seed
```

The CLI will output a local URL and anon key to use.

## 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...your-anon-key
```

The `PUBLIC_` prefix tells Astro these values are safe to include in the client-side bundle (they're protected by RLS).

## 4. Start Development Server

```bash
npm run dev
```

Opens at `http://localhost:4321`. The site will:
- Render static Astro pages instantly.
- Hydrate island components that fetch content from your Supabase instance.
- Hot-reload on file changes.

## 5. Build for Production

```bash
npm run build
```

Output goes to `dist/`. This is what GitHub Actions deploys to GitHub Pages.

Preview the production build locally:

```bash
npm run preview
```

## 6. Deploy

Deployment is automated via GitHub Actions (`.github/workflows/deploy.yml`):

1. Push to the `001-dynamic-cms-revamp` branch (or the configured deploy branch).
2. GitHub Actions runs `npm run build`.
3. The `dist/` folder is deployed to GitHub Pages.
4. The `CNAME` file in `public/` ensures `sdgailab.org` custom domain is preserved.

**Environment variables for CI**: Set `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` as repository secrets in GitHub → Settings → Secrets and variables → Actions.

## npm Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `astro dev` | Start development server (port 4321) |
| `build` | `astro build` | Build static site to `dist/` |
| `preview` | `astro preview` | Preview production build locally |
| `format` | `prettier --write .` | Format all files |
| `check` | `astro check` | TypeScript + Astro diagnostics |

## Project Structure at a Glance

```
src/
├── components/    # Astro components (zero JS, server-rendered)
├── islands/       # React components (client-side, fetch from Supabase)
├── lib/           # Supabase client + typed queries
├── pages/         # File-based routing (one .astro file per page)
└── styles/        # Tailwind global styles + design tokens

public/            # Static assets (favicon, CNAME, particles config)
supabase/          # Database migrations + seed data
```

## Verifying It Works

After setup, confirm the end-to-end flow:

1. Open `http://localhost:4321` — you should see the homepage with particles hero.
2. Go to your Supabase dashboard → Table Editor → `statistics`.
3. Insert a row: `label = "Test", value = "42", status = "published", display_order = 1`.
4. Refresh the homepage — the "Test — 42" card should appear.
5. Change `status` to `archived` in Supabase.
6. Refresh — the card should disappear.

If this works, the runtime read pipeline is functioning correctly.
