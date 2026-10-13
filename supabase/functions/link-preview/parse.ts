export interface LinkPreview {
  title: string;
  image: string | null;
  summary: string | null;
  publish_date: string | null;
}

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));
}

function metaContent(html: string, key: string): string | null {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    const name = tag.match(/\b(?:property|name)\s*=\s*["']([^"']+)["']/i)?.[1];
    if (!name || name.toLowerCase() !== key) continue;
    const content = tag.match(/\bcontent\s*=\s*["']([^"']*)["']/i)?.[1];
    if (content?.trim()) return decodeHtml(content).trim();
  }
  return null;
}

function absoluteHttpUrl(value: string | null, pageUrl: string): string | null {
  if (!value) return null;
  try {
    const url = new URL(value, pageUrl);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return url.toString();
  } catch {
    return null;
  }
}

function isGenericImage(url: string): boolean {
  return /\/themes\/|\/libraries\/|\.svg(?:$|\?)|meta-undp-logo|(?:^|\/)[^/]*logo[^/]*\.(?:jpe?g|png|webp)(?:$|\?)/i.test(url);
}

function isRelatedCard(url: string): boolean {
  return /featured_content_card/i.test(url);
}

/** First photograph in the article, skipping the site logo and related-story cards. */
function contentImage(html: string, pageUrl: string): string | null {
  const photos: string[] = [];
  for (const match of html.matchAll(/\b(?:src|srcset)\s*=\s*["']([^"']+)["']/gi)) {
    for (const part of decodeHtml(match[1]).split(',')) {
      const raw = part.trim().split(/\s+/)[0];
      if (!raw || !/\.(?:jpe?g|png|webp)(?:$|\?)/i.test(raw)) continue;
      const url = absoluteHttpUrl(raw, pageUrl);
      if (!url || isGenericImage(url)) continue;
      photos.push(url);
    }
  }
  return photos.find((url) => !isRelatedCard(url)) ?? photos[0] ?? null;
}

const MONTHS: Record<string, number> = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
};

function isoDate(year: number, month: number, day: number): string | null {
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function isoDateFromText(value: string): string | null {
  const written = value.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})\b/i);
  if (written) return isoDate(Number(written[3]), MONTHS[written[1].toLowerCase()], Number(written[2]));
  const numeric = value.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (!numeric) return null;
  return isoDate(Number(numeric[1]), Number(numeric[2]), Number(numeric[3]));
}

/** Publication date, not a dateline inside the story. */
function publishedDate(html: string, head: string): string | null {
  const meta = metaContent(head, 'article:published_time') || metaContent(head, 'og:published_time');
  const fromMeta = meta ? isoDateFromText(meta) : null;
  if (fromMeta) return fromMeta;

  const datetime = html.match(/<time\b[^>]*\bdatetime=["']([^"']+)["']/i)?.[1];
  const fromTime = datetime ? isoDateFromText(datetime) : null;
  if (fromTime) return fromTime;

  for (const match of html.matchAll(/class="([^"]+)"[^>]*>\s*([^<]{0,80})/gi)) {
    if (!match[1].split(/\s+/).includes('posted-date')) continue;
    const date = isoDateFromText(match[2]);
    if (date) return date;
  }
  return null;
}

/** Reads the title, image, and short description a page publishes for link previews. */
export function previewFromHtml(html: string, pageUrl: string): LinkPreview {
  const head = html.slice(0, html.toLowerCase().indexOf('</head>') + 7 || html.length);
  const title =
    metaContent(head, 'og:title') ||
    metaContent(head, 'twitter:title') ||
    decodeHtml(head.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? '').trim();
  const sharedImage = absoluteHttpUrl(
    metaContent(head, 'og:image') || metaContent(head, 'twitter:image'),
    pageUrl
  );
  const image = sharedImage && !isGenericImage(sharedImage) ? sharedImage : contentImage(html, pageUrl);
  const summary = metaContent(head, 'og:description') || metaContent(head, 'twitter:description');

  return {
    title: title.slice(0, 300),
    image,
    summary: summary ? summary.slice(0, 500) : null,
    publish_date: publishedDate(html, head),
  };
}
