import type { ProjectListItem } from './types';

export type FocusCategory = 'gis' | 'nlp' | 'training';

export const FOCUS_LABELS: Record<FocusCategory, string> = {
  gis: 'GIS & GeoAI',
  nlp: 'NLP & Gen AI',
  training: 'Training',
};

type FocusSource = Pick<
  ProjectListItem,
  'impact_area' | 'work_stream' | 'project_category' | 'capabilities_involved' | 'tech_stack'
>;

/** Map a project to the Solutions / expertise focus bucket used on cards and detail pages. */
export function toFocus(project: FocusSource): FocusCategory {
  const text = [
    project.impact_area,
    project.work_stream,
    project.project_category,
    ...(project.capabilities_involved ?? []),
    ...(project.tech_stack ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (/(gis|geo|remote sensing|satellite|mapping|spatial|land use|reef)/.test(text)) return 'gis';
  if (/(nlp|natural language|gen ai|language|llm|chatbot|document|text mining)/.test(text)) return 'nlp';
  // Former "Other" projects (and explicit training/skills work) land under Training.
  return 'training';
}

export function toFocusLabel(project: FocusSource): string {
  return FOCUS_LABELS[toFocus(project)];
}

export type PortfolioFocus = FocusCategory | 'resilience' | 'fintech' | 'advisory';

export const PORTFOLIO_FOCUS_LABELS: Record<PortfolioFocus, string> = {
  ...FOCUS_LABELS,
  resilience: 'Resilience',
  fintech: 'FinTech & Digital Finance',
  advisory: 'Research & Advisory',
};

const PORTFOLIO_FOCUS_IDS = new Set<string>(Object.keys(PORTFOLIO_FOCUS_LABELS));

export function focusFromQuery(value: string | null): PortfolioFocus | 'all' {
  if (value && PORTFOLIO_FOCUS_IDS.has(value)) return value as PortfolioFocus;
  return 'all';
}

function projectText(project: FocusSource & { title?: string | null; summary?: string | null }): string {
  return [project.title, project.summary, project.impact_area, project.work_stream, project.project_category]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

/** Whether a project belongs to the Solutions filter opened from an expertise domain. */
export function projectMatchesFocus(
  project: FocusSource & { title?: string | null; summary?: string | null },
  focus: PortfolioFocus,
): boolean {
  if (focus === 'gis' || focus === 'nlp' || focus === 'training') return toFocus(project) === focus;
  const text = projectText(project);
  if (focus === 'resilience') return /resilien|early warning|disaster|\bdrr\b/.test(text);
  if (focus === 'fintech') return /fintech|suptech|digital finance|public finance|sdg finance/.test(text);
  return /advisory|white paper|partnership agreement/.test(text);
}
