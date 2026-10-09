import { describe, expect, it } from 'vitest';
import { sectionListItem, sectionLines } from './pageSections';

describe('section list copy', () => {
  it('keeps one item per line and drops markdown bullets', () => {
    const lines = sectionLines(
      '- **Develop digital solutions** — Co-develop AI, GIS, and data tools with our team.\n\n1. Plain item'
    );

    expect(lines).toHaveLength(2);
    expect(sectionListItem(lines[0])).toBe(
      '**Develop digital solutions** — Co-develop AI, GIS, and data tools with our team.'
    );
    expect(sectionListItem(lines[1])).toBe('Plain item');
  });
});
