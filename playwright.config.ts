import { defineConfig, devices } from '@playwright/test';

declare const process: { env: Record<string, string | undefined> };

const port = 4321;
const baseURL = `http://127.0.0.1:${port}`;
const e2eSupabaseEnv = {
  PUBLIC_SUPABASE_URL: 'https://e2e-test.supabase.co',
  PUBLIC_SUPABASE_ANON_KEY: 'e2e-anon-key',
};

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --host 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      ...process.env,
      ...e2eSupabaseEnv,
    },
  },
});
