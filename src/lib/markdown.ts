import createDOMPurify from 'dompurify';
import { marked } from 'marked';

const SAFE_DATA_IMAGE_PATTERN = /^data:image\/(gif|jpeg|jpg|png|webp);base64,/i;
const UNSAFE_URL_PATTERN = /^(javascript|vbscript|file|data):/i;

const PURIFY_CONFIG = {
  USE_PROFILES: { html: true },
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
  FORBID_ATTR: ['style'],
  ALLOW_DATA_ATTR: false,
};

type Purifier = ReturnType<typeof createDOMPurify>;

let purifier: Purifier | null = null;

function getPurifier(): Purifier {
  if (purifier) {
    return purifier;
  }

  if (typeof window === 'undefined') {
    throw new Error('DOMPurify requires a DOM window (browser or jsdom test environment).');
  }

  purifier = createDOMPurify(window);
  return purifier;
}

function escapeRawHtml(markdown: string): string {
  return markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function isSafeUri(value: string, attribute: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) {
    return true;
  }
  if (attribute === 'src' && SAFE_DATA_IMAGE_PATTERN.test(trimmed)) {
    return true;
  }
  return !UNSAFE_URL_PATTERN.test(trimmed);
}

function sanitizeRenderedHtml(html: string): string {
  const purify = getPurifier();

  purify.addHook('uponSanitizeAttribute', (_node, data) => {
    if (data.attrName === 'href' || data.attrName === 'src') {
      if (!isSafeUri(data.attrValue, data.attrName)) {
        data.attrValue = data.attrName === 'href' ? '#' : '';
      }
    }
  });

  try {
    return purify.sanitize(html, PURIFY_CONFIG);
  } finally {
    purify.removeAllHooks();
  }
}

export async function renderMarkdown(markdown: string): Promise<string> {
  const escapedMarkdown = escapeRawHtml(markdown);
  const rendered = marked.parse(escapedMarkdown);
  const html = typeof rendered === 'string' ? rendered : await rendered;
  return sanitizeRenderedHtml(html);
}
