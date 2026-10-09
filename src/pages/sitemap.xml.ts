import type { APIRoute } from 'astro';

const productionHost = 'https://sdgailab.org';

const publicRoutes = [
  '/',
  '/about/',
  '/projects/',
  '/tech4r/',
  '/services/',
  '/research/',
  '/capacity-building/',
  '/programmes/',
  '/resources/',
  '/news/',
  '/team/',
  '/volunteer/',
  '/contact/',
] as const;

function xmlEscape(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export const GET: APIRoute = ({ site }) => {
  const origin = site?.toString().replace(/\/$/, '') || productionHost;
  const urls = publicRoutes
    .map((route) => {
      const loc = `${origin}${route}`;
      const priority = route === '/' ? '1.0' : route === '/contact/' ? '0.9' : '0.7';
      return [
        '  <url>',
        `    <loc>${xmlEscape(loc)}</loc>`,
        '    <changefreq>weekly</changefreq>',
        `    <priority>${priority}</priority>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  return new Response(
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      urls,
      '</urlset>',
      '',
    ].join('\n'),
    {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    }
  );
};
