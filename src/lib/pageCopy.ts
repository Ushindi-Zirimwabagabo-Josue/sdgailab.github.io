import { getPublishedPageCopy } from './queries';

const inflight = new Map<string, Promise<Record<string, string>>>();

/** One published-copy fetch per page, shared by every section on that page. */
export function loadPageCopy(pageSlug: string): Promise<Record<string, string>> {
  const pending = inflight.get(pageSlug);
  if (pending) return pending;

  const request = getPublishedPageCopy(pageSlug)
    .then(({ data, error }) => {
      if (error) inflight.delete(pageSlug);
      return data;
    })
    .catch((error: unknown) => {
      inflight.delete(pageSlug);
      throw error;
    });

  inflight.set(pageSlug, request);
  return request;
}

export function resetPageCopyCache(): void {
  inflight.clear();
}
