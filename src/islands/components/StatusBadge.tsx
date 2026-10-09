interface StatusBadgeProps {
  status: string;
}

const colorMap: Record<string, string> = {
  active: 'ui-badge--active',
  completed: 'ui-badge--completed',
  under_development: 'ui-badge--under-development',
  on_hold: 'ui-badge--on-hold',
};

const labelMap: Record<string, string> = {
  active: 'Active',
  completed: 'Completed',
  under_development: 'Under Development',
  on_hold: 'On Hold',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const colors = colorMap[status] ?? 'ui-badge--neutral';
  const label = labelMap[status] ?? status;

  return <span className={`ui-badge ui-badge--md ${colors}`}>{label}</span>;
}
