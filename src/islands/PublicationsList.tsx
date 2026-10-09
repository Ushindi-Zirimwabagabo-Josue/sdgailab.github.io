import { useEffect, useMemo, useState } from 'react';
import { samplePublications } from '../data/sampleContent';
import { getPublishedNews } from '../lib/queries';
import type { NewsListItem } from '../lib/types';
import { withBase } from '../lib/url';

function PublicationCard({ publication }: { publication: NewsListItem }) {
  const href = withBase(`/news/detail/?slug=${publication.slug}`);
  const showSummary = !publication.featured_image_url && publication.summary;

  return (
    <article className="flex h-full flex-col">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-lab-text">Publications</p>

      {publication.featured_image_url ? (
        <a href={href} className="group mt-4 block overflow-hidden">
          <img
            src={publication.featured_image_url}
            alt=""
            className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </a>
      ) : null}

      <h2 className="mt-4 text-[clamp(1.35rem,2vw,1.75rem)] font-bold leading-tight text-lab-text">
        <a href={href} className="transition hover:text-lab-accent-soft">
          {publication.title}
        </a>
      </h2>

      {showSummary ? (
        <p className="mt-4 flex-1 text-base leading-7 text-lab-muted">{publication.summary}</p>
      ) : (
        <div className="flex-1" />
      )}

      <a
        href={href}
        className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-lab-accent-soft transition hover:text-lab-text"
      >
        Read more
        <span aria-hidden="true">&gt;</span>
      </a>
    </article>
  );
}

export default function PublicationsList() {
  const [publications, setPublications] = useState<NewsListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getPublishedNews().then(({ data }) => {
      setPublications(data.length > 0 ? data : samplePublications);
      setLoading(false);
    });
  }, []);

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredPublications = useMemo(() => {
    if (!normalizedSearchTerm) return publications;

    return publications.filter((publication) => {
      const searchableText = [
        publication.title,
        publication.summary,
        publication.author_name,
        publication.publish_date,
        publication.publish_date ? new Date(publication.publish_date).getFullYear().toString() : '',
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(normalizedSearchTerm);
    });
  }, [normalizedSearchTerm, publications]);

  if (loading) {
    return (
      <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Loading publications">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-72 animate-pulse rounded-lg bg-lab-section" />
        ))}
      </div>
    );
  }

  if (publications.length === 0) {
    return (
      <p className="text-center text-lg text-lab-muted">No publications are available yet.</p>
    );
  }

  return (
    <section aria-labelledby="publications-list-heading">
      <div className="mb-8 rounded-[1.5rem] border border-lab-border bg-lab-section p-5 shadow-[0_18px_44px_rgba(0,0,0,0.12)] sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="publications-list-heading" className="text-xl font-black tracking-[-0.03em] text-lab-text">
              Publications
            </h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-lab-muted">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          <label className="w-full md:max-w-md">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-lab-accent-soft">
              Search publications
            </span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by title, keyword, author, or year"
              className="w-full rounded-full border border-lab-border bg-lab-base px-5 py-3 text-sm font-semibold text-lab-text outline-none transition placeholder:text-lab-subtle focus:border-lab-accent focus:ring-4 focus:ring-lab-accent/20"
              aria-describedby="publications-search-count"
            />
          </label>
        </div>
        <p id="publications-search-count" className="mt-4 text-sm font-semibold text-lab-muted" aria-live="polite">
          Showing {filteredPublications.length} of {publications.length} publications
        </p>
      </div>

      {filteredPublications.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-lab-border bg-lab-section p-8 text-center">
          <h3 className="text-lg font-black text-lab-text">No publications match your search.</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-6 text-lab-muted">
            Try another keyword, author, or year.
          </p>
        </div>
      ) : (
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
          {filteredPublications.map((publication) => (
            <PublicationCard key={publication.id} publication={publication} />
          ))}
        </div>
      )}
    </section>
  );
}