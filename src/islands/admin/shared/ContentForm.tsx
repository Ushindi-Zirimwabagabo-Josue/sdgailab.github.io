import { useEffect } from 'react';
import { useNavigationGuard } from '../AdminApp';

interface ContentFormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isEdit: boolean;
  loading: boolean;
  backHref: string;
  isDirty: boolean;
}

export function ContentForm({
  children,
  onSubmit,
  isEdit,
  loading,
  backHref,
  isDirty,
}: ContentFormProps) {
  const { setIsDirty } = useNavigationGuard();

  useEffect(() => {
    setIsDirty(isDirty);
    return () => setIsDirty(false);
  }, [isDirty, setIsDirty]);

  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  return (
    <form onSubmit={onSubmit}>
      {children}
      <div className="mt-6 flex items-center gap-3 pt-4 border-t border-lab-border">
        <a
          href={backHref}
          className="px-4 py-2 rounded-md border border-lab-border bg-lab-surface text-lab-text hover:bg-lab-base text-sm font-medium"
        >
          Cancel
        </a>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-md bg-lab-accent text-lab-text hover:bg-lab-accent/90 disabled:opacity-50 text-sm font-medium flex items-center gap-2"
        >
          {loading ? (
            <>
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-lab-text border-t-transparent"
                aria-hidden
              />
              {isEdit ? 'Update' : 'Create'}
            </>
          ) : (
            isEdit ? 'Update' : 'Create'
          )}
        </button>
      </div>
    </form>
  );
}
