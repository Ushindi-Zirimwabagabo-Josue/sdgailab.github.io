import { useEffect, useState } from 'react';
import { ContentForm } from '../shared/ContentForm';
import { StatusSelect } from '../shared/StatusSelect';
import { SlugField } from '../shared/SlugField';
import { MarkdownField } from '../shared/MarkdownField';
import { ImageUpload } from '../shared/ImageUpload';
import { FormFeedback } from '../shared/FormFeedback';
import { getNewsArticle, createNewsArticle, updateNewsArticle } from '../../../lib/admin-queries';
import { useToast } from '../layout/Toast';
import type { PublishStatus } from '../../../lib/types';

interface NewsFormPageProps {
  id?: string | null;
}

const defaultValues = {
  title: '',
  slug: '',
  body: '',
  summary: '',
  featured_image_url: null as string | null,
  author_name: '',
  publish_date: new Date().toISOString().split('T')[0],
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (!values.body.trim()) {
      setFeedback({ message: 'Body is required', type: 'error' });
      return;
    }
    setLoading(true);
    const input = {
      title: values.title,
      slug: values.slug,
      body: values.body,
      summary: values.summary || null,
      featured_image_url: values.featured_image_url,
      author_name: values.author_name || null,
      publish_date: values.publish_date,
      status: values.status,
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
          <MarkdownField
            value={values.body}
            onChange={(val) => setValues((v) => ({ ...v, body: val }))}
            label="Body *"
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
          <FormFeedback
            message={feedback?.message ?? null}
            type={feedback?.type ?? 'error'}
          />
        </div>
      </ContentForm>
    </div>
  );
}
