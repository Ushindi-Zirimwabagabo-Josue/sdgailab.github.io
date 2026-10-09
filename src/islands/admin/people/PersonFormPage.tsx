import { useEffect, useState } from 'react';
import { ContentForm } from '../shared/ContentForm';
import { StatusSelect } from '../shared/StatusSelect';
import { ImageUpload } from '../shared/ImageUpload';
import { FormFeedback } from '../shared/FormFeedback';
import { getPerson, createPerson, updatePerson } from '../../../lib/admin-queries';
import { TEAM_GROUP_TITLES, type TeamGroupTitle } from '../../../lib/teamGroups';
import { useToast } from '../layout/Toast';
import type { PublishStatus, PeopleGroup } from '../../../lib/types';

interface PersonFormPageProps {
  id?: string | null;
}

const defaultValues = {
  name: '',
  role_title: '',
  photo_url: null as string | null,
  group_type: 'team' as PeopleGroup,
  team_group: TEAM_GROUP_TITLES[0] as TeamGroupTitle | '',
  biography: '',
  display_order: 0,
  status: 'draft' as PublishStatus,
};

const GROUP_OPTIONS: { value: PeopleGroup; label: string }[] = [
  { value: 'team', label: 'Team' },
  { value: 'advisory_board', label: 'Advisory Board' },
];

export default function PersonFormPage({ id }: PersonFormPageProps) {
  const { showToast } = useToast();
  const [values, setValues] = useState(defaultValues);
  const [initialValues, setInitialValues] = useState(defaultValues);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(
    null
  );

  const isDirty =
    JSON.stringify({ ...values, photo_url: values.photo_url || null }) !==
    JSON.stringify({ ...initialValues, photo_url: initialValues.photo_url || null });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setFetching(true);
    getPerson(id).then(({ data, error }) => {
      setFetching(false);
      if (cancelled) return;
      if (error) {
        setFeedback({ message: error, type: 'error' });
        return;
      }
      if (data) {
        const v = {
          name: data.name,
          role_title: data.role_title,
          photo_url: data.photo_url,
          group_type: data.group_type as PeopleGroup,
          team_group: (data.team_group ?? '') as TeamGroupTitle | '',
          biography: data.biography ?? '',
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
    if (!values.role_title.trim()) {
      setFeedback({ message: 'Role title is required', type: 'error' });
      return;
    }
    setLoading(true);
    if (values.group_type === 'team' && !values.team_group) {
      setFeedback({ message: 'Team group is required', type: 'error' });
      return;
    }
    const input = {
      name: values.name,
      role_title: values.role_title,
      photo_url: values.photo_url,
      group_type: values.group_type,
      team_group: values.group_type === 'team' ? values.team_group || null : null,
      biography: values.biography || null,
      display_order: values.display_order,
      status: values.status,
    };
    if (!id) {
      const { error } = await createPerson(input);
      setLoading(false);
      if (error) {
        setFeedback({ message: error, type: 'error' });
        return;
      }
      showToast('Person created', 'success');
      window.location.hash = '#/people';
    } else {
      const { error } = await updatePerson(id, input);
      setLoading(false);
      if (error) {
        setFeedback({ message: error, type: 'error' });
        return;
      }
      showToast('Person updated', 'success');
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
        href="#/people"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-lab-muted hover:text-lab-accent-soft"
      >
        <span aria-hidden="true">&larr;</span>
        Back to people
      </a>
      <h1 className="text-2xl font-semibold text-lab-text mb-6">
        {id ? 'Edit Person' : 'New Person'}
      </h1>
      <ContentForm
        onSubmit={handleSubmit}
        isEdit={!!id}
        loading={loading}
        backHref="#/people"
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
            <label className="block text-sm font-medium text-lab-text mb-1">Role Title *</label>
            <input
              type="text"
              required
              value={values.role_title}
              onChange={(e) => setValues((v) => ({ ...v, role_title: e.target.value }))}
              className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-lab-text mb-1">Group Type</label>
            <select
              value={values.group_type}
              onChange={(e) => {
                const group_type = e.target.value as PeopleGroup;
                setValues((v) => ({
                  ...v,
                  group_type,
                  team_group:
                    group_type === 'team' ? v.team_group || TEAM_GROUP_TITLES[0] : '',
                }));
              }}
              className="border rounded px-3 py-2 text-sm border-lab-border focus:outline-none focus:ring-2 focus:ring-lab-accent focus:border-lab-accent w-full"
            >
              {GROUP_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {values.group_type === 'team' && (
            <div>
              <label className="block text-sm font-medium text-lab-text mb-1">Team Group *</label>
              <select
                value={values.team_group}
                onChange={(e) =>
                  setValues((v) => ({
                    ...v,
                    team_group: e.target.value as TeamGroupTitle,
                  }))
                }
                required
                className="border rounded px-3 py-2 text-sm border-lab-border focus:outline-none focus:ring-2 focus:ring-lab-accent focus:border-lab-accent w-full"
              >
                {TEAM_GROUP_TITLES.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>
          )}
          <ImageUpload
            value={values.photo_url}
            folder="people"
            onChange={(url) => setValues((v) => ({ ...v, photo_url: url }))}
            label="Photo"
          />
          <div>
            <label className="block text-sm font-medium text-lab-text mb-1">Biography</label>
            <textarea
              value={values.biography}
              onChange={(e) => setValues((v) => ({ ...v, biography: e.target.value }))}
              rows={4}
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
