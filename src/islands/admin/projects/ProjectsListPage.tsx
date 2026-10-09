import { useEffect, useMemo, useState } from 'react';
import { ContentTable, type Column } from '../shared/ContentTable';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { listProjects, archiveProject, deleteProject } from '../../../lib/admin-queries';
import { useToast } from '../layout/Toast';
import type { Project, ProjectStatus } from '../../../lib/types';

function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const styles: Record<ProjectStatus, string> = {
    active: 'bg-green-500/15 text-green-200 border border-green-500/30',
    completed: 'bg-blue-100 text-blue-700',
    under_development: 'bg-yellow-100 text-yellow-700',
    on_hold: 'bg-lab-section text-lab-muted',
  };
  const label = status.replace(/_/g, ' ');
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[status]}`}
    >
      {label}
    </span>
  );
}

function matchesSearch(project: Project, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    project.title,
    project.slug,
    project.project_status,
    project.status,
    project.work_stream,
    project.project_category,
    project.impact_area,
    project.summary,
    ...(project.implementation_countries ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(q);
}

export default function ProjectsListPage() {
  const { showToast } = useToast();
  const [data, setData] = useState<Project[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [confirmState, setConfirmState] = useState<{ isOpen: boolean; itemId: string | null }>({
    isOpen: false,
    itemId: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const columns: Column<Project>[] = [
    { label: 'Title', accessor: 'title' },
    {
      label: 'Project Status',
      accessor: (item) => <ProjectStatusBadge status={item.project_status} />,
    },
    { label: 'Publish Status', accessor: 'status' },
    {
      label: 'Featured',
      accessor: (item) => (item.is_featured ? '✓' : '—'),
    },
    {
      label: 'Deployed',
      accessor: (item) => (item.is_deployed ? '✓' : '—'),
    },
    { label: 'Order', accessor: 'display_order' },
  ];

  const fetchList = async (pageNum = page) => {
    setLoading(true);
    setError(null);
    const { data: result, error: err, hasMore: more } = await listProjects({ page: pageNum });
    setLoading(false);
    setHasMore(more);
    if (err) {
      setError(err);
      setData([]);
    } else {
      setData(result ?? []);
    }
  };

  useEffect(() => {
    void fetchList(page);
  }, [page]);

  const filteredData = useMemo(
    () => data.filter((project) => matchesSearch(project, search)),
    [data, search]
  );

  const onEdit = (id: string) => {
    window.location.hash = `#/projects/edit/${id}`;
  };

  const onArchive = async (id: string) => {
    const { error: err } = await archiveProject(id);
    if (err) {
      showToast(err, 'error');
    } else {
      showToast('Project archived', 'success');
      fetchList();
    }
  };

  const onDelete = (id: string) => {
    setConfirmState({ isOpen: true, itemId: id });
  };

  const handleConfirmDelete = async () => {
    const id = confirmState.itemId;
    if (!id) return;
    setDeleteLoading(true);
    const { error: err } = await deleteProject(id);
    setDeleteLoading(false);
    if (err) {
      showToast(err, 'error');
    } else {
      showToast('Project deleted permanently', 'success');
      setConfirmState({ isOpen: false, itemId: null });
      fetchList();
    }
  };

  const handleCancelDelete = () => {
    setConfirmState({ isOpen: false, itemId: null });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-lab-text mb-6">Projects</h1>
      <div className="mb-4">
        <label htmlFor="projects-search" className="sr-only">
          Search projects
        </label>
        <input
          id="projects-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, slug, status, country…"
          className="w-full max-w-md rounded-md border border-lab-border bg-lab-surface px-3 py-2 text-sm text-lab-text placeholder:text-lab-subtle focus:outline-none focus:ring-2 focus:ring-lab-accent focus:border-lab-accent"
        />
      </div>
      <ContentTable
        columns={columns}
        data={filteredData}
        loading={loading}
        error={error}
        onEdit={onEdit}
        onArchive={onArchive}
        onDelete={onDelete}
        onRetry={() => void fetchList(page)}
        addNewHref="#/projects/new"
        page={page}
        hasMore={hasMore}
        onPageChange={setPage}
      />
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title="Delete Project"
        message="This will permanently delete this project. This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
