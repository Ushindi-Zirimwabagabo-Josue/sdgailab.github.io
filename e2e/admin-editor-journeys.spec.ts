import { expect, test } from '@playwright/test';
import path from 'node:path';
import {
  EDITOR_EMAIL,
  REVIEWER_EMAIL,
  createMockState,
  installSupabaseMock,
  loginAsEditor,
  seedAuthSession,
} from './helpers/supabase-mock';

async function waitForDashboard(page: import('@playwright/test').Page) {
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({
    timeout: 20_000,
  });
}

async function waitForProjectForm(page: import('@playwright/test').Page) {
  await expect(page.getByRole('heading', { name: 'New Project' })).toBeVisible({
    timeout: 20_000,
  });
}

async function waitForNewsForm(page: import('@playwright/test').Page) {
  await expect(page.getByRole('heading', { name: 'New Article' })).toBeVisible({
    timeout: 20_000,
  });
}

test.describe('Editor journeys', () => {
  test.describe.configure({ timeout: 60_000 });
  test('editor can request a magic link and land on the dashboard after callback', async ({ page }) => {
    const state = createMockState();
    await installSupabaseMock(page, state);
    await page.goto('/admin');

    await page.getByLabel('Email address').fill(EDITOR_EMAIL);
    await page.getByRole('button', { name: 'Send Magic Link' }).click();
    await expect(page.getByText(/check your email/i)).toBeVisible();

    await loginAsEditor(page, state);
    await page.goto('/');
    await page.goto('/admin#/');
    await waitForDashboard(page);
  });

  test('non-allowlisted users see the unauthorized editor page', async ({ page }) => {
    const state = createMockState({ allowEditor: false });
    state.sessionEmail = REVIEWER_EMAIL;
    await seedAuthSession(page, REVIEWER_EMAIL, { includeAdminCache: false });
    await installSupabaseMock(page, state);

    await page.goto('/admin#/');
    await expect(page.getByRole('heading', { name: 'Editor access required' })).toBeVisible();
    await expect(page.getByText(REVIEWER_EMAIL)).toBeVisible();
  });

  test('editor can create and publish a project', async ({ page }) => {
    const state = createMockState();
    await loginAsEditor(page, state);
    await page.goto('/admin#/projects/new');
    await waitForProjectForm(page);
    await page.locator('input[type="text"]').first().fill('E2E Published Project');
    await page
      .locator('.w-md-editor textarea')
      .fill('A project created during Playwright coverage.');
    await page.getByLabel('Status').selectOption('published');
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Create' }).click();

    await expect(page).toHaveURL(/#\/projects$/, { timeout: 10_000 });
    await expect(page.getByRole('cell', { name: 'E2E Published Project' })).toBeVisible();
    expect(state.projects.some((item) => item.slug === 'e2e-published-project')).toBe(true);
    expect(state.projects.find((item) => item.slug === 'e2e-published-project')?.status).toBe(
      'published'
    );
  });

  test('editor can create and publish a news article', async ({ page }) => {
    const state = createMockState();
    await loginAsEditor(page, state);
    await page.goto('/admin#/news/new');
    await waitForNewsForm(page);
    await page.locator('input[type="text"]').first().fill('E2E Published Article');
    await page.locator('textarea').first().fill('## Coverage\n\nPublished from Playwright.');
    await page.getByLabel('Status').selectOption('published');
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Create' }).click();

    await expect(page).toHaveURL(/#\/news$/, { timeout: 10_000 });
    await expect(page.getByRole('cell', { name: 'E2E Published Article' })).toBeVisible();
    expect(state.news.some((item) => item.slug === 'e2e-published-article')).toBe(true);
    expect(state.news.find((item) => item.slug === 'e2e-published-article')?.status).toBe(
      'published'
    );
  });

  test('editor can upload and replace project media', async ({ page }) => {
    const state = createMockState();
    await loginAsEditor(page, state);
    await page.goto('/admin#/projects/new');
    await waitForProjectForm(page);

    const imagePath = path.resolve('public/og-image.png');
    await page.getByLabel('Image', { exact: true }).setInputFiles(imagePath);
    await expect(page.getByAltText('Upload preview')).toBeVisible();
    expect(state.uploadedPaths.length).toBeGreaterThanOrEqual(1);

    await page.getByRole('button', { name: 'Replace' }).click();
    await page.getByLabel('Image', { exact: true }).setInputFiles(imagePath);
    await expect(page.getByAltText('Upload preview')).toBeVisible();
  });

  test('editor can archive and permanently delete a project', async ({ page }) => {
    const state = createMockState();
    state.projects.push({
      id: 'projects-1',
      title: 'Disposable Project',
      slug: 'disposable-project',
      description: 'Temporary project for archive/delete coverage.',
      project_status: 'active',
      is_deployed: false,
      is_featured: false,
      image_url: null,
      display_order: 0,
      status: 'published',
    });
    await loginAsEditor(page, state);
    await page.goto('/admin#/projects');

    await page.getByRole('button', { name: 'Archive' }).first().click();
    await expect(page.getByText('Project archived')).toBeVisible();
    expect(state.projects[0]?.status).toBe('archived');

    await page.getByRole('button', { name: 'Delete' }).first().click();
    await page.getByRole('button', { name: 'Delete' }).last().click();
    await expect(page.getByText('Project deleted permanently')).toBeVisible();
    expect(state.projects).toHaveLength(0);
  });
});

