import { useEffect, useState } from 'react';
import { ContentForm } from '../shared/ContentForm';
import { StatusSelect } from '../shared/StatusSelect';
import { MarkdownField } from '../shared/MarkdownField';
import { FormFeedback } from '../shared/FormFeedback';
import { getPageContentById, createPageContent, updatePageContent } from '../../../lib/admin-queries';
import { findPageSection, pageOptions, sectionsForPage } from '../../../lib/pageSections';
import { useToast } from '../layout/Toast';
import type { PublishStatus } from '../../../lib/types';

interface PageContentFormPageProps {
  id?: string | null;
}

const firstPage = pageOptions()[0]?.slug ?? 'home';
const firstSection = sectionsForPage(firstPage)[0];

const defaultValues = {
  page_slug: firstPage,
  section_slug: firstSection?.sectionSlug ?? '',
  body: firstSection?.fallback ?? '',
  status: 'published' as PublishStatus,
};

export default function PageContentFormPage({ id }: PageContentFormPageProps) {
  const { showToast } = useToast();
  const [values, setValues] = useState(defaultValues);
  const [initialValues, setInitialValues] = useState(defaultValues);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(
    null
  );

  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setFetching(true);
    getPageContentById(id).then(({ data, error }) => {
      setFetching(false);
      if (cancelled) return;
      if (error) {
        setFeedback({ message: error, type: 'error' });
        return;
      }
      if (data) {
        const v = {
          page_slug: data.page_slug,
          section_slug: data.section_slug,
          body: data.body,
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
      setFeedback({ message: 'Content is required', type: 'error' });
      return;
    }
    setLoading(true);
    const input = {
      page_slug: values.page_slug,
      section_slug: values.section_slug,
      body: values.body,
      status: values.status,
    };
    if (!id) {
      const { error } = await createPageContent(input);
      setLoading(false);
      if (error) {
        setFeedback({ message: error, type: 'error' });
        return;
      }
      showToast('Page content created', 'success');
      window.location.hash = '#/page-content';
    } else {
      const { error } = await updatePageContent(id, input);
      setLoading(false);
      if (error) {
        setFeedback({ message: error, type: 'error' });
        return;
      }
      showToast('Page content updated', 'success');
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
      <h1 className="text-2xl font-semibold text-lab-text mb-6">
        {id ? 'Edit Page Content' : 'New Page Content'}
      </h1>
      <ContentForm
        onSubmit={handleSubmit}
        isEdit={!!id}
        loading={loading}
        backHref="#/page-content"
        isDirty={isDirty}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="page-slug" className="block text-sm font-medium text-lab-text mb-1">
              Page *
            </label>
            <select
              id="page-slug"
              required
              value={values.page_slug}
              disabled={!!id}
              onChange={(e) => {
                const page_slug = e.target.value;
                const section = sectionsForPage(page_slug)[0];
                setValues((current) => ({
                  ...current,
                  page_slug,
                  section_slug: section?.sectionSlug ?? '',
                  body: section?.fallback ?? '',
                }));
              }}
              className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
            >
              {pageOptions().map((page) => (
                <option key={page.slug} value={page.slug}>
                  {page.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="section-slug" className="block text-sm font-medium text-lab-text mb-1">
              Section *
            </label>
            <select
              id="section-slug"
              required
              value={values.section_slug}
              disabled={!!id}
              onChange={(e) => {
                const section_slug = e.target.value;
                const section = findPageSection(values.page_slug, section_slug);
                setValues((current) => ({
                  ...current,
                  section_slug,
                  body: section?.fallback ?? current.body,
                }));
              }}
              className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
            >
              {sectionsForPage(values.page_slug).map((section) => (
                <option key={section.sectionSlug} value={section.sectionSlug}>
                  {section.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-lab-muted">
              {findPageSection(values.page_slug, values.section_slug)?.kind === 'lines'
                ? 'One item per line.'
                : findPageSection(values.page_slug, values.section_slug)?.kind === 'rich'
                  ? 'Use **double asterisks** for bold. The Solutions heading may include {count}.'
                  : 'Plain text. Use a new line where the layout breaks the heading.'}
            </p>
          </div>
          <MarkdownField
            value={values.body}
            onChange={(val) => setValues((v) => ({ ...v, body: val }))}
            label="Content *"
          />
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
