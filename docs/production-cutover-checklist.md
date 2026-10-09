# Production Cutover Checklist

This checklist covers the move from the current GitHub Pages staging site:

- `https://sdg-ai-lab.github.io/sdgailab.github.io/`

to the intended production site:

- `https://sdgailab.org`

It is specific to this repo’s current setup:

- Astro static output
- GitHub Pages deploy from `.github/workflows/deploy.yml`
- custom domain via `public/CNAME`
- Supabase-backed runtime content and admin auth

## Current Repo State

- `astro.config.mjs` already sets `site: 'https://sdgailab.org'`
- `public/CNAME` already contains `sdgailab.org`
- `.github/workflows/deploy.yml` still builds with `GITHUB_PAGES_BASE: /sdgailab.github.io/`
- `.github/workflows/uptime-healthcheck.yml` defaults to the staging URL
- Supabase auth/admin is currently validated for staging

Complete [supabase-c1-staging-signoff.md](./supabase-c1-staging-signoff.md) and [supabase-backup-restore.md](./supabase-backup-restore.md) before starting this cutover (Phase C2).

## Cutover Goal

After this checklist:

- the public site resolves at `https://sdgailab.org`
- `/admin` works at `https://sdgailab.org/admin`
- the build uses root-relative URLs instead of the staging project-site base path
- uptime monitoring checks production
- staging-only auth redirects can be reduced if no longer needed

---

## 1. Freeze Window and Rollback Prep

- [ ] Pick a low-risk cutover window
- [ ] Notify anyone using staging admin access
- [ ] Confirm one person owns DNS changes
- [ ] Confirm one person owns GitHub Pages settings
- [ ] Confirm one person owns Supabase auth settings
- [ ] Keep the staging URL available as rollback reference until production is stable

**Rollback trigger**

- Public site fails to load on `sdgailab.org`
- `/admin` magic links fail
- critical assets load with broken paths

---

## 2. Verify GitHub Pages Custom Domain Setup

### GitHub

Open:

- `GitHub -> Repository -> Settings -> Pages`

### Check

- [ ] Source is GitHub Actions
- [ ] Custom domain is `sdgailab.org`
- [ ] Enforce HTTPS is enabled once certificate provisioning succeeds

### Repo confirmation

- [ ] `public/CNAME` still contains `sdgailab.org`

File:

- `public/CNAME:1`

---

## 3. Verify DNS

### Domain/DNS provider

Confirm the DNS records for `sdgailab.org` match GitHub Pages requirements for a custom domain.

- [ ] apex/root domain records point to GitHub Pages correctly
- [ ] `www` record is configured if you intend to support it
- [ ] there are no conflicting old A, AAAA, or CNAME records

### Check after change

- [ ] `https://sdgailab.org` resolves publicly
- [ ] TLS certificate provisions successfully

**Note**

This repo cannot change DNS directly; this is an operator step outside the codebase.

---

## 4. Switch the Build from Staging Base Path to Production Root

### Why

The deploy workflow currently injects:

- `GITHUB_PAGES_BASE: /sdgailab.github.io/`

That is correct for a GitHub Pages project-site staging URL, but not for a root custom domain.

### Update

Edit:

- `.github/workflows/deploy.yml`

### Change

Replace:

```yml
GITHUB_PAGES_BASE: /sdgailab.github.io/
```

with either:

```yml
GITHUB_PAGES_BASE: /
```

or remove the env line entirely and let Astro fall back to `/`.

### Verify

- [ ] internal links no longer include `/sdgailab.github.io/`
- [ ] assets load from `/...` on production
- [ ] `/admin` resolves correctly on the custom domain

Files:

- `.github/workflows/deploy.yml:31`
- `astro.config.mjs:8`

---

## 5. Confirm Canonical and Site URL Settings

### Check

No change is needed if production really is `https://sdgailab.org`.

File:

- `astro.config.mjs:7`

### Verify

- [ ] page metadata and canonicals use `https://sdgailab.org`
- [ ] social image URLs resolve on the production domain

---

## 6. Update Supabase Auth URL Configuration

### Supabase

Open:

- `Supabase Dashboard -> Authentication -> URL Configuration`

### Set for production cutover

- [ ] **Site URL** = `https://sdgailab.org`

### Keep allowed Redirect URLs

- [ ] `https://sdgailab.org/admin`
- [ ] `http://localhost:4321/admin`

### Temporary transition option

Keep the staging admin URL during cutover if you still need staged rollback testing:

- `https://sdg-ai-lab.github.io/sdgailab.github.io/admin`

### After production stabilizes

- [ ] remove the staging admin URL if you no longer need it

Files/behavior:

- `src/islands/admin/auth/LoginPage.tsx:31`
- `docs/supabase-hardening-runbook.md:349`

---

## 7. Reconfirm Supabase Hardening in the Live Project

Before production launch, quickly re-check the live Supabase state:

- [ ] `admin_users` allowlist is correct
- [ ] RLS is enabled on all CMS tables
- [ ] storage policies on `public-assets` are correct
- [ ] auth rate limits are configured

References:

- `docs/supabase-hardening-runbook.md:59`

---

## 8. Update Uptime Monitoring to Production

### Current state

The healthcheck workflow defaults to staging:

- `.github/workflows/uptime-healthcheck.yml:19`

### Recommended cutover action

In GitHub repository settings, set the variable:

- `HEALTHCHECK_SITE_URL = https://sdgailab.org`

### Verify

- [ ] next scheduled run checks production
- [ ] manual workflow run passes against production

---

## 9. Update Documentation References

Review and update staging-first language where appropriate:

- [ ] `README.md:61`
- [ ] `README.md:111`
- [ ] `README.md:119`
- [ ] `docs/editor-guide.md:37`
- [ ] `docs/editor-guide.md:38`
- [ ] any operator docs that still describe production as “future”

### Minimum required

- [ ] README reflects production as active
- [ ] admin login instructions prioritize `https://sdgailab.org/admin`
- [ ] uptime notes point to production, not staging

---

## 10. Deploy the Production Build

### GitHub

Push the workflow/config updates to the deploy branch:

- current deploy branch: `new-version`

### Verify in Actions

- [ ] `Deploy to GitHub Pages` workflow passes
- [ ] deployed site loads at `https://sdgailab.org`
- [ ] no broken asset paths appear in the browser console/network tab

Files:

- `.github/workflows/deploy.yml:1`

---

## 11. Run Production Smoke Tests

### Public site

- [ ] home page loads
- [ ] navigation links work
- [ ] project detail pages load
- [ ] news detail pages load
- [ ] images and CSS load correctly
- [ ] no broken `/sdgailab.github.io/` links remain

### Admin

- [ ] `https://sdgailab.org/admin` loads
- [ ] approved editor can request a magic link
- [ ] magic link returns to production `/admin`
- [ ] approved editor can create or edit content
- [ ] image upload still works
- [ ] non-editor cannot access admin features

### Monitoring

- [ ] uptime workflow passes
- [ ] Supabase-backed public data still loads

---

## 12. Post-Cutover Cleanup

- [ ] remove staging-only redirect URLs if no longer needed
- [ ] keep or retire staging URL intentionally; do not leave it ambiguous
- [ ] update any external docs/shared bookmarks
- [ ] update the production-readiness notes in `.sdgqalab` if you want a new post-cutover audit snapshot

---

## Recommended Execution Order

1. DNS and GitHub Pages custom domain verification
2. deploy workflow base-path switch
3. Supabase auth Site URL and redirect update
4. healthcheck target update
5. production deploy
6. smoke tests
7. cleanup

## Rollback Plan

If production cutover fails:

- [ ] restore the previous working deploy configuration
- [ ] set `HEALTHCHECK_SITE_URL` back to staging
- [ ] keep staging redirect URL active in Supabase
- [ ] use the staging URL as the operational fallback:
  - `https://sdg-ai-lab.github.io/sdgailab.github.io/`

## Done Criteria

Cutover is complete when:

- `https://sdgailab.org` serves the live site correctly
- `/admin` works on the production domain
- deploys use `/` rather than `/sdgailab.github.io/`
- health checks target production
- staging-only auth/config entries are either intentionally retained or removed
