import { useEffect, useState } from 'react';
import { ContentForm } from '../shared/ContentForm';
import { StatusSelect } from '../shared/StatusSelect';
import { FormFeedback } from '../shared/FormFeedback';
import { getStatistic, createStatistic, updateStatistic } from '../../../lib/admin-queries';
import { useToast } from '../layout/Toast';
import type { PublishStatus } from '../../../lib/types';

interface StatisticFormPageProps {
  id?: string | null;
}

const defaultValues = {
  label: '',
  value: '',
  icon_name: '',
  display_order: 0,
  status: 'draft' as PublishStatus,
};

export default function StatisticFormPage({ id }: StatisticFormPageProps) {
  const { showToast } = useToast();
  const [values, setValues] = useState(defaultValues);
  const [initialValues, setInitialValues] = useState(defaultValues);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(
    null
  );

  const isDirty =
    JSON.stringify({ ...values, icon_name: values.icon_name || null }) !==
    JSON.stringify({ ...initialValues, icon_name: initialValues.icon_name || null });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setFetching(true);
    getStatistic(id).then(({ data, error }) => {
      setFetching(false);
      if (cancelled) return;
      if (error) {
        setFeedback({ message: error, type: 'error' });
        return;
      }
      if (data) {
        const v = {
          label: data.label,
          value: data.value,
          icon_name: data.icon_name ?? '',
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
    setLoading(true);
    const input = {
      label: values.label,
      value: values.value,
      icon_name: values.icon_name || null,
      display_order: values.display_order,
      status: values.status,
    };
    if (!id) {
      const { error } = await createStatistic(input);
      setLoading(false);
      if (error) {
        setFeedback({ message: error, type: 'error' });
        return;
      }
      showToast('Statistic created', 'success');
      window.location.hash = '#/statistics';
    } else {
      const { error } = await updateStatistic(id, input);
      setLoading(false);
      if (error) {
        setFeedback({ message: error, type: 'error' });
        return;
      }
      showToast('Statistic updated', 'success');
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
        {id ? 'Edit Statistic' : 'New Statistic'}
      </h1>
      <ContentForm
        onSubmit={handleSubmit}
        isEdit={!!id}
        loading={loading}
        backHref="#/statistics"
        isDirty={isDirty}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-lab-text mb-1">Label *</label>
            <input
              type="text"
              required
              value={values.label}
              onChange={(e) => setValues((v) => ({ ...v, label: e.target.value }))}
              className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-lab-text mb-1">Value *</label>
            <input
              type="text"
              required
              value={values.value}
              onChange={(e) => setValues((v) => ({ ...v, value: e.target.value }))}
              className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-lab-text mb-1">Icon Name</label>
            <input
              type="text"
              value={values.icon_name}
              onChange={(e) => setValues((v) => ({ ...v, icon_name: e.target.value }))}
              className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
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
          <div>
            <StatusSelect
              value={values.status}
              onChange={(v) => setValues((prev) => ({ ...prev, status: v as PublishStatus }))}
              label="Status"
            />
          </div>
          <FormFeedback
            message={feedback?.message ?? null}
            type={feedback?.type ?? 'error'}
          />
        </div>
      </ContentForm>
    </div>
  );
}
