import { useEffect, useMemo, useState } from 'react';
import { getPublishedNews } from '../lib/queries';
import type { NewsListItem } from '../lib/types';
import { withBase } from '../lib/url';

function NewsCard({ article }: { article: NewsListItem }) {
  return (
    <a
      href={withBase(`/news/detail/?slug=${article.slug}`)}
      className="group block overflow-hidden rounded-2xl bg-lab-surface ring-1 ring-lab-border/70 transition hover:-translate-y-1 hover:ring-lab-accent/55 hover:shadow-[0_18px_42px_rgba(0,0,0,0.18)]"
    >
      {article.featured_image_url && (
        <div className="aspect-video overflow-hidden bg-lab-section">
          <img
            src={article.featured_image_url}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-5">
        <div className="mb-2 flex items-center gap-2 text-sm text-lab-subtle">
          <time dateTime={article.publish_date}>
            {new Date(article.publish_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {article.author_name && (
            <>
              <span aria-hidden="true">&middot;</span>
              <span>{article.author_name}</span>
            </>
          )}
        </div>
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-lab-text transition-colors group-hover:text-lab-accent-soft">
          {article.title}
        </h3>
        {article.summary && (
          <p className="line-clamp-3 text-sm text-lab-muted">{article.summary}</p>
        )}
      </div>
    </a>
  );
}

export default function NewsList() {
  const [articles, setArticles] = useState<NewsListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getPublishedNews({ page: 1 }).then(({ data, error: err, hasMore: more }) => {
      if (err) setError(err);
      setArticles(data);
      setHasMore(more);
      setPage(1);
      setLoading(false);
    });
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    getPublishedNews({ page: nextPage }).then(({ data, error: err, hasMore: more }) => {
      setLoadingMore(false);
      if (err) {
        setError(err);
        return;
      }
      setArticles((prev) => [...prev, ...data]);
      setPage(nextPage);
      setHasMore(more);
    });
  };

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredArticles = useMemo(() => {
    if (!normalizedSearchTerm) return articles;

    return articles.filter((article) => {
      const searchableText = [
        article.title,
        article.summary,
        article.author_name,
        article.publish_date,
        article.publish_date ? new Date(article.publish_date).getFullYear().toString() : '',
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(normalizedSearchTerm);
    });
  }, [articles, normalizedSearchTerm]);

  if (loading) {
    return (
      <div
        className="h-36 rounded-xl border border-lab-border bg-lab-section"
        role="status"
        aria-label="Loading news"
      />
    );
  }

  return (
    <section aria-labelledby="news-list-heading">
      {error && (
        <p className="mb-5 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
          Newsroom updates are currently being refreshed.
        </p>
      )}

      {articles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-lab-border bg-lab-section p-8 text-center">
          <h3 className="text-lg font-bold text-lab-text">News and publications are being updated.</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-lab-muted">
            Published updates, publications and learning notes will be listed here.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-8 rounded-[1.5rem] border border-lab-border bg-lab-section p-5 shadow-[0_18px_44px_rgba(0,0,0,0.12)] sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 id="news-list-heading" className="text-xl font-black tracking-[-0.03em] text-lab-text">
                  News
                </h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-lab-muted">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
              <label className="w-full md:max-w-md">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-lab-accent-soft">
                  Search news
                </span>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by title, keyword, author, or year"
                  className="w-full rounded-full border border-lab-border bg-lab-base px-5 py-3 text-sm font-semibold text-lab-text outline-none transition placeholder:text-lab-subtle focus:border-lab-accent focus:ring-4 focus:ring-lab-accent/20"
                  aria-describedby="news-search-count"
                />
              </label>
            </div>
            <p id="news-search-count" className="mt-4 text-sm font-semibold text-lab-muted" aria-live="polite">
              Showing {filteredArticles.length} of {articles.length} news items
            </p>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-lab-border bg-lab-section p-8 text-center">
              <h3 className="text-lg font-black text-lab-text">No news items match your search.</h3>
              <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-6 text-lab-muted">
                Try another keyword, author, or year.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredArticles.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
              {!normalizedSearchTerm && hasMore && (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="rounded-full border border-lab-border bg-lab-section px-6 py-3 text-sm font-bold text-lab-text transition hover:border-lab-accent disabled:opacity-50"
                  >
                    {loadingMore ? 'Loading…' : 'Load more news'}
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}