# Research: Admin Content Management Interface

**Feature**: 002-admin-ui | **Date**: 2026-03-02

## Research Questions

### RQ-1: Which Markdown editor component for React?

**Requirement**: FR-019 requires a Markdown editor with live preview. The preview must use `marked` (FR-020) for rendering consistency with the public site.

**Options evaluated**:

| Package | Stars | Size (gzipped) | License | Preview Customizable | Mobile-friendly |
|---------|-------|-----------------|---------|---------------------|-----------------|
| `@uiw/react-md-editor` | 2k+ | ~50KB | MIT | Yes (custom `previewOptions`) | Yes (responsive split/tab) |
| `react-simplemde-editor` | 1k+ | ~90KB | MIT | Limited (uses SimpleMDE) | Poor (toolbar crowded) |
| `@toast-ui/react-editor` | 800+ | ~200KB | MIT | Yes | Moderate |
| Custom (textarea + marked) | N/A | ~0KB (marked already installed) | N/A | Full control | Full control |

**Decision**: `@uiw/react-md-editor`

**Rationale**:
- Smallest footprint among full-featured options.
- Supports custom preview rendering via `renderHTML` prop — we can plug in `marked` directly.
- Provides split-pane (desktop) and tabbed (mobile) views out of the box.
- Toolbar is customizable (can remove unused buttons to simplify for non-technical users).
- Active maintenance, MIT license.
- The "custom textarea + marked" option was considered but rejected because it would require implementing toolbar actions (bold, italic, link insertion), keyboard shortcuts, and undo/redo from scratch — significant effort for minimal savings.

### RQ-2: Client-side routing approach for SPA on static hosting

**Requirement**: The admin SPA needs multiple "pages" (dashboard, listings, forms) but Astro outputs static HTML. GitHub Pages has no SPA fallback / URL rewrite support.

**Options evaluated**:

| Approach | Pros | Cons |
|----------|------|------|
| Hash-based routing (`#/path`) | Works natively on static hosting; no dependency needed; browser never requests a different file | URLs look less clean; anchor links not available |
| React Router (BrowserRouter) + 404 hack | Clean URLs | Requires a custom 404.html that redirects — fragile, SEO irrelevant for admin |
| React Router (HashRouter) | Mature library; handles nested routes, params | Adds ~15KB; overkill for ~20 flat routes |
| Custom hash router (~30 LOC) | Zero dependency; tiny; fully understood | Must implement param extraction manually |

**Decision**: Custom hash router (no dependency)

**Rationale**:
- The admin has ~20 routes, all flat or single-param (`:id`). No nested layouts, no route guards beyond the single auth check.
- A custom router using `window.location.hash` + `hashchange` event listener is approximately 30–40 lines of code.
- Avoids adding a routing dependency (React Router is ~15KB gzipped) for a simple use case.
- Hash routing is the only approach guaranteed to work on GitHub Pages without hacks.

### RQ-3: Supabase Auth magic link flow on static hosting

**Requirement**: FR-001 requires magic link authentication. The Supabase magic link sends the user a URL with auth tokens. On a static site, the redirect target must be a real page.

**Flow**:
1. Supabase sends magic link with `redirect_to` parameter pointing to `https://sdgailab.org/admin`.
2. Supabase Auth appends tokens to the URL as hash fragments (e.g., `/admin#access_token=...&type=magiclink`).
3. The React island detects the token hash on mount, calls `supabase.auth.setSession()` or handles it via `onAuthStateChange`.
4. After session is established, the app navigates to `#/` (dashboard).

**Important config**: In Supabase Dashboard → Authentication → URL Configuration:
- Site URL: `https://sdgailab.org`
- Redirect URLs: add `https://sdgailab.org/admin`

**Note on hash conflict**: Supabase Auth tokens are passed via URL hash fragments, which is the same mechanism we use for routing. The `AuthCallback` component must detect and handle auth tokens in the hash *before* the router processes it. This is handled by checking for `access_token` in the hash on initial mount.

### RQ-4: Image upload approach

**Requirement**: FR-021–025 require image upload to Supabase Storage with preview, replace, and remove capabilities.

**Approach**:
- Use `supabase.storage.from('public-assets').upload()` with the authenticated client.
- File path: `{content-type}/{timestamp}-{sanitized-filename}` to avoid collisions.
- Accept: `image/jpeg, image/png, image/gif, image/webp, image/svg+xml`.
- Max size: 5MB (validated client-side before upload).
- Show thumbnail preview using the public URL after upload.
- Replace: upload new file, delete old file, update URL in form state.
- Remove: delete file from storage, set URL to null in form state.

**Existing storage policy**: The `public-assets` bucket already has public read access and authenticated write access (set up in 001-dynamic-cms-revamp). No storage policy changes needed.
