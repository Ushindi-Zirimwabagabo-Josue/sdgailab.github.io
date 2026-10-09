import { useEffect, useState } from 'react';
import { ContentTable, type Column } from '../shared/ContentTable';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import {
  archiveEvolutionTimelineItem,
  deleteEvolutionTimelineItem,
  listEvolutionTimeline,
} from '../../../lib/admin-queries';
import { useToast } from '../layout/Toast';
import type { EvolutionTimelineItem } from '../../../lib/types';

export default function EvolutionTimelineListPage() {
  const { showToast } = useToast();
  const [data, setData] = useState<EvolutionTimelineItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<{ isOpen: boolean; itemId: string | null }>({
    isOpen: false,
    itemId: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const columns: Column<EvolutionTimelineItem>[] = [
    { label: 'Period', accessor: 'period' },
    { label: 'Title', accessor: 'title' },
    { label: 'Status', accessor: 'status' },
    { label: 'Order', accessor: 'display_order' },
  ];

  const fetchList = async (pageNum = page) => {
    setLoading(true);
    setError(null);
    const { data: result, error: err, hasMore: more } = await listEvolutionTimeline({ page: pageNum });
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

  const onEdit = (id: string) => {
    window.location.hash = `#/evolution-timeline/edit/${id}`;
  };

  const onArchive = async (id: string) => {
    const { error: err } = await archiveEvolutionTimelineItem(id);
    if (err) {
      showToast(err, 'error');
    } else {
      showToast('Timeline entry archived', 'success');
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
    const { error: err } = await deleteEvolutionTimelineItem(id);
    setDeleteLoading(false);
    if (err) {
      showToast(err, 'error');
    } else {
      showToast('Timeline entry deleted permanently', 'success');
      setConfirmState({ isOpen: false, itemId: null });
      fetchList();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-lab-text mb-2">Evolution Timeline</h1>
      <p className="mb-6 text-sm text-lab-muted">
        Manage the About page Lab evolution timeline entries.
      </p>
      <ContentTable
        columns={columns}
        data={data}
        loading={loading}
        error={error}
        onEdit={onEdit}
        onArchive={onArchive}
        onDelete={onDelete}
        onRetry={() => void fetchList(page)}
        addNewHref="#/evolution-timeline/new"
        addNewLabel="Add Timeline Entry"
        page={page}
        hasMore={hasMore}
        onPageChange={setPage}
      />
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title="Delete Timeline Entry"
        message="This will permanently delete this timeline entry from the CMS. This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmState({ isOpen: false, itemId: null })}
        loading={deleteLoading}
      />
    </div>
  );
}