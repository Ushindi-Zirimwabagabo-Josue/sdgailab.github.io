import { expect, test } from '@playwright/test';

test.describe('CMS-driven static pages', () => {
  test('about page follows Marina about-page structure', async ({ page }) => {
    await page.goto('/about/');
    await expect(page.getByRole('heading', { name: /Seven years of building AI and data tools inside government/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole('heading', { name: /From first pilots to a mainstreamed practice/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /What a partner can commission from the Lab/i })).toBeVisible();
  });

  test('volunteer page hydrates page content', async ({ page }) => {
    await page.goto('/volunteer/');
    await expect(page.getByText(/Volunteer Data Scientist Initiative/i)).toBeVisible({
      timeout: 15_000,
    });
  });

  test('team page follows Marina team-page structure', async ({ page }) => {
    await page.goto('/team/');
    await expect(page.getByRole('heading', { name: /Six working groups, one lab/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText(/Coordination · Research & Advisory/i)).toBeVisible();
    await expect(page.getByText(/GIS & GeoAI · Software Development/i)).toBeVisible();
    await expect(page.getByText(/NLP \/ LLM · Training & Data Science/i)).toBeVisible();
  });
});


