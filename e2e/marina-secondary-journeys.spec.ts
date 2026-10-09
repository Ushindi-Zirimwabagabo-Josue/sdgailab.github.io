import { expect, test } from '@playwright/test';
import {
  createMockState,
  loginAsEditor,
} from './helpers/supabase-mock';

test.describe('Marina secondary journeys', () => {
  test('programmes page shows cohort cards', async ({ page }) => {
    await page.goto('/programmes/');
    await expect(
      page.getByRole('heading', { name: /Where digital skills training actually lands/i })
    ).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('heading', { name: /Frontier & Future Tech Leaders Programme/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Innovation Campus' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Game Development Bootcamps/i })).toBeVisible();
  });

  test('publications page hydrates the publications island', async ({ page }) => {
    await page.goto('/resources/');
    await expect(page).toHaveTitle(/Publications - SDG AI Lab/);
    await expect(page.getByText('Publications').first()).toBeVisible({ timeout: 15_000 });
  });
});

test.describe('Admin publications journey', () => {
  test.describe.configure({ timeout: 60_000 });

  test('editor can create and publish a publication', async ({ page }) => {
    const state = createMockState();
    await loginAsEditor(page, state);
    await page.goto('/admin#/publications/new');

    await expect(page.getByRole('heading', { name: 'New publication' })).toBeVisible({
      timeout: 20_000,
    });

    await page.locator('input').first().fill('E2E Published Brief');
    await page.locator('textarea').first().fill('A publication created during Playwright coverage.');
    await page.locator('input[type="url"]').fill('https://example.com/e2e-brief');
    await page.getByLabel('Status').selectOption('published');
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Create' }).click();

    await expect(page).toHaveURL(/#\/publications$/, { timeout: 10_000 });
    await expect(page.getByRole('cell', { name: 'E2E Published Brief' })).toBeVisible();
    expect(state.publications.some((item) => item.slug === 'e2e-published-brief')).toBe(true);
    expect(state.publications.find((item) => item.slug === 'e2e-published-brief')?.status).toBe(
      'published'
    );
  });
});
