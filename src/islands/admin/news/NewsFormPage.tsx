import { useEffect, useRef, useState } from 'react';
import { ContentForm } from '../shared/ContentForm';
import { StatusSelect } from '../shared/StatusSelect';
import { SlugField } from '../shared/SlugField';
import { ImageUpload } from '../shared/ImageUpload';
import { FormFeedback } from '../shared/FormFeedback';
import { getNewsArticle, createNewsArticle, updateNewsArticle } from '../../../lib/admin-queries';
import { fetchLinkPreview, type LinkPreview } from '../../../lib/linkPreview';
import { useToast } from '../layout/Toast';
import type { PublishStatus } from '../../../lib/types';

interface NewsFormPageProps {
  id?: string | null;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const defaultValues = {
  title: '',
  slug: '',
  body: '',
  summary: '',
  featured_image_url: null as string | null,
  author_name: '',
  source_url: '',
  publish_date: '',
  status: 'draft' as PublishStatus,
};

export default function NewsFormPage({ id }: NewsFormPageProps) {
  const { showToast } = useToast();
  const [values, setValues] = useState(defaultValues);
  const [initialValues, setInitialValues] = useState(defaultValues);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(
    null
  );
  const [readingSource, setReadingSource] = useState(false);
  const feedbackRef = useRef<HTMLDivElement>(null);

  const isDirty =
    JSON.stringify({ ...values, featured_image_url: values.featured_image_url || null }) !==
    JSON.stringify({ ...initialValues, featured_image_url: initialValues.featured_image_url || null });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setFetching(true);
    getNewsArticle(id).then(({ data, error }) => {
      setFetching(false);
      if (cancelled) return;
      if (error) {
        setFeedback({ message: error, type: 'error' });
        return;
      }
      if (data) {
        const v = {
          title: data.title,
          slug: data.slug,
          body: data.body,
          summary: data.summary ?? '',
          featured_image_url: data.featured_image_url,
          author_name: data.author_name ?? '',
          source_url: data.source_url ?? '',
          publish_date: data.publish_date,
          status: data.status as PublishStatus,
        };
        setValues(v);
        setInitialValues(v);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!feedback?.message) return;
    feedbackRef.current?.scrollIntoView?.({ block: 'start' });
  }, [feedback]);

  const applyPreview = (
    current: typeof values,
    data: LinkPreview,
    overwrite: boolean
  ) => {
    const title = overwrite || !current.title.trim() ? data.title : current.title;
    return {
      ...current,
      title,
      slug: current.slug.trim() ? current.slug : slugify(title),
      summary: overwrite || !current.summary.trim() ? data.summary ?? current.summary : current.summary,
      featured_image_url: overwrite || !current.featured_image_url ? data.image ?? current.featured_image_url : current.featured_image_url,
      publish_date: (overwrite || !current.publish_date) && data.publish_date ? data.publish_date : current.publish_date,
    };
  };

  const readSource = async (overwrite = true) => {
    const sourceUrl = values.source_url.trim();
    if (!sourceUrl) {
      setFeedback({ message: 'Enter the source link first.', type: 'error' });
      return null;
    }
    setFeedback(null);
    setReadingSource(true);
    const { data, error } = await fetchLinkPreview(sourceUrl);
    setReadingSource(false);
    if (error || !data) {
      setFeedback({ message: error || 'The page could not be read.', type: 'error' });
      return null;
    }
    const next = applyPreview(values, data, overwrite);
    setValues(next);
    showToast('Title, image, and date filled from the source page', 'success');
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (!values.source_url.trim()) {
      setFeedback({ message: 'Source link is required', type: 'error' });
      return;
    }
    let next = values;
    if (!next.title.trim() || !next.featured_image_url || !next.publish_date) {
      const filled = await readSource(false);
      if (!filled) return;
      next = filled;
    }
    setLoading(true);
    const input = {
      title: next.title,
      slug: next.slug,
      body: next.body,
      summary: next.summary || null,
      featured_image_url: next.featured_image_url,
      author_name: next.author_name || null,
      source_url: next.source_url.trim(),
      publish_date: next.publish_date,
      status: next.status,
    };
    if (!id) {
      const { error } = await createNewsArticle(input);
      setLoading(false);
      if (error) {
        setFeedback({ message: error, type: 'error' });
        return;
      }
      showToast('Article created', 'success');
      window.location.hash = '#/news';
    } else {
      const { error } = await updateNewsArticle(id, input);
      setLoading(false);
      if (error) {
        setFeedback({ message: error, type: 'error' });
        return;
      }
      showToast('Article updated', 'success');
      setInitialValues(values);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-lab-accent border-t-transparent"
          aria-label="Loading"
        />
      </div>
    );
  }

  return (
    <div>
      <a
        href="#/news"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-lab-muted hover:text-lab-accent-soft"
      >
        <span aria-hidden="true">&larr;</span>
        Back to news
      </a>
      <h1 className="text-2xl font-semibold text-lab-text mb-6">
        {id ? 'Edit Article' : 'New Article'}
      </h1>
      <ContentForm
        onSubmit={handleSubmit}
        isEdit={!!id}
        loading={loading}
        backHref="#/news"
        isDirty={isDirty}
      >
        <div className="space-y-4">
          <div ref={feedbackRef}>
            <FormFeedback
              message={feedback?.message ?? null}
              type={feedback?.type ?? 'error'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-lab-text mb-1">Source link *</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="url"
                required
                value={values.source_url}
                onChange={(e) => setValues((v) => ({ ...v, source_url: e.target.value }))}
                onBlur={() => {
                  if (values.source_url.trim() && (!values.title.trim() || !values.featured_image_url || !values.publish_date)) {
                    void readSource(false);
                  }
                }}
                placeholder="https://"
                className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => void readSource(true)}
                disabled={readingSource}
                className="shrink-0 rounded-md border border-lab-border px-3 py-2 text-sm font-medium text-lab-text disabled:opacity-60"
              >
                {readingSource ? 'Reading page…' : 'Fill title, image, and date'}
              </button>
            </div>
            <span className="mt-1 block text-xs text-lab-muted">Paste the story link. The button reads its title, image, and publication date, and the card opens that page.</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-lab-text mb-1">Title *</label>
            <input
              type="text"
              required
              value={values.title}
              onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
              className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <SlugField
            value={values.slug}
            sourceValue={values.title}
            onChange={(slug) => setValues((v) => ({ ...v, slug }))}
          />
          <div>
            <label className="block text-sm font-medium text-lab-text mb-1">Summary</label>
            <textarea
              rows={3}
              value={values.summary}
              onChange={(e) => setValues((v) => ({ ...v, summary: e.target.value }))}
              className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <ImageUpload
            value={values.featured_image_url}
            folder="news"
            onChange={(url) => setValues((v) => ({ ...v, featured_image_url: url }))}
            label="Featured Image"
          />
          <div>
            <label className="block text-sm font-medium text-lab-text mb-1">Author Name</label>
            <input
              type="text"
              value={values.author_name}
              onChange={(e) => setValues((v) => ({ ...v, author_name: e.target.value }))}
              className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-lab-text mb-1">Publish Date</label>
            <input
              type="date"
              value={values.publish_date}
              onChange={(e) => setValues((v) => ({ ...v, publish_date: e.target.value }))}
              className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <StatusSelect
            value={values.status}
            onChange={(v) => setValues((prev) => ({ ...prev, status: v as PublishStatus }))}
            label="Status"
          />
        </div>
      </ContentForm>
    </div>
  );
}
