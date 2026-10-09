interface StatusSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  id?: string;
}

export function StatusSelect({ value, onChange, label, id }: StatusSelectProps) {
  const selectId = id ?? 'status-select';
  return (
    <div>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-lab-text mb-1">
          {label}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded px-3 py-2 text-sm border-lab-border focus:outline-none focus:ring-2 focus:ring-lab-accent focus:border-lab-accent"
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="archived">Archived</option>
      </select>
    </div>
  );
}

interface StatusBadgeProps {
  status: string;
}

function getStatusStyles(status: string) {
  switch (status.toLowerCase()) {
    case 'draft':
      return 'bg-lab-section text-lab-muted';
    case 'published':
      return 'bg-green-500/15 text-green-200 border border-green-500/30';
    case 'archived':
      return 'bg-red-100 text-red-300';
    default:
      return 'bg-lab-section text-lab-muted';
  }
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusStyles(status)}`}
    >
      {status}
    </span>
  );
}
