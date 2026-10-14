export interface PublishedProjectIndexItem {
  title: string;
  slug: string;
  summary: string | null;
  image_url: string | null;
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function projectDetailPath(slug: string) {
  return `/projects/detail/${slug}/`;
}

export function projectDescription(summary: string | null, title: string) {
  const text = (summary ?? '').replace(/\s+/g, ' ').trim();
  if (!text) return `${title}, a solution from the SDG AI Lab.`;
  if (text.length <= 160) return text;
  return `${text.slice(0, 157).trimEnd()}...`;
}

export function publishedProjectsFromRows(rows: unknown): PublishedProjectIndexItem[] {
  if (!Array.isArray(rows)) return [];
  const seen = new Set<string>();
  const projects: PublishedProjectIndexItem[] = [];

  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;
    const record = row as Record<string, unknown>;
    const title = typeof record.title === 'string' ? record.title.trim() : '';
    const slug = typeof record.slug === 'string' ? record.slug.trim().toLowerCase() : '';
    if (!title || !slugPattern.test(slug) || seen.has(slug)) continue;
    seen.add(slug);
    projects.push({
      title,
      slug,
      summary: typeof record.summary === 'string' ? record.summary : null,
      image_url: typeof record.image_url === 'string' && record.image_url.startsWith('/') ? record.image_url : null,
    });
  }

  return projects;
}

/** Reads published projects at build time. Missing credentials or a failed request leave the page as it is. */
export async function loadPublishedProjectIndex(): Promise<PublishedProjectIndexItem[]> {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const endpoint = new URL('/rest/v1/projects', url);
    endpoint.searchParams.set('status', 'eq.published');
    endpoint.searchParams.set('select', 'title,slug,summary,image_url');
    endpoint.searchParams.set('order', 'display_order.asc');
    endpoint.searchParams.set('limit', '200');
    const response = await fetch(endpoint, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      signal: controller.signal,
    });
    if (!response.ok) return [];
    return publishedProjectsFromRows(await response.json());
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}
