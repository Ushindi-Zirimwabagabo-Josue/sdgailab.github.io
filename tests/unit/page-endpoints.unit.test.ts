import { describe, expect, it } from 'vitest';
import { GET as getRobotsTxt } from '../../src/pages/robots.txt';
import { GET as getSitemapXml } from '../../src/pages/sitemap.xml';

const site = new URL('https://sdgailab.org');

describe('Page endpoints', () => {
  it('robots.txt allows public pages and blocks admin and launch-readiness', async () => {
    const response = await getRobotsTxt({ site } as Parameters<typeof getRobotsTxt>[0]);
    const body = await response.text();

    expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
    expect(body).toContain('User-agent: *');
    expect(body).toContain('Allow: /');
    expect(body).toContain('Disallow: /admin');
    expect(body).toContain('Disallow: /launch-readiness');
    expect(body).toContain('Sitemap: https://sdgailab.org/sitemap.xml');
  });

  it('robots.txt falls back to the production host when site is missing', async () => {
    const response = await getRobotsTxt({} as Parameters<typeof getRobotsTxt>[0]);
    const body = await response.text();

    expect(body).toContain('Sitemap: https://sdgailab.org/sitemap.xml');
  });

  it('sitemap.xml lists public routes with expected metadata', async () => {
    const response = await getSitemapXml({ site } as Parameters<typeof getSitemapXml>[0]);
    const body = await response.text();

    expect(response.headers.get('Content-Type')).toBe('application/xml; charset=utf-8');
    expect(body).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(body).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

    for (const route of [
      'https://sdgailab.org/',
      'https://sdgailab.org/about/',
      'https://sdgailab.org/projects/',
      'https://sdgailab.org/tech4r/',
      'https://sdgailab.org/resources/',
      'https://sdgailab.org/news/',
      'https://sdgailab.org/team/',
      'https://sdgailab.org/volunteer/',
      'https://sdgailab.org/contact/',
    ]) {
      expect(body).toContain(`<loc>${route}</loc>`);
    }

    expect(body).not.toContain('/admin');
    expect(body).not.toContain('/launch-readiness');
    expect(body).toContain('<priority>1.0</priority>');
    expect(body).toContain('<priority>0.9</priority>');
    expect(body).toContain('<changefreq>weekly</changefreq>');
  });

  it('sitemap.xml escapes XML entities in URLs', async () => {
    const response = await getSitemapXml({
      site: new URL('https://example.com/?a=1&b=2'),
    } as Parameters<typeof getSitemapXml>[0]);
    const body = await response.text();

    expect(body).not.toContain('a=1&b=2');
    expect(body).toContain('&amp;');
  });
});
