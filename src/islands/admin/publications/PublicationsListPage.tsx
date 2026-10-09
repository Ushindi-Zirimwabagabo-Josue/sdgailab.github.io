import { useEffect, useMemo, useState } from 'react';
import { ContentTable, type Column } from '../shared/ContentTable';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { archivePublication, deletePublication, listPublications } from '../../../lib/admin-queries';
import { useToast } from '../layout/Toast';
import type { Publication, PublicationType } from '../../../lib/types';

const typeLabels: Record<PublicationType, string> = {
  report: 'Report',
  brief_white_paper: 'Brief / white paper',
  academic_paper: 'Academic paper',
  dataset: 'Dataset',
};

function matchesSearch(publication: Publication, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return [publication.title, publication.slug, publication.authors, publication.publisher, publication.summary, publication.publication_type, publication.status]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(normalized);
}

export default function PublicationsListPage() {
  const { showToast } = useToast();
  const [data, setData] = useState<Publication[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [confirmState, setConfirmState] = useState<{ isOpen: boolean; itemId: string | null }>({ isOpen: false, itemId: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const columns: Column<Publication>[] = [
    { label: 'Title', accessor: 'title' },
    { label: 'Type', accessor: (item) => typeLabels[item.publication_type] },
    { label: 'Year', accessor: (item) => item.publication_date?.slice(0, 4) || item.date_label || '—' },
    { label: 'Status', accessor: 'status' },
  ];

  const fetchList = async (pageNum = page) => {
    setLoading(true);
    setError(null);
    const { data: result, error: listError, hasMore: more } = await listPublications({ page: pageNum });
    setLoading(false);
    setHasMore(more);
    if (listError) {
      setError(listError);
      setData([]);
    } else {
      setData(result ?? []);
    }
  };

  useEffect(() => { void fetchList(page); }, [page]);

  const filteredData = useMemo(() => data.filter((publication) => matchesSearch(publication, search)), [data, search]);

  const confirmDelete = async () => {
    if (!confirmState.itemId) return;
    setDeleteLoading(true);
    const { error: deleteError } = await deletePublication(confirmState.itemId);
    setDeleteLoading(false);
    if (deleteError) {
      showToast(deleteError, 'error');
      return;
    }
    showToast('Publication deleted permanently', 'success');
    setConfirmState({ isOpen: false, itemId: null });
    void fetchList();
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-lab-text">Research publications</h1>
      <div className="mb-4">
        <label htmlFor="publication-search" className="sr-only">Search publications</label>
        <input id="publication-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, author, publisher, type or status…" className="w-full max-w-md rounded-md border border-lab-border bg-lab-surface px-3 py-2 text-sm text-lab-text placeholder:text-lab-subtle focus:border-lab-accent focus:outline-none focus:ring-2 focus:ring-lab-accent" />
      </div>
      <ContentTable
        columns={columns}
        data={filteredData}
        loading={loading}
        error={error}
        onEdit={(id) => { window.location.hash = `#/publications/edit/${id}`; }}
        onArchive={async (id) => {
          const { error: archiveError } = await archivePublication(id);
          if (archiveError) showToast(archiveError, 'error');
          else { showToast('Publication archived', 'success'); void fetchList(); }
        }}
        onDelete={(id) => setConfirmState({ isOpen: true, itemId: id })}
        onRetry={() => void fetchList(page)}
        addNewHref="#/publications/new"
        page={page}
        hasMore={hasMore}
        onPageChange={setPage}
      />
      <ConfirmDialog isOpen={confirmState.isOpen} title="Delete publication" message="This will permanently delete this publication. This action cannot be undone." onConfirm={confirmDelete} onCancel={() => setConfirmState({ isOpen: false, itemId: null })} loading={deleteLoading} />
    </div>
  );
}
