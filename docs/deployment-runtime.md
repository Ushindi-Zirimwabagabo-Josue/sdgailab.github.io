# Deployment runtime notes

## Production (accepted)

Production and staging HTML/JS/CSS are served as a **static site on GitHub Pages** via `.github/workflows/deploy.yml`. There is no container runtime in the production path.

| Concern | Approach |
|---------|----------|
| Build | `npm ci` + `npm run build` in GitHub Actions |
| Host | `actions/deploy-pages` → GitHub Pages |
| CMS / auth / storage | Supabase (managed BaaS) |
| Contact submit | Supabase Edge Function |

**FLX-001 risk acceptance:** Containerization is not required for production because the deploy target is static Pages + managed Supabase. A `Dockerfile` is provided for optional local/preview builds only.

## Optional container preview

```bash
docker build -t sdgailab-site \
  --build-arg PUBLIC_SUPABASE_URL="$PUBLIC_SUPABASE_URL" \
  --build-arg PUBLIC_SUPABASE_ANON_KEY="$PUBLIC_SUPABASE_ANON_KEY" \
  --build-arg GITHUB_PAGES_BASE=/ \
  .

docker run --rm -p 8080:8080 sdgailab-site
```

The image runs nginx as non-root on port **8080**.

## Related

- [production-cutover-checklist.md](./production-cutover-checklist.md)
- [supabase-backup-restore.md](./supabase-backup-restore.md)
