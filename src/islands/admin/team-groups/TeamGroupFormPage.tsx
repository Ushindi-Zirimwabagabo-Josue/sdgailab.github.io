import { useEffect, useState } from 'react';
import { ContentForm } from '../shared/ContentForm';
import { StatusSelect } from '../shared/StatusSelect';
import { FormFeedback } from '../shared/FormFeedback';
import { getTeamGroup, createTeamGroup, updateTeamGroup } from '../../../lib/admin-queries';
import { useToast } from '../layout/Toast';
import type { PublishStatus } from '../../../lib/types';

interface TeamGroupFormPageProps {
  id?: string | null;
}

const defaultValues = {
  title: '',
  display_order: 0,
  status: 'draft' as PublishStatus,
};

export default function TeamGroupFormPage({ id }: TeamGroupFormPageProps) {
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
    getTeamGroup(id).then(({ data, error }) => {
      setFetching(false);
      if (cancelled) return;
      if (error) {
        setFeedback({ message: error, type: 'error' });
        return;
      }
      if (data) {
        const next = {
          title: data.title,
          display_order: data.display_order,
          status: data.status as PublishStatus,
        };
        setValues(next);
        setInitialValues(next);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (!values.title.trim()) {
      setFeedback({ message: 'Title is required', type: 'error' });
      return;
    }
    setLoading(true);
    const input = {
      title: values.title.trim(),
      display_order: values.display_order,
      status: values.status,
    };
    if (!id) {
      const { error } = await createTeamGroup(input);
      setLoading(false);
      if (error) {
        setFeedback({ message: error, type: 'error' });
        return;
      }
      showToast('Team group created', 'success');
      window.location.hash = '#/team-groups';
      return;
    }

    const { error } = await updateTeamGroup(id, input);
    setLoading(false);
    if (error) {
      setFeedback({ message: error, type: 'error' });
      return;
    }
    showToast('Team group updated', 'success');
    setInitialValues(values);
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
        href="#/team-groups"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-lab-muted hover:text-lab-accent-soft"
      >
        <span aria-hidden="true">&larr;</span>
        Back to team groups
      </a>
      <h1 className="text-2xl font-semibold text-lab-text mb-6">
        {id ? 'Edit Team Group' : 'New Team Group'}
      </h1>
      <ContentForm
        onSubmit={handleSubmit}
        isEdit={!!id}
        loading={loading}
        backHref="#/team-groups"
        isDirty={isDirty}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-lab-text mb-1">Title *</label>
            <input
              type="text"
              required
              maxLength={120}
              value={values.title}
              onChange={(e) => setValues((current) => ({ ...current, title: e.target.value }))}
              className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-lab-muted">
              This is the heading on the team page. Renaming a group also updates the people already in it.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-lab-text mb-1">Display Order</label>
            <input
              type="number"
              value={values.display_order}
              onChange={(e) =>
                setValues((current) => ({ ...current, display_order: Number(e.target.value) || 0 }))
              }
              className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <StatusSelect
            value={values.status}
            onChange={(status) => setValues((current) => ({ ...current, status: status as PublishStatus }))}
            label="Status"
          />
          <p className="text-xs text-lab-muted">
            Published groups appear on the team page and in the team member form. Draft groups can be assigned, but stay off the public page until published. Archived groups are hidden.
          </p>
          <FormFeedback message={feedback?.message ?? null} type={feedback?.type ?? 'error'} />
        </div>
      </ContentForm>
    </div>
  );
}
