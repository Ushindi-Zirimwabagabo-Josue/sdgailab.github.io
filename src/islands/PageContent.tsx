import { useEffect, useState } from 'react';
import { getSamplePageContent } from '../data/sampleContent';
import { renderMarkdown } from '../lib/markdown';
import { logAppError } from '../lib/observability';
import { getPageContent } from '../lib/queries';
import ObservabilityBoundary from './components/ObservabilityBoundary';

const LOAD_TIMEOUT_MS = 12_000;

interface PageContentProps {
  pageSlug: string;
  sectionSlug: string;
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error('Request timed out')), ms);
    promise
      .then((value) => {
        window.clearTimeout(timer);
        resolve(value);
      })
      .catch((error: unknown) => {
        window.clearTimeout(timer);
        reject(error);
      });
  });
}

export default function PageContent({ pageSlug, sectionSlug }: PageContentProps) {
  return (
    <ObservabilityBoundary surface="public" name="PageContent">
      <PageContentInner pageSlug={pageSlug} sectionSlug={sectionSlug} />
    </ObservabilityBoundary>
  );
}

function PageContentInner({ pageSlug, sectionSlug }: PageContentProps) {
  const [html, setHtml] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadContent() {
      try {
        const { data, error: err } = await withTimeout(
          getPageContent(pageSlug, sectionSlug),
          LOAD_TIMEOUT_MS
        );

        if (cancelled) return;

        const body = data?.body ?? getSamplePageContent(pageSlug, sectionSlug);
        if (body) {
          setHtml(await renderMarkdown(body));
        } else if (err) {
          logAppError('public.page_content.load', new Error(err), { pageSlug, sectionSlug });
          setError(err);
        }
      } catch (error) {
        if (cancelled) return;
        logAppError('public.page_content.load', error, { pageSlug, sectionSlug });
        const sample = getSamplePageContent(pageSlug, sectionSlug);
        if (sample) {
          setHtml(await renderMarkdown(sample));
        } else {
          setError('Unable to load content at this time.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadContent();

    return () => {
      cancelled = true;
    };
  }, [pageSlug, sectionSlug]);

  if (loading) {
    return (
      <div className="flex justify-center py-12" role="status" aria-label="Loading">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary" />
        <span className="sr-only">Loading content...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-lab-subtle">
        <p>Unable to load content at this time.</p>
      </div>
    );
  }

  if (!html) {
    return (
      <div className="text-center py-8 text-lab-subtle italic">
        <p>No content available yet.</p>
      </div>
    );
  }

  return (
    <div
      className="prose-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
