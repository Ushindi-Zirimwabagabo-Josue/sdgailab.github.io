// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.98.0';
import { previewFromHtml } from './parse.ts';

const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:4321',
  'http://127.0.0.1:4321',
  'https://sdgailab.org',
  'https://www.sdgailab.org',
  'https://sdg-ai-lab.github.io',
];

const MAX_BYTES = 1_500_000;
const MAX_REDIRECTS = 4;

function parseAllowedOrigins() {
  const fromEnv = (Deno.env.get('CONTACT_ALLOWED_ORIGINS') ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  return fromEnv.length > 0 ? fromEnv : DEFAULT_ALLOWED_ORIGINS;
}

function isOriginAllowed(origin) {
  if (!origin) return false;
  const allowed = parseAllowedOrigins();
  if (allowed.includes(origin)) return true;
  return origin.startsWith('https://sdg-ai-lab.github.io');
}

function corsHeadersFor(req) {
  const headers = {
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  };
  const origin = req.headers.get('Origin');
  if (origin && isOriginAllowed(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}

function jsonResponse(req, body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeadersFor(req), 'Content-Type': 'application/json' },
  });
}

function isBlockedHost(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (host === 'localhost' || host.endsWith('.local') || host.endsWith('.internal')) return true;
  if (host === '::1' || host.startsWith('fe80:') || host.startsWith('fc') || host.startsWith('fd')) return true;
  const match = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!match) return false;
  const [a, b] = [Number(match[1]), Number(match[2])];
  if (a === 10 || a === 127 || a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
}

function publicHttpsUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' || url.username || url.password || isBlockedHost(url.hostname)) return null;
  return url;
}

async function readPublicHtml(start) {
  let current = start;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    const response = await fetch(current, {
      redirect: 'manual',
      headers: { Accept: 'text/html,application/xhtml+xml', 'User-Agent': 'SDGAILabLinkPreview/1.0' },
      signal: AbortSignal.timeout(8000),
    });
    if (response.status >= 300 && response.status < 400) {
      const next = publicHttpsUrl(new URL(response.headers.get('location') ?? '', current).toString());
      if (!next) throw new Error('The page redirected to an address this tool will not open.');
      current = next;
      continue;
    }
    if (response.status === 401 || response.status === 403 || response.status === 429) {
      throw new Error('This site blocks automated reading. Fill in the title, image, and date yourself.');
    }
    if (!response.ok) throw new Error('The page could not be opened.');
    const type = response.headers.get('content-type') ?? '';
    if (!/text\/html|application\/xhtml\+xml/i.test(type)) throw new Error('That address is not a web page.');
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength > MAX_BYTES) throw new Error('The page is too large to read.');
    const html = new TextDecoder().decode(bytes);
    if (/incapsula|_Incapsula_Resource|cf-browser-verification|Just a moment/i.test(html) && html.length < 50_000) {
      throw new Error('This site blocks automated reading. Fill in the title, image, and date yourself.');
    }
    return { html, finalUrl: current.toString() };
  }
  throw new Error('The page redirected too many times.');
}

Deno.serve(async (req) => {
  const origin = req.headers.get('Origin');
  if (origin && !isOriginAllowed(origin)) return jsonResponse(req, { error: 'Origin not allowed.' }, 403);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeadersFor(req) });
  if (req.method !== 'POST') return jsonResponse(req, { error: 'Method not allowed' }, 405);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const authorization = req.headers.get('Authorization') ?? '';
  if (!supabaseUrl || !anonKey || !authorization.toLowerCase().startsWith('bearer ')) {
    return jsonResponse(req, { error: 'Sign in again to read a source page.' }, 401);
  }

  const supabase = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return jsonResponse(req, { error: 'Sign in again to read a source page.' }, 401);
  const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin_user');
  if (adminError || isAdmin !== true) return jsonResponse(req, { error: 'Only an editor can read a source page.' }, 403);

  let payload;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse(req, { error: 'Invalid JSON payload' }, 400);
  }

  const pageUrl = publicHttpsUrl(typeof payload?.url === 'string' ? payload.url.trim() : '');
  if (!pageUrl) return jsonResponse(req, { error: 'Enter an https link to a public page.' }, 400);

  try {
    const { html, finalUrl } = await readPublicHtml(pageUrl);
    const preview = previewFromHtml(html, finalUrl);
    if (!preview.title) return jsonResponse(req, { error: 'That page does not publish a title.' }, 422);
    return jsonResponse(req, preview);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'The page could not be read.';
    return jsonResponse(req, { error: message }, 422);
  }
});
