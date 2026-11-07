/**
 * pa11y-ci: every page in the sitemap, checked against WCAG 2 AA with both the
 * axe and HTML_CodeSniffer runners. Uses Playwright's Chromium so there is one
 * browser download, locally and in CI.
 */
const { chromium } = require('playwright');

module.exports = (async () => {
  const { sitemapUrls } = await import('./scripts/site-urls.mjs');
  return {
    defaults: {
      standard: 'WCAG2AA',
      runners: ['axe', 'htmlcs'],
      timeout: 60000,
      viewport: { width: 1280, height: 900 },
      chromeLaunchConfig: {
        executablePath: chromium.executablePath(),
        args: ['--no-sandbox'],
      },
      reporters: ['cli', ['json', { fileName: `reports/${process.env.BUILD_NAME ?? 'local'}/pa11y.json` }]],
    },
    urls: sitemapUrls(),
  };
})();
