import { useEffect, useMemo, useState } from 'react';
import { ContentTable, type Column } from '../shared/ContentTable';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { listTeamGroups, archiveTeamGroup, deleteTeamGroup } from '../../../lib/admin-queries';
import { useToast } from '../layout/Toast';
import type { TeamGroup } from '../../../lib/types';

function matchesSearch(group: TeamGroup, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [group.title, group.status].join(' ').toLowerCase().includes(q);
}

export default function TeamGroupsListPage() {
  const { showToast } = useToast();
  const [data, setData] = useState<TeamGroup[]>([]);
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

  const columns: Column<TeamGroup>[] = [
    { label: 'Title', accessor: 'title' },
    { label: 'Status', accessor: 'status' },
    { label: 'Order', accessor: 'display_order' },
  ];

  const fetchList = async (pageNum = page) => {
    setLoading(true);
    setError(null);
    const { data: result, error: err, hasMore: more } = await listTeamGroups({ page: pageNum });
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
    () => data.filter((group) => matchesSearch(group, search)),
    [data, search]
  );

  const onEdit = (id: string) => {
    window.location.hash = `#/team-groups/edit/${id}`;
  };

  const onArchive = async (id: string) => {
    const { error: err } = await archiveTeamGroup(id);
    if (err) {
      showToast(err, 'error');
    } else {
      showToast('Team group archived', 'success');
      void fetchList();
    }
  };

  const onDelete = (id: string) => {
    setConfirmState({ isOpen: true, itemId: id });
  };

  const handleConfirmDelete = async () => {
    const id = confirmState.itemId;
    if (!id) return;
    setDeleteLoading(true);
    const { error: err } = await deleteTeamGroup(id);
    setDeleteLoading(false);
    if (err) {
      showToast(err, 'error');
    } else {
      showToast('Team group deleted', 'success');
      setConfirmState({ isOpen: false, itemId: null });
      void fetchList();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-lab-text mb-2">Team Groups</h1>
      <p className="mb-6 max-w-2xl text-sm text-lab-muted">
        These titles are the sections on the public team page. Published groups can be assigned when you add or edit a team member. Archiving hides a section. Deleting is only available when no one is still in that group.
      </p>
      <div className="mb-4">
        <label htmlFor="team-groups-search" className="sr-only">
          Search team groups
        </label>
        <input
          id="team-groups-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or status…"
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
        addNewHref="#/team-groups/new"
        page={page}
        hasMore={hasMore}
        onPageChange={setPage}
      />
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title="Delete team group"
        message="This permanently deletes the group. People still assigned to it must be moved first."
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmState({ isOpen: false, itemId: null })}
        loading={deleteLoading}
      />
    </div>
  );
}
