import { expect, test } from '@playwright/test';

test.describe('Marina secondary page smokes', () => {
  test('capacity-building page exposes learning pathways', async ({ page }) => {
    await page.goto('/capacity-building/');
    await expect(
      page.getByRole('heading', {
        name: /Training, mentorship and practical learning for teams working with AI and data/i,
      })
    ).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('heading', { name: 'Training' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Bootcamps' })).toBeVisible();
  });

  test('how-we-work page exposes engagement modes', async ({ page }) => {
    await page.goto('/how-we-work/');
    await expect(
      page.getByRole('heading', {
        name: /Five ways we work with UNDP units and development partners/i,
      })
    ).toBeVisible({ timeout: 15_000 });
    await expect(
      page.getByRole('heading', { name: /Agile, aligned with UNDP practice, enhanced by AI/i })
    ).toBeVisible();
  });

  test('project detail hydrates a sample project by slug', async ({ page }) => {
    await page.goto('/projects/detail/?slug=open-sdg-classification');
    await expect(page.getByRole('heading', { name: /Open SDG Classification/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole('link', { name: /Back to Our Work|Our Work/i }).first()).toBeVisible();
  });

  test('news detail hydrates a sample article by slug', async ({ page }) => {
    await page.goto('/news/detail/?slug=responsible-development-practice');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('heading', { level: 1 })).not.toHaveText(/Article Not Found/i);
  });
});
