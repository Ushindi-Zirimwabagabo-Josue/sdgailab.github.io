import { useEffect, useMemo, useState } from 'react';
import { getPublishedNews } from '../lib/queries';
import type { NewsListItem } from '../lib/types';
import { withBase } from '../lib/url';

function NewsCard({ article }: { article: NewsListItem }) {
  return (
    <a href={withBase(`/news/detail/?slug=${article.slug}`)} className="news-card">
      {article.featured_image_url ? (
        <div className="news-card-image">
          <img src={article.featured_image_url} alt="" loading="lazy" decoding="async" />
        </div>
      ) : null}
      <div className="news-card-body">
        <div className="news-card-meta">
          <time dateTime={article.publish_date}>
            {new Date(article.publish_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {article.author_name ? <span>{article.author_name}</span> : null}
        </div>
        <h2>{article.title}</h2>
        {article.summary ? <p>{article.summary}</p> : null}
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
      <p className="news-status" role="status" aria-label="Loading news">
        Loading news…
      </p>
    );
  }

  return (
    <div>
      {error ? <p className="news-note">Newsroom updates are currently being refreshed.</p> : null}

      {articles.length === 0 ? (
        <div className="news-empty">
          <h2>News and publications are being updated.</h2>
          <p>Published updates, publications and learning notes will be listed here.</p>
        </div>
      ) : (
        <>
          <div className="news-toolbar">
            <label className="news-search">
              Search news
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by title, keyword, or year"
                aria-describedby="news-search-count"
              />
            </label>
          </div>
          <p id="news-search-count" className="news-count" aria-live="polite">
            Showing {filteredArticles.length} of {articles.length} news items
          </p>

          {filteredArticles.length === 0 ? (
            <div className="news-empty">
              <h2>No news items match your search.</h2>
              <p>Try another keyword or year.</p>
            </div>
          ) : (
            <>
              <div className="news-grid">
                {filteredArticles.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
              {!normalizedSearchTerm && hasMore ? (
                <div className="news-more">
                  <button type="button" onClick={loadMore} disabled={loadingMore}>
                    {loadingMore ? 'Loading…' : 'Load more news'}
                  </button>
                </div>
              ) : null}
            </>
          )}
        </>
      )}
    </div>
  );
}