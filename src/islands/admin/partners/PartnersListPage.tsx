import { useEffect, useMemo, useState } from 'react';
import { ContentTable, type Column } from '../shared/ContentTable';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { listPartners, archivePartner, deletePartner } from '../../../lib/admin-queries';
import { useToast } from '../layout/Toast';
import type { Partner } from '../../../lib/types';

function matchesSearch(partner: Partner, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const haystack = [partner.name, partner.website_url, partner.status]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(q);
}

export default function PartnersListPage() {
  const { showToast } = useToast();
  const [data, setData] = useState<Partner[]>([]);
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

  const columns: Column<Partner>[] = [
    { label: 'Name', accessor: 'name' },
    {
      label: 'Logo',
      accessor: (item) =>
        item.logo_url ? (
          <img src={item.logo_url} alt={item.name} className="h-8 w-auto object-contain" />
        ) : (
          '—'
        ),
    },
    {
      label: 'Website',
      accessor: (item) => (
        <a
          href={item.website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lab-accent-soft underline truncate max-w-[200px] inline-block"
        >
          {item.website_url}
        </a>
      ),
    },
    { label: 'Status', accessor: 'status' },
    { label: 'Order', accessor: 'display_order' },
  ];

  const fetchList = async (pageNum = page) => {
    setLoading(true);
    setError(null);
    const { data: result, error: err, hasMore: more } = await listPartners({ page: pageNum });
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
    () => data.filter((partner) => matchesSearch(partner, search)),
    [data, search]
  );

  const onEdit = (id: string) => {
    window.location.hash = `#/partners/edit/${id}`;
  };

  const onArchive = async (id: string) => {
    const { error: err } = await archivePartner(id);
    if (err) {
      showToast(err, 'error');
    } else {
      showToast('Partner archived', 'success');
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
    const { error: err } = await deletePartner(id);
    setDeleteLoading(false);
    if (err) {
      showToast(err, 'error');
    } else {
      showToast('Partner deleted permanently', 'success');
      setConfirmState({ isOpen: false, itemId: null });
      fetchList();
    }
  };

  const handleCancelDelete = () => {
    setConfirmState({ isOpen: false, itemId: null });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-lab-text mb-6">Partners</h1>
      <div className="mb-4">
        <label htmlFor="partners-search" className="sr-only">
          Search partners
        </label>
        <input
          id="partners-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, website, status…"
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
        addNewHref="#/partners/new"
        page={page}
        hasMore={hasMore}
        onPageChange={setPage}
      />
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title="Delete Partner"
        message="This will permanently delete this partner. This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
