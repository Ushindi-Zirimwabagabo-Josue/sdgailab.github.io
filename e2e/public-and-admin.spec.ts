import { expect, test } from '@playwright/test';

test.describe('Public site', () => {
  test('homepage loads with primary navigation and hero content', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Digital technologies for the Sustainable Development Goals/i })
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /How we work/i }).first()).toBeVisible();
  });

  test('projects page is reachable from the homepage', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Solutions', exact: true }).first().click();

    await expect(page).toHaveURL(/\/projects\/?/);
    await expect(
      page.getByRole('heading', { name: /Product portfolio/i })
    ).toBeVisible();
  });
});

test.describe('Admin shell', () => {
  test('admin route serves a protected noindex shell with the client admin island', async ({ page }) => {
    await page.goto('/admin');

    await expect(page).toHaveTitle(/Admin - SDG AI Lab/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow'
    );
    await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveAttribute(
      'content',
      /connect-src 'self' https:\/\/\*\.supabase\.co/
    );
    await expect(page.locator('#admin-root astro-island')).toBeAttached();
  });
});






