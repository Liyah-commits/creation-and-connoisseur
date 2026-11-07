import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, type TestInfo } from '@playwright/test';
import { sitemapPaths } from '../scripts/site-urls.mjs';

/** WCAG 2.0, 2.1 and 2.2 A and AA rules, plus axe's best practices. */
export const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

export const VIEWPORTS = {
  mobile: { width: 375, height: 812 },
  desktop: { width: 1280, height: 900 },
} as const;

/** Every page in the sitemap, in both languages. */
export const PAGES: string[] = sitemapPaths();

/** Runs axe on the page and fails with a readable list if there is any violation. */
export async function expectNoAxeViolations(page: Page, testInfo: TestInfo, label: string) {
  const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
  await testInfo.attach(`axe-${label}.json`, { body: JSON.stringify(results.violations, null, 2), contentType: 'application/json' });
  const summary = results.violations.map(
    (v) => `${v.id} (${v.impact}): ${v.help}\n${v.nodes.map((n) => `    ${n.target.join(' ')}`).join('\n')}`,
  );
  expect(summary, `axe violations on ${label}`).toEqual([]);
}
