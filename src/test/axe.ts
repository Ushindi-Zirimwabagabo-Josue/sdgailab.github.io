import { axe, toHaveNoViolations } from 'jest-axe';
import { expect } from 'vitest';

expect.extend(toHaveNoViolations);

export async function expectAccessible(container: HTMLElement) {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
}

/** Axe smoke for island fragments that are not full-page documents. */
export async function expectAccessibleSmoke(container: HTMLElement) {
  const results = await axe(container, {
    rules: {
      'heading-order': { enabled: false },
      region: { enabled: false },
    },
  });
  expect(results).toHaveNoViolations();
}
