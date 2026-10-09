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
