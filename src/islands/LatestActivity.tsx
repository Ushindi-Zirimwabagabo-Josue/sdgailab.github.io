import { useEffect, useState } from 'react';
import { getPublishedNews } from '../lib/queries';
import type { NewsListItem } from '../lib/types';
import { withBase } from '../lib/url';

const discoveryLinks = [
  { label: 'Publications', href: '/resources', description: 'Lorem ipsum dolor sit amet.' },
  { label: 'News', href: '/news', description: 'Lorem ipsum dolor sit amet.' },
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function LatestActivity() {
  const [items, setItems] = useState<NewsListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublishedNews().then(({ data }) => {
      setItems(data.slice(0, 3));
      setLoading(false);
    });
  }, []);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
      <div>
        <div className="grid gap-4 sm:grid-cols-2" aria-label="Content discovery routes">
          {discoveryLinks.map((link) => (
            <a
              key={link.href}
              href={withBase(link.href)}
              className="group rounded-[1.35rem] border border-lab-border bg-lab-section p-5 no-underline transition hover:-translate-y-1 hover:border-lab-accent/50 hover:bg-lab-surface"
            >
              <span className="text-sm font-black text-lab-text">{link.label}</span>
              <span className="mt-3 block text-sm font-semibold leading-6 text-lab-muted">
                {link.description}
              </span>
              <span className="mt-5 inline-flex text-sm font-black text-lab-accent-soft group-hover:text-lab-text">
                Explore <span aria-hidden="true" className="ml-1">&rarr;</span>
              </span>
            </a>
          ))}
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-lab-border bg-lab-section p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="m-0 text-xl font-black tracking-[-0.03em] text-lab-text">Latest activity</h3>
          <a href={withBase('/news')} className="text-sm font-black text-lab-accent-soft no-underline hover:text-lab-text">
            View all
          </a>
        </div>

        {loading ? (
          <div className="space-y-3" role="status" aria-label="Loading latest activity">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-20 animate-pulse rounded-2xl bg-lab-surface" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item) => (
              <a
                key={item.id}
                href={withBase(`/news/detail/?slug=${item.slug}`)}
                className="block border-t border-lab-border/70 pt-4 no-underline first:border-t-0 first:pt-0"
              >
                <time className="text-xs font-black uppercase tracking-[0.12em] text-lab-accent-soft" dateTime={item.publish_date}>
                  {formatDate(item.publish_date)}
                </time>
                <h4 className="mt-2 text-base font-black leading-snug text-lab-text hover:text-lab-accent-soft">
                  {item.title}
                </h4>
              </a>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-lab-border bg-lab-surface p-5">
            <p className="m-0 text-sm font-semibold leading-6 text-lab-muted">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}