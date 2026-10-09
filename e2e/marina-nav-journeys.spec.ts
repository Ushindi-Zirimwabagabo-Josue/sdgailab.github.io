import { expect, test } from '@playwright/test';

test.describe('Marina primary navigation journeys', () => {
  test('contact page exposes the request form and engagement options', async ({ page }) => {
    await page.goto('/contact/');
    await expect(
      page.getByRole('heading', { name: /Leave a request, or just email us directly/i })
    ).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('#contactForm')).toBeVisible();
    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByRole('button', { name: /Send request/i })).toBeVisible();
    await expect(page.getByText(/nothing is stored on this site/i)).toBeVisible();
  });

  test('services page is reachable from primary nav', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Services', exact: true }).first().click();
    await expect(page).toHaveURL(/\/services\/?/);
    await expect(
      page.getByRole('heading', { name: /What a partner can commission from the Lab/i })
    ).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('heading', { name: 'Artificial Intelligence' })).toBeVisible();
  });

  test('research page loads research outputs section', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Research', exact: true }).first().click();
    await expect(page).toHaveURL(/\/research\/?/);
    await expect(
      page.getByRole('heading', {
        name: /Key outputs from technical assessments, advisory work, and partnership facilitation/i,
      })
    ).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('button', { name: 'All outputs' })).toBeVisible();
  });

  test('expertise page is reachable from primary nav', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Expertise', exact: true }).first().click();
    await expect(page).toHaveURL(/\/expertise\/?/);
    await expect(
      page.getByRole('heading', {
        name: /Our areas of expertise — delivering solutions across six domains/i,
      })
    ).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('heading', { name: 'Natural Language Processing' })).toBeVisible();
  });
});
