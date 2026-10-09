/**
 * Prefixes a path with the Astro base URL (e.g. /sdgailab.github.io for staging).
 * Use for all internal links so they work on GitHub Pages project sites.
 */
export function withBase(path: string): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '';
  return base + (path.startsWith('/') ? path : '/' + path);
}
