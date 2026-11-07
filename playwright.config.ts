import { defineConfig, devices } from '@playwright/test';

/**
 * Tests run against the built site (.vercel/output/static) served by
 * scripts/serve-static.mjs. Build first: `pnpm build:test` (production content)
 * or `pnpm build:templates` (adds the draft example entries).
 */
const port = Number(process.env.PORT ?? 4321);

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  ...(process.env.CI ? { workers: 2 } : {}),
  reporter: [['list'], ['json', { outputFile: `reports/${process.env.BUILD_NAME ?? 'local'}/playwright.json` }]],
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `node scripts/serve-static.mjs ${port}`,
    url: `http://localhost:${port}/`,
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
  },
});
