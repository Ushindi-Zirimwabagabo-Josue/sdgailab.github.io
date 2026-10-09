import { useEffect, useState } from 'react';
import { ContentForm } from '../shared/ContentForm';
import { StatusSelect } from '../shared/StatusSelect';
import { FormFeedback } from '../shared/FormFeedback';
import {
  createEvolutionTimelineItem,
  getEvolutionTimelineItem,
  updateEvolutionTimelineItem,
} from '../../../lib/admin-queries';
import { useToast } from '../layout/Toast';
import type { PublishStatus } from '../../../lib/types';

interface EvolutionTimelineFormPageProps {
  id?: string | null;
}

interface EvolutionTimelineFormValues {
  period: string;
  title: string;
  body: string;
  display_order: number;
  status: PublishStatus;
}

const defaultValues: EvolutionTimelineFormValues = {
  period: '',
  title: '',
  body: '',
  display_order: 0,
  status: 'draft',
};

export default function EvolutionTimelineFormPage({ id }: EvolutionTimelineFormPageProps) {
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
    getEvolutionTimelineItem(id).then(({ data, error }) => {
      setFetching(false);
      if (cancelled) return;
      if (error) {
        setFeedback({ message: error, type: 'error' });
        return;
      }
      if (data) {
        const v: EvolutionTimelineFormValues = {
          period: data.period,
          title: data.title,
          body: data.body ?? '',
          display_order: data.display_order,
          status: data.status,
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
    setLoading(true);
    const input = {
      period: values.period,
      title: values.title,
      body: values.body,
      display_order: values.display_order,
      status: values.status,
    };
    if (!id) {
      const { error } = await createEvolutionTimelineItem(input);
      setLoading(false);
      if (error) {
        setFeedback({ message: error, type: 'error' });
        return;
      }
      showToast('Timeline entry created', 'success');
      window.location.hash = '#/evolution-timeline';
    } else {
      const { error } = await updateEvolutionTimelineItem(id, input);
      setLoading(false);
      if (error) {
        setFeedback({ message: error, type: 'error' });
        return;
      }
      showToast('Timeline entry updated', 'success');
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
        {id ? 'Edit Timeline Entry' : 'New Timeline Entry'}
      </h1>
      <ContentForm
        onSubmit={handleSubmit}
        isEdit={!!id}
        loading={loading}
        backHref="#/evolution-timeline"
        isDirty={isDirty}
      >
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-lab-text mb-1">Period *</label>
              <input
                type="text"
                required
                value={values.period}
                onChange={(e) => setValues((v) => ({ ...v, period: e.target.value }))}
                className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
                placeholder="2019-2020"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-lab-text mb-1">Title *</label>
              <input
                type="text"
                required
                value={values.title}
                onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
                className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
                placeholder="Foundations"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-lab-text mb-1">Body</label>
            <textarea
              value={values.body}
              onChange={(e) => setValues((v) => ({ ...v, body: e.target.value }))}
              className="min-h-32 w-full border border-lab-border rounded-md px-3 py-2 text-sm"
              placeholder="Lorem ipsum dolor sit amet..."
            />
          </div>
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