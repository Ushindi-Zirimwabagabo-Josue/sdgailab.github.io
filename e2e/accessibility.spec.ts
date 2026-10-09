import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createMockState, installSupabaseMock } from './helpers/supabase-mock';

async function expectNoSeriousViolations(page: import('@playwright/test').Page) {
  const results = await new AxeBuilder({ page })
    .disableRules(['color-contrast'])
    .analyze();
  const blocking = results.violations.filter(
    (violation) => violation.impact === 'critical' || violation.impact === 'serious'
  );
  expect(blocking).toEqual([]);
}

test.describe('Accessibility journeys', () => {
  test('homepage has no serious accessibility violations', async ({ page }) => {
    await page.goto('/');
    await expectNoSeriousViolations(page);
  });

  test('admin login surface has no serious accessibility violations', async ({ page }) => {
    const state = createMockState();
    await installSupabaseMock(page, state);
    await page.goto('/admin');
    await page.waitForSelector('input[type="email"]', { timeout: 20_000 });
    await expectNoSeriousViolations(page);
  });
});
