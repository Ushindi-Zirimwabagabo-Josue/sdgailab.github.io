import { useEffect, useMemo, useState } from 'react';
import { ContentTable, type Column } from '../shared/ContentTable';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { listPeople, archivePerson, deletePerson } from '../../../lib/admin-queries';
import { useToast } from '../layout/Toast';
import type { Person } from '../../../lib/types';

type Filter = 'all' | 'team' | 'advisory_board';

function matchesSearch(person: Person, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const groupLabel = person.group_type === 'team' ? 'team' : 'advisory board';
  const haystack = [
    person.name,
    person.role_title,
    person.team_group,
    person.biography,
    person.status,
    person.group_type,
    groupLabel,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(q);
}

export default function PeopleListPage() {
  const { showToast } = useToast();
  const [data, setData] = useState<Person[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [confirmState, setConfirmState] = useState<{ isOpen: boolean; itemId: string | null }>({
    isOpen: false,
    itemId: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const columns: Column<Person>[] = [
    { label: 'Name', accessor: 'name' },
    { label: 'Role', accessor: 'role_title' },
    {
      label: 'Type',
      accessor: (item) => (item.group_type === 'team' ? 'Team' : 'Advisory Board'),
    },
    {
      label: 'Team Group',
      accessor: (item) => item.team_group || '—',
    },
    { label: 'Status', accessor: 'status' },
    { label: 'Order', accessor: 'display_order' },
  ];

  const fetchList = async (pageNum = page) => {
    setLoading(true);
    setError(null);
    const { data: result, error: err, hasMore: more } = await listPeople({ page: pageNum });
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

  const filteredData = useMemo(() => {
    const byGroup =
      filter === 'all' ? data : data.filter((person) => person.group_type === filter);
    return byGroup.filter((person) => matchesSearch(person, search));
  }, [data, filter, search]);

  const onEdit = (id: string) => {
    window.location.hash = `#/people/edit/${id}`;
  };

  const onArchive = async (id: string) => {
    const { error: err } = await archivePerson(id);
    if (err) {
      showToast(err, 'error');
    } else {
      showToast('Person archived', 'success');
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
    const { error: err } = await deletePerson(id);
    setDeleteLoading(false);
    if (err) {
      showToast(err, 'error');
    } else {
      showToast('Person deleted permanently', 'success');
      setConfirmState({ isOpen: false, itemId: null });
      fetchList();
    }
  };

  const handleCancelDelete = () => {
    setConfirmState({ isOpen: false, itemId: null });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-lab-text mb-6">People</h1>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              filter === 'all' ? 'bg-lab-accent text-lab-text' : 'bg-lab-section text-lab-text hover:bg-lab-elevated'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter('team')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              filter === 'team' ? 'bg-lab-accent text-lab-text' : 'bg-lab-section text-lab-text hover:bg-lab-elevated'
            }`}
          >
            Team
          </button>
          <button
            type="button"
            onClick={() => setFilter('advisory_board')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              filter === 'advisory_board' ? 'bg-lab-accent text-lab-text' : 'bg-lab-section text-lab-text hover:bg-lab-elevated'
            }`}
          >
            Advisory Board
          </button>
        </div>
        <div className="w-full sm:max-w-md">
          <label htmlFor="people-search" className="sr-only">
            Search people
          </label>
          <input
            id="people-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, role, status…"
            className="w-full rounded-md border border-lab-border bg-lab-surface px-3 py-2 text-sm text-lab-text placeholder:text-lab-subtle focus:outline-none focus:ring-2 focus:ring-lab-accent focus:border-lab-accent"
          />
        </div>
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
        addNewHref="#/people/new"
        page={page}
        hasMore={hasMore}
        onPageChange={setPage}
      />
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title="Delete Person"
        message="This will permanently delete this person. This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
