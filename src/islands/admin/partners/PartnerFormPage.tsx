import { useEffect, useState } from 'react';
import { ContentForm } from '../shared/ContentForm';
import { StatusSelect } from '../shared/StatusSelect';
import { ImageUpload } from '../shared/ImageUpload';
import { FormFeedback } from '../shared/FormFeedback';
import { getPartner, createPartner, updatePartner } from '../../../lib/admin-queries';
import { useToast } from '../layout/Toast';
import type { PublishStatus } from '../../../lib/types';

interface PartnerFormPageProps {
  id?: string | null;
}

const defaultValues = {
  name: '',
  logo_url: null as string | null,
  website_url: '',
  display_order: 0,
  status: 'draft' as PublishStatus,
};

export default function PartnerFormPage({ id }: PartnerFormPageProps) {
  const { showToast } = useToast();
  const [values, setValues] = useState(defaultValues);
  const [initialValues, setInitialValues] = useState(defaultValues);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(
    null
  );

  const isDirty =
    JSON.stringify({ ...values, logo_url: values.logo_url || null }) !==
    JSON.stringify({ ...initialValues, logo_url: initialValues.logo_url || null });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setFetching(true);
    getPartner(id).then(({ data, error }) => {
      setFetching(false);
      if (cancelled) return;
      if (error) {
        setFeedback({ message: error, type: 'error' });
        return;
      }
      if (data) {
        const v = {
          name: data.name,
          logo_url: data.logo_url,
          website_url: data.website_url,
          display_order: data.display_order,
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
    if (!values.name.trim()) {
      setFeedback({ message: 'Name is required', type: 'error' });
      return;
    }
    if (!values.website_url.trim()) {
      setFeedback({ message: 'Website URL is required', type: 'error' });
      return;
    }
    setLoading(true);
    const input = {
      name: values.name,
      logo_url: values.logo_url,
      website_url: values.website_url,
      display_order: values.display_order,
      status: values.status,
    };
    if (!id) {
      const { error } = await createPartner(input);
      setLoading(false);
      if (error) {
        setFeedback({ message: error, type: 'error' });
        return;
      }
      showToast('Partner created', 'success');
      window.location.hash = '#/partners';
    } else {
      const { error } = await updatePartner(id, input);
      setLoading(false);
      if (error) {
        setFeedback({ message: error, type: 'error' });
        return;
      }
      showToast('Partner updated', 'success');
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
        href="#/partners"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-lab-muted hover:text-lab-accent-soft"
      >
        <span aria-hidden="true">&larr;</span>
        Back to partners
      </a>
      <h1 className="text-2xl font-semibold text-lab-text mb-6">
        {id ? 'Edit Partner' : 'New Partner'}
      </h1>
      <ContentForm
        onSubmit={handleSubmit}
        isEdit={!!id}
        loading={loading}
        backHref="#/partners"
        isDirty={isDirty}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-lab-text mb-1">Name *</label>
            <input
              type="text"
              required
              value={values.name}
              onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
              className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-lab-text mb-1">Website URL *</label>
            <input
              type="url"
              required
              value={values.website_url}
              onChange={(e) => setValues((v) => ({ ...v, website_url: e.target.value }))}
              className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <ImageUpload
            value={values.logo_url}
            folder="partners"
            onChange={(url) => setValues((v) => ({ ...v, logo_url: url }))}
            label="Logo"
          />
          <div>
            <label className="block text-sm font-medium text-lab-text mb-1">Display Order</label>
            <input
              type="number"
              value={values.display_order}
              onChange={(e) =>
                setValues((v) => ({ ...v, display_order: Number(e.target.value) || 0 }))
              }
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
