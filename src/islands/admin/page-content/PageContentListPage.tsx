import { useEffect, useState } from 'react';
import { ContentTable, type Column } from '../shared/ContentTable';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import {
  listPageContent,
  archivePageContent,
  deletePageContent,
  ensureCatalogPageSections,
} from '../../../lib/admin-queries';
import { findPageSection, PAGE_SECTIONS } from '../../../lib/pageSections';
import { useToast } from '../layout/Toast';
import type { PageContent } from '../../../lib/types';

export default function PageContentListPage() {
  const { showToast } = useToast();
  const [data, setData] = useState<PageContent[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<{ isOpen: boolean; itemId: string | null }>({
    isOpen: false,
    itemId: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [syncing, setSyncing] = useState(false);

  const columns: Column<PageContent>[] = [
    {
      label: 'Page',
      accessor: (item) => findPageSection(item.page_slug, item.section_slug)?.pageLabel ?? item.page_slug,
    },
    {
      label: 'Section',
      accessor: (item) => findPageSection(item.page_slug, item.section_slug)?.label ?? item.section_slug,
    },
    { label: 'Status', accessor: 'status' },
  ];

  const fetchList = async (pageNum = page) => {
    setLoading(true);
    setError(null);
    const { data: result, error: err, hasMore: more } = await listPageContent({ page: pageNum });
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
    window.location.hash = `#/page-content/edit/${id}`;
  };

  const onArchive = async (id: string) => {
    const { error: err } = await archivePageContent(id);
    if (err) {
      showToast(err, 'error');
    } else {
      showToast('Content archived', 'success');
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
    const { error: err } = await deletePageContent(id);
    setDeleteLoading(false);
    if (err) {
      showToast(err, 'error');
    } else {
      showToast('Content deleted permanently', 'success');
      setConfirmState({ isOpen: false, itemId: null });
      fetchList();
    }
  };

  const handleCancelDelete = () => {
    setConfirmState({ isOpen: false, itemId: null });
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-lab-text">Page Content</h1>
        <button
          type="button"
          className="rounded-md bg-lab-accent px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
          disabled={syncing}
          onClick={() => {
            setSyncing(true);
            void ensureCatalogPageSections(PAGE_SECTIONS).then(({ data: result, error: syncError }) => {
              setSyncing(false);
              if (syncError) {
                showToast(syncError, 'error');
                return;
              }
              showToast(
                result?.created
                  ? `Added ${result.created} section${result.created === 1 ? '' : 's'}`
                  : 'All page sections are already in the CMS',
                'success'
              );
              void fetchList(page);
            });
          }}
        >
          {syncing ? 'Adding sections…' : 'Add missing page sections'}
        </button>
      </div>
      <ContentTable
        columns={columns}
        data={data}
        loading={loading}
        error={error}
        onEdit={onEdit}
        onArchive={onArchive}
        onDelete={onDelete}
        onRetry={() => void fetchList(page)}
        addNewHref="#/page-content/new"
        page={page}
        hasMore={hasMore}
        onPageChange={setPage}
      />
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title="Delete Page Content"
        message="This will permanently delete this content block. This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
