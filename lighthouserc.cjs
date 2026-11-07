/**
 * Lighthouse CI: every page in the sitemap, one run each, with Lighthouse's
 * default mobile emulation and throttling. Thresholds from the brief:
 * accessibility, performance and best practices at least 0.95; SEO exactly 1.
 */
const { execFileSync } = require('node:child_process');
const { chromium } = require('playwright');

const urls = JSON.parse(
  execFileSync(process.execPath, ['--input-type=module', '-e', "import { sitemapUrls } from './scripts/site-urls.mjs'; console.log(JSON.stringify(sitemapUrls()));"], { encoding: 'utf8' }),
);

module.exports = {
  ci: {
    collect: {
      url: urls,
      numberOfRuns: 1,
      startServerCommand: 'node scripts/serve-static.mjs 4321',
      startServerReadyPattern: 'Serving',
      chromePath: chromium.executablePath(),
      settings: {
        chromeFlags: '--no-sandbox --headless=new',
      },
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 1 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: `reports/${process.env.BUILD_NAME ?? 'local'}/lighthouse`,
    },
  },
};
