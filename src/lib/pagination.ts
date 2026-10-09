/** Shared list pagination defaults for public + admin CMS queries. */

export const PUBLIC_LIST_PAGE_SIZE = 24;
/** Hard cap for public lists that still filter client-side (e.g. projects). */
export const PUBLIC_LIST_MAX = 200;
export const ADMIN_LIST_PAGE_SIZE = 50;
export const ADMIN_LIST_MAX_PAGE_SIZE = 100;

export type ListPageOptions = {
  /** 1-based page index */
  page?: number;
  pageSize?: number;
};

export type PagedResult<T> = {
  data: T;
  error: string | null;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

export function normalizePageOptions(
  options: ListPageOptions | undefined,
  defaults: { pageSize: number; maxPageSize: number }
): { page: number; pageSize: number; from: number; to: number } {
  const page = Math.max(1, Math.floor(options?.page ?? 1));
  const requested = Math.floor(options?.pageSize ?? defaults.pageSize);
  const pageSize = Math.min(defaults.maxPageSize, Math.max(1, requested));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  return { page, pageSize, from, to };
}
