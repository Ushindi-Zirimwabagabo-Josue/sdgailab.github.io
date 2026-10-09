import type React from 'react';
import { StatusBadge } from './StatusSelect';

export interface Column<T> {
  label: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

export interface ContentTableProps<T extends { id: string; status: string }> {
  columns: Column<T>[];
  data: T[];
  loading: boolean;
  error: string | null;
  onEdit: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onRetry?: () => void;
  addNewHref: string;
  addNewLabel?: string;
  page?: number;
  hasMore?: boolean;
  onPageChange?: (page: number) => void;
}

function getCellContent<T>(item: T, accessor: Column<T>['accessor']): React.ReactNode {
  if (typeof accessor === 'function') {
    return accessor(item);
  }
  const value = item[accessor];
  return value != null ? String(value) : '';
}

export function ContentTable<T extends { id: string; status: string }>({
  columns,
  data,
  loading,
  error,
  onEdit,
  onArchive,
  onDelete,
  onRetry,
  addNewHref,
  addNewLabel = 'Add New',
  page = 1,
  hasMore = false,
  onPageChange,
}: ContentTableProps<T>) {
  const hasStatus = columns.some((c) => c.accessor === 'status');
  const allColumns: Column<T>[] = hasStatus
    ? columns
    : [...columns, { label: 'Status', accessor: 'status' as keyof T }];

  const addButton = (
    <div className="flex justify-end mb-4">
      <a
        href={addNewHref}
        className="inline-flex items-center px-4 py-2 rounded-md bg-lab-accent text-lab-text text-sm font-medium hover:bg-lab-accent/90"
      >
        {addNewLabel}
      </a>
    </div>
  );

  if (loading) {
    return (
      <div className="overflow-x-auto">
        {addButton}
        <table className="min-w-full divide-y divide-lab-border">
          <thead className="bg-lab-base">
            <tr>
              {allColumns.map((col, i) => (
                <th
                  key={i}
                  scope="col"
                  className={`px-4 py-3 text-left text-xs font-medium text-lab-muted uppercase tracking-wider ${col.className ?? ''}`}
                >
                  {col.label}
                </th>
              ))}
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-lab-muted uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-lab-surface divide-y divide-lab-border">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i}>
                {allColumns.map((col, j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="h-4 bg-lab-elevated rounded animate-pulse" />
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="h-4 bg-lab-elevated rounded animate-pulse w-16" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        {addButton}
        <div className="rounded-md bg-red-500/10 p-4 text-red-200 text-sm">
          <p>{error}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 text-red-100 font-medium underline hover:no-underline"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div>
        {addButton}
        <div className="text-center py-12 text-lab-muted">
          No items found
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {addButton}
      <table className="min-w-full divide-y divide-lab-border">
        <thead className="bg-lab-base">
          <tr>
            {allColumns.map((col, i) => (
              <th
                key={i}
                scope="col"
                className={`px-4 py-3 text-left text-xs font-medium text-lab-muted uppercase tracking-wider ${col.className ?? ''}`}
              >
                {col.label}
              </th>
            ))}
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-lab-muted uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-lab-surface divide-y divide-lab-border">
          {data.map((item) => (
            <tr key={item.id}>
              {allColumns.map((col, i) => (
                <td key={i} className={`px-4 py-3 text-sm text-lab-text ${col.className ?? ''}`}>
                  {col.accessor === 'status' ? (
                    <StatusBadge status={item.status} />
                  ) : (
                    getCellContent(item, col.accessor)
                  )}
                </td>
              ))}
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => onEdit(item.id)}
                    className="text-lab-accent-soft hover:text-lab-accent text-sm font-medium"
                  >
                    Edit
                  </button>
                  {item.status !== 'archived' && (
                    <button
                      type="button"
                      onClick={() => onArchive(item.id)}
                      className="text-amber-300 hover:text-amber-200 text-sm font-medium"
                    >
                      Archive
                    </button>
                  )}
                  {item.status === 'archived' && (
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      className="text-red-300 hover:text-red-200 text-sm font-medium"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {onPageChange && (page > 1 || hasMore) && (
        <div className="mt-4 flex items-center justify-between gap-3 text-sm text-lab-muted">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded-md px-3 py-1.5 ring-1 ring-lab-border disabled:opacity-40 hover:enabled:bg-lab-elevated"
          >
            Previous
          </button>
          <span aria-live="polite">Page {page}</span>
          <button
            type="button"
            disabled={!hasMore}
            onClick={() => onPageChange(page + 1)}
            className="rounded-md px-3 py-1.5 ring-1 ring-lab-border disabled:opacity-40 hover:enabled:bg-lab-elevated"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
