export const TEAM_GROUP_TITLES = [
  'Coordination · Research & Advisory',
  'GIS & GeoAI · Software Development',
  'NLP / LLM · Training & Data Science',
  'Interns',
] as const;

export type TeamGroupTitle = (typeof TEAM_GROUP_TITLES)[number];

const LEGACY_BIOGRAPHY_TO_TEAM_GROUP: Record<string, TeamGroupTitle> = {
  'Coordination Team': 'Coordination · Research & Advisory',
  'Research & Advisory Team': 'Coordination · Research & Advisory',
  'GIS & GeoAI Team': 'GIS & GeoAI · Software Development',
  'Software Development Team': 'GIS & GeoAI · Software Development',
  'NLP/LLM Team': 'NLP / LLM · Training & Data Science',
  'Training Team': 'NLP / LLM · Training & Data Science',
};

export function isTeamGroupTitle(value: string | null | undefined): value is TeamGroupTitle {
  return Boolean(value && (TEAM_GROUP_TITLES as readonly string[]).includes(value));
}

/** Resolve the marina team section title from CMS team_group, with legacy biography fallback. */
export function resolveTeamGroupTitle(person: {
  team_group?: string | null;
  biography?: string | null;
}): TeamGroupTitle | null {
  if (isTeamGroupTitle(person.team_group)) return person.team_group;

  const biography = person.biography?.trim();
  if (biography && LEGACY_BIOGRAPHY_TO_TEAM_GROUP[biography]) {
    return LEGACY_BIOGRAPHY_TO_TEAM_GROUP[biography];
  }

  if (biography) {
    const matched = TEAM_GROUP_TITLES.find((title) => biography.includes(title));
    if (matched) return matched;
  }

  return null;
}

export function groupPeopleByTeamGroup<T extends { team_group?: string | null; biography?: string | null; display_order: number }>(
  people: T[]
): { title: TeamGroupTitle; members: T[] }[] {
  const buckets = new Map<TeamGroupTitle, T[]>(
    TEAM_GROUP_TITLES.map((title) => [title, []])
  );

  for (const person of people) {
    const title = resolveTeamGroupTitle(person);
    if (!title) continue;
    buckets.get(title)?.push(person);
  }

  return TEAM_GROUP_TITLES
    .map((title) => ({
      title,
      members: (buckets.get(title) ?? []).sort((a, b) => a.display_order - b.display_order),
    }))
    .filter((group) => group.members.length > 0);
}
