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
      <div className="flex flex-col items-center py-12" role="status" aria-label="Loading">
        <h1 className="sr-only">Loading article</h1>
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary" />
        <span className="sr-only">Loading article...</span>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="text-center py-12" role="alert">
        <h1 className="text-2xl font-bold text-lab-text mb-4">Article Not Found</h1>
        <p className="text-xl text-lab-subtle mb-4">{error || 'The requested article could not be found.'}</p>
        <a href={withBase('/news')} className="text-lab-accent-soft hover:underline font-medium">
          &larr; Back to News
        </a>
      </div>
    );
  }

  return (
    <article>
      <a href={withBase('/news')} className="inline-flex items-center text-lab-accent-soft hover:underline font-medium mb-6">
        &larr; Back to News
      </a>

      {article.featured_image_url && (
        <div className="aspect-video overflow-hidden rounded-lg bg-lab-section mb-8 max-h-96">
          <img
            src={article.featured_image_url}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-lab-text mb-4">
          {article.title}
        </h1>
        <div className="flex items-center gap-2 text-sm text-lab-subtle">
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
              <span>By {article.author_name}</span>
            </>
          )}
        </div>
      </header>

      <div
        className="prose-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
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
