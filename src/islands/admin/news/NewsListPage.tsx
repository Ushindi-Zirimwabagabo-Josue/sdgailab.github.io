import { useEffect, useMemo, useState } from 'react';
import { ContentTable, type Column } from '../shared/ContentTable';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { listNewsArticles, archiveNewsArticle, deleteNewsArticle } from '../../../lib/admin-queries';
import { useToast } from '../layout/Toast';
import type { NewsArticle } from '../../../lib/types';

function matchesSearch(article: NewsArticle, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    article.title,
    article.slug,
    article.author_name,
    article.summary,
    article.status,
    article.publish_date,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(q);
}

export default function NewsListPage() {
  const { showToast } = useToast();
  const [data, setData] = useState<NewsArticle[]>([]);
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

  const columns: Column<NewsArticle>[] = [
    { label: 'Title', accessor: 'title' },
    {
      label: 'Author',
      accessor: (item) => item.author_name || '—',
    },
    { label: 'Publish Date', accessor: 'publish_date' },
    { label: 'Status', accessor: 'status' },
  ];

  const fetchList = async (pageNum = page) => {
    setLoading(true);
    setError(null);
    const { data: result, error: err, hasMore: more } = await listNewsArticles({ page: pageNum });
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
    () => data.filter((article) => matchesSearch(article, search)),
    [data, search]
  );

  const onEdit = (id: string) => {
    window.location.hash = `#/news/edit/${id}`;
  };

  const onArchive = async (id: string) => {
    const { error: err } = await archiveNewsArticle(id);
    if (err) {
      showToast(err, 'error');
    } else {
      showToast('Article archived', 'success');
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
    const { error: err } = await deleteNewsArticle(id);
    setDeleteLoading(false);
    if (err) {
      showToast(err, 'error');
    } else {
      showToast('Article deleted permanently', 'success');
      setConfirmState({ isOpen: false, itemId: null });
      fetchList();
    }
  };

  const handleCancelDelete = () => {
    setConfirmState({ isOpen: false, itemId: null });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-lab-text mb-6">News Articles</h1>
      <div className="mb-4">
        <label htmlFor="news-search" className="sr-only">
          Search news articles
        </label>
        <input
          id="news-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, author, slug, status…"
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
        addNewHref="#/news/new"
        page={page}
        hasMore={hasMore}
        onPageChange={setPage}
      />
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title="Delete Article"
        message="This will permanently delete this article. This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
