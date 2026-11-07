/**
 * axe-core on every page in both languages, at a phone width and a desktop
 * width, plus the interactive states (mobile menu open). The pass condition is
 * zero violations.
 */
import { test } from '@playwright/test';
import { expectNoAxeViolations, PAGES, VIEWPORTS } from './helpers';

for (const [name, viewport] of Object.entries(VIEWPORTS)) {
  test.describe(`axe at ${name} width (${viewport.width}px)`, () => {
    test.use({ viewport });
    for (const path of PAGES) {
      test(`${path}`, async ({ page }, testInfo) => {
        await page.goto(path);
        await expectNoAxeViolations(page, testInfo, `${name} ${path}`);
      });
    }
  });
}

test.describe('axe on interactive states', () => {
  test.use({ viewport: VIEWPORTS.mobile });

  for (const path of ['/', '/es/']) {
    test(`mobile menu open on ${path}`, async ({ page }, testInfo) => {
      await page.goto(path);
      await page.locator('[data-menu-button]').click();
      await expectNoAxeViolations(page, testInfo, `menu open ${path}`);
    });
  }

  test('404 page', async ({ page }, testInfo) => {
    await page.goto('/this-page-does-not-exist/');
    await expectNoAxeViolations(page, testInfo, '404');
  });
});
