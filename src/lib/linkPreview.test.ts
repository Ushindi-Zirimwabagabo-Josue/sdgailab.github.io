import { describe, expect, it } from 'vitest';
import { previewFromHtml } from '../../supabase/functions/link-preview/parse';

const page = 'https://www.undp.org/policy-centre/istanbul/news/example';

describe('previewFromHtml', () => {
  it('reads the Open Graph title, image, and description', () => {
    const html = `
      <html><head>
        <meta property="og:title" content="Frontier technologies partnership" />
        <meta property="og:description" content="A short account of the partnership." />
        <meta property="og:image" content="https://www.undp.org/sites/example.jpg?itok=abc" />
        <title>Ignored title</title>
      </head><body></body></html>
    `;

    expect(previewFromHtml(html, page)).toEqual({
      title: 'Frontier technologies partnership',
      image: 'https://www.undp.org/sites/example.jpg?itok=abc',
      summary: 'A short account of the partnership.',
      publish_date: null,
    });
  });

  it('falls back to the document title and resolves a relative image', () => {
    const html = `
      <html><head>
        <title>Demo Day &amp; Volunteers</title>
        <meta name="twitter:image" content="/sites/demo.jpg" />
      </head></html>
    `;

    expect(previewFromHtml(html, page)).toEqual({
      title: 'Demo Day & Volunteers',
      image: 'https://www.undp.org/sites/demo.jpg',
      summary: null,
      publish_date: null,
    });
  });

  it('uses the article photo when the share image is the site logo', () => {
    const html = `
      <html><head>
        <meta property="og:title" content="SDG AI Lab Hosts Summer 2026 Demo Day" />
        <meta property="og:image" content="https://www.undp.org/themes/custom/undpglobal/images/meta-undp-logo.jpg" />
      </head><body>
        <picture>
          <source srcset="/sites/g/files/zskgke326/files/styles/image_with_credit_caption_wide_large_1920_x897_/public/2026-07/demo_day.jpg?itok=abc 1x" />
        </picture>
        <img src="/sites/g/files/zskgke326/files/styles/featured_content_card_mobile_343_x_150_/public/2026-10/other.jpg?itok=zzz" alt="" />
      </body></html>
    `;

    expect(previewFromHtml(html, page).image).toBe(
      'https://www.undp.org/sites/g/files/zskgke326/files/styles/image_with_credit_caption_wide_large_1920_x897_/public/2026-07/demo_day.jpg?itok=abc'
    );
  });

  it('reads the posted date and ignores the dateline in the story', () => {
    const html = `
      <html><head><meta property="og:title" content="Summer Demo Day" /></head>
      <body>
        <h6 class="posted-date"> July 9, 2026</h6>
        <p><strong>Istanbul, Türkiye, July 7, 2026</strong> — The event opened.</p>
      </body></html>
    `;

    expect(previewFromHtml(html, page).publish_date).toBe('2026-07-09');
  });

  it('ignores an image that is not an http address', () => {
    const html = `<html><head><meta property="og:title" content="Story" /><meta property="og:image" content="javascript:alert(1)" /></head></html>`;

    expect(previewFromHtml(html, page).image).toBeNull();
  });
});
