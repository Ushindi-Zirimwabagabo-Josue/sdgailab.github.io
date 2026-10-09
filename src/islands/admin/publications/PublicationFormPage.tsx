import { useEffect, useState } from 'react';
import { ContentForm } from '../shared/ContentForm';
import { FormFeedback } from '../shared/FormFeedback';
import { ImageUpload } from '../shared/ImageUpload';
import { SlugField } from '../shared/SlugField';
import { StatusSelect } from '../shared/StatusSelect';
import { createPublication, getPublication, updatePublication } from '../../../lib/admin-queries';
import { useToast } from '../layout/Toast';
import type { PublicationType, PublishStatus } from '../../../lib/types';

interface PublicationFormPageProps { id?: string | null; }

const defaultValues = {
  title: '', slug: '', publication_type: 'report' as PublicationType, authors: '', publication_date: '', date_label: '', publisher: '', summary: '', source_url: '', cover_image_url: null as string | null, display_order: 0, status: 'draft' as PublishStatus,
};

export default function PublicationFormPage({ id }: PublicationFormPageProps) {
  const { showToast } = useToast();
  const [values, setValues] = useState(defaultValues);
  const [initialValues, setInitialValues] = useState(defaultValues);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(Boolean(id));
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getPublication(id).then(({ data, error }) => {
      if (cancelled) return;
      setFetching(false);
      if (error) { setFeedback({ message: error, type: 'error' }); return; }
      if (!data) return;
      const next = {
        title: data.title, slug: data.slug, publication_type: data.publication_type, authors: data.authors ?? '', publication_date: data.publication_date ?? '', date_label: data.date_label ?? '', publisher: data.publisher ?? '', summary: data.summary, source_url: data.source_url, cover_image_url: data.cover_image_url, display_order: data.display_order, status: data.status,
      };
      setValues(next);
      setInitialValues(next);
    });
    return () => { cancelled = true; };
  }, [id]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFeedback(null);
    setLoading(true);
    const input = { ...values, authors: values.authors || null, publication_date: values.publication_date || null, date_label: values.date_label || null, publisher: values.publisher || null };
    const result = id ? await updatePublication(id, input) : await createPublication(input);
    setLoading(false);
    if (result.error) { setFeedback({ message: result.error, type: 'error' }); return; }
    showToast(id ? 'Publication updated' : 'Publication created', 'success');
    if (!id) window.location.hash = '#/publications';
    else setInitialValues(values);
  };

  if (fetching) return <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-lab-accent border-t-transparent" aria-label="Loading" /></div>;

  return (
    <div>
      <a href="#/publications" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-lab-muted hover:text-lab-accent-soft"><span aria-hidden="true">&larr;</span>Back to publications</a>
      <h1 className="mb-6 text-2xl font-semibold text-lab-text">{id ? 'Edit publication' : 'New publication'}</h1>
      <ContentForm onSubmit={submit} isEdit={Boolean(id)} loading={loading} backHref="#/publications" isDirty={isDirty}>
        <div className="space-y-4">
          <Field label="Title *"><input required value={values.title} onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))} className="input" /></Field>
          <SlugField value={values.slug} sourceValue={values.title} onChange={(slug) => setValues((current) => ({ ...current, slug }))} />
          <Field label="Type *"><select value={values.publication_type} onChange={(event) => setValues((current) => ({ ...current, publication_type: event.target.value as PublicationType }))} className="input"><option value="report">Report</option><option value="brief_white_paper">Brief / white paper</option><option value="academic_paper">Academic paper</option><option value="dataset">Dataset</option></select></Field>
          <Field label="Summary *"><textarea required rows={4} value={values.summary} onChange={(event) => setValues((current) => ({ ...current, summary: event.target.value }))} className="input" /></Field>
          <Field label="Source link *"><input required type="url" value={values.source_url} onChange={(event) => setValues((current) => ({ ...current, source_url: event.target.value }))} className="input" /></Field>
          <div className="grid gap-4 sm:grid-cols-2"><Field label="Authors"><input value={values.authors} onChange={(event) => setValues((current) => ({ ...current, authors: event.target.value }))} className="input" /></Field><Field label="Organization / publisher"><input value={values.publisher} onChange={(event) => setValues((current) => ({ ...current, publisher: event.target.value }))} className="input" /></Field></div>
          <div className="grid gap-4 sm:grid-cols-2"><Field label="Publication date"><input type="date" value={values.publication_date} onChange={(event) => setValues((current) => ({ ...current, publication_date: event.target.value }))} className="input" /></Field><Field label="Date label"><input value={values.date_label} onChange={(event) => setValues((current) => ({ ...current, date_label: event.target.value }))} placeholder="e.g. Available online 6 December 2023" className="input" /></Field></div>
          <Field label="Display order"><input type="number" min="0" value={values.display_order} onChange={(event) => setValues((current) => ({ ...current, display_order: Number(event.target.value) || 0 }))} className="input" /></Field>
          <ImageUpload value={values.cover_image_url} folder="publications" onChange={(url) => setValues((current) => ({ ...current, cover_image_url: url }))} label="Cover image" />
          <StatusSelect value={values.status} onChange={(status) => setValues((current) => ({ ...current, status: status as PublishStatus }))} label="Status" />
          <FormFeedback message={feedback?.message ?? null} type={feedback?.type ?? 'error'} />
        </div>
      </ContentForm>
      <style>{`.input { width: 100%; border: 1px solid rgb(63 63 70); border-radius: .375rem; padding: .5rem .75rem; font-size: .875rem; }`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-lab-text"><span className="mb-1 block">{label}</span>{children}</label>;
}
