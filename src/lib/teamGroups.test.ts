import { describe, expect, it } from 'vitest';
import { groupPeopleByTeamGroup, resolveTeamGroupTitle } from './teamGroups';

describe('teamGroups', () => {
  it('resolves marina titles from team_group and legacy biography labels', () => {
    expect(
      resolveTeamGroupTitle({
        team_group: 'GIS & GeoAI · Software Development',
        biography: null,
      })
    ).toBe('GIS & GeoAI · Software Development');

    expect(
      resolveTeamGroupTitle({
        team_group: null,
        biography: 'Training Team',
      })
    ).toBe('NLP / LLM · Training & Data Science');
  });

  it('groups people into the marina section titles including Interns', () => {
    const groups = groupPeopleByTeamGroup([
      {
        id: '1',
        display_order: 2,
        team_group: 'Coordination · Research & Advisory',
        biography: null,
      },
      {
        id: '2',
        display_order: 1,
        team_group: null,
        biography: 'GIS & GeoAI Team',
      },
      {
        id: '3',
        display_order: 1,
        team_group: 'NLP / LLM · Training & Data Science',
        biography: null,
      },
      {
        id: '4',
        display_order: 1,
        team_group: 'Interns',
        biography: null,
      },
    ]);

    expect(groups.map((group) => group.title)).toEqual([
      'Coordination · Research & Advisory',
      'GIS & GeoAI · Software Development',
      'NLP / LLM · Training & Data Science',
      'Interns',
    ]);
    expect(groups[0]?.members.map((member) => member.id)).toEqual(['1']);
    expect(groups[1]?.members.map((member) => member.id)).toEqual(['2']);
    expect(groups[3]?.members.map((member) => member.id)).toEqual(['4']);
  });
});
