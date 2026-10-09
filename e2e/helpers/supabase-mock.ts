export const E2E_SUPABASE_URL = 'https://e2e-test.supabase.co';
export const E2E_AUTH_STORAGE_KEY = 'sb-e2e-test-auth-token';
export const EDITOR_EMAIL = 'editor@example.org';
export const REVIEWER_EMAIL = 'reviewer@example.org';

type TableName =
  | 'admin_users'
  | 'statistics'
  | 'projects'
  | 'news_articles'
  | 'publications'
  | 'people'
  | 'partners'
  | 'page_content';

export interface MockState {
  allowlistedEmails: Set<string>;
  projects: Record<string, unknown>[];
  news: Record<string, unknown>[];
  publications: Record<string, unknown>[];
  uploadedPaths: string[];
  sessionEmail: string | null;
}

export function createMockState(options?: { allowEditor?: boolean }): MockState {
  return {
    allowlistedEmails: new Set(options?.allowEditor === false ? [] : [EDITOR_EMAIL]),
    projects: [],
    news: [],
    publications: [],
    uploadedPaths: [],
    sessionEmail: null,
  };
}

function buildSession(email: string) {
  const now = Math.floor(Date.now() / 1000);
  return {
    access_token: 'e2e-access-token',
    refresh_token: 'e2e-refresh-token',
    expires_in: 3600,
    expires_at: now + 3600,
    token_type: 'bearer',
    user: {
      id: 'e2e-user-id',
      email,
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: {},
      user_metadata: {},
    },
  };
}

export async function seedAuthSession(
  page: import('@playwright/test').Page,
  email: string | null,
  options?: { includeAdminCache?: boolean }
) {
  const session = email ? buildSession(email) : null;
  await page.addInitScript(
    ({ storageKey, email: seededEmail, seededSession, includeAdminCache }) => {
      if (!seededEmail || !seededSession) {
        localStorage.removeItem(storageKey);
        localStorage.removeItem('sdg-ai-lab:admin-actor');
        return;
      }

      localStorage.setItem(storageKey, JSON.stringify(seededSession));
      if (includeAdminCache) {
        localStorage.setItem(
          'sdg-ai-lab:admin-actor',
          JSON.stringify({
            actor: { email: seededEmail.toLowerCase(), role: 'editor' },
            expiresAt: Date.now() + 60_000,
          })
        );
      } else {
        localStorage.removeItem('sdg-ai-lab:admin-actor');
      }
    },
    {
      storageKey: E2E_AUTH_STORAGE_KEY,
      email,
      seededSession: session,
      includeAdminCache: options?.includeAdminCache ?? true,
    }
  );
}

function getCollection(state: MockState, table: TableName) {
  if (table === 'projects') return state.projects;
  if (table === 'news_articles') return state.news;
  if (table === 'publications') return state.publications;
  return [];
}

function parseIdFilter(url: string): string | null {
  const match = url.match(/[?&]id=eq\.([^&]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function parseSlugFilter(url: string): string | null {
  const match = url.match(/[?&]slug=eq\.([^&]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function installSupabaseMock(
  page: import('@playwright/test').Page,
  state: MockState
) {
  await page.route('**/*', async (route) => {
    const url = route.request().url();
    if (!url.includes('e2e-test.supabase.co')) {
      await route.continue();
      return;
    }

    const requestUrl = new URL(url);
    const { pathname } = requestUrl;
    const method = route.request().method();

    if (pathname.includes('/auth/v1/otp')) {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
      return;
    }

    if (pathname.includes('/auth/v1/token') || pathname.includes('/auth/v1/session')) {
      const email = state.sessionEmail ?? EDITOR_EMAIL;
      state.sessionEmail = email;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(buildSession(email)),
      });
      return;
    }

    if (pathname.includes('/auth/v1/user')) {
      const email = state.sessionEmail ?? EDITOR_EMAIL;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(buildSession(email).user),
      });
      return;
    }

    if (pathname.includes('/storage/v1/object/public-assets/')) {
      if (method === 'POST' || method === 'PUT') {
        const path = pathname.split('/public-assets/')[1] ?? `projects/e2e-${Date.now()}.png`;
        state.uploadedPaths.push(path);
        await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
        return;
      }
      if (method === 'DELETE') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
        return;
      }
    }

    if (pathname.includes('/rest/v1/admin_users')) {
      const email = (state.sessionEmail ?? EDITOR_EMAIL).toLowerCase();
      if (!state.allowlistedEmails.has(email)) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          headers: { 'content-range': '0-0/0' },
          body: 'null',
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ email, role: 'editor' }),
      });
      return;
    }

    const tableMatch = pathname.match(/\/rest\/v1\/([^/?]+)/);
    if (!tableMatch) {
      await route.fulfill({ status: 404, body: 'not found' });
      return;
    }

    const table = tableMatch[1] as TableName;
    const collection = getCollection(state, table);

    if (method === 'GET') {
      const id = parseIdFilter(url);
      const slug = parseSlugFilter(url);

      if (url.includes('select=status')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(collection.map((item) => ({ status: item.status ?? 'draft' }))),
        });
        return;
      }

      if (id) {
        const row = collection.find((item) => item.id === id) ?? null;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(row),
        });
        return;
      }

      if (slug) {
        const row = collection.find((item) => item.slug === slug) ?? null;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(row),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(collection),
      });
      return;
    }

    if (method === 'POST' && (table === 'projects' || table === 'news_articles' || table === 'publications')) {
      const payload = route.request().postDataJSON() as Record<string, unknown>;
      const row = {
        id: `${table}-${collection.length + 1}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...payload,
      };
      collection.push(row);
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(row),
      });
      return;
    }

    if (method === 'PATCH') {
      const id = parseIdFilter(url);
      const row = collection.find((item) => item.id === id);
      if (!row) {
        await route.fulfill({ status: 404, body: 'not found' });
        return;
      }
      const payload = route.request().postDataJSON() as Record<string, unknown>;
      Object.assign(row, payload, { updated_at: new Date().toISOString() });
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(row),
      });
      return;
    }

    if (method === 'DELETE') {
      const id = parseIdFilter(url);
      const index = collection.findIndex((item) => item.id === id);
      if (index >= 0) collection.splice(index, 1);
      await route.fulfill({ status: 204, body: '' });
      return;
    }

    await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });
}

export async function loginAsEditor(page: import('@playwright/test').Page, state: MockState) {
  state.sessionEmail = EDITOR_EMAIL;
  await seedAuthSession(page, EDITOR_EMAIL);
  await installSupabaseMock(page, state);
}

export async function waitForAdminShell(page: import('@playwright/test').Page) {
  await page.goto('/admin#/');
  await page.waitForSelector('input[type="email"], h1:text-is("Dashboard")', {
    timeout: 20_000,
  });
}
