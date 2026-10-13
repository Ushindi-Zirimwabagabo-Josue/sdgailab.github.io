import { useEffect, useState } from 'react';
import { renderMarkdown } from '../lib/markdown';
import { logAppError } from '../lib/observability';
import { getNewsArticleBySlug } from '../lib/queries';
import type { NewsArticle } from '../lib/types';
import { withBase } from '../lib/url';
import ObservabilityBoundary from './components/ObservabilityBoundary';
import { getSampleNewsArticle } from '../data/sampleContent';

function NewsDetailContent() {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');

    if (!slug) {
      setError('No article specified.');
      setLoading(false);
      return;
    }

    getNewsArticleBySlug(slug).then(async ({ data, error: err }) => {
      if (err) {
        logAppError('public.news.load', new Error(err), { slug });
        setError(err);
      } else if (!data) {
        const sample = getSampleNewsArticle(slug);
        if (!sample) {
          setError('Article not found.');
          setLoading(false);
          return;
        }
        setArticle(sample);
        setHtml(await renderMarkdown(sample.body));
      } else {
        setArticle(data);
        setHtml(await renderMarkdown(data.body));
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <p className="news-status" role="status" aria-label="Loading">
        Loading article…
      </p>
    );
  }

  if (error || !article) {
    return (
      <div className="news-status" role="alert">
        <h1>Article Not Found</h1>
        <p>{error || 'The requested article could not be found.'}</p>
        <a href={withBase('/news')} className="news-back">
          &larr; Back to News
        </a>
      </div>
    );
  }

  return (
    <article className="news-article">
      <a href={withBase('/news')} className="news-back">
        &larr; Back to News
      </a>

      {article.featured_image_url ? (
        <div className="news-cover">
          <img src={article.featured_image_url} alt="" />
        </div>
      ) : null}

      <header>
        <h1>{article.title}</h1>
        <div className="news-meta">
          <time dateTime={article.publish_date}>
            {new Date(article.publish_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {article.author_name ? <span>By {article.author_name}</span> : null}
        </div>
      </header>

      <div className="prose-content" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}

export default function NewsDetail() {
  return (
    <ObservabilityBoundary surface="public" name="NewsDetail">
      <NewsDetailContent />
    </ObservabilityBoundary>
  );
}
