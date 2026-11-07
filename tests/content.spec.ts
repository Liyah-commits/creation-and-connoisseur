/**
 * Content states that differ between the two builds:
 *   production - drafts are excluded, empty sections hide, Donate is unavailable
 *   templates  - example entries render, the language switch pairs entries,
 *                and the filled-in settings (EIN, contact, Donate link) show
 */
import { expect, test } from '@playwright/test';
import { routes } from '../src/i18n/routes';
import { ui } from '../src/i18n/ui';
import { PAGES } from './helpers';

const isTemplateBuild = PAGES.includes('/programs/example-program/');

test.describe('production build', () => {
  test.skip(isTemplateBuild, 'Production build only.');

  test('drafts are not published', async ({ page }) => {
    expect(PAGES.some((path) => path.includes('example'))).toBe(false);
    const response = await page.goto('/programs/example-program/');
    expect(response?.status()).toBe(404);
    await page.goto(routes.programs.en);
    await expect(page.getByText(ui['programs.empty'].en)).toBeVisible();
    await page.goto(routes.news.es);
    await expect(page.getByText(ui['news.empty'].es)).toBeVisible();
  });

  test('empty facts render nothing: no EIN line, no published people, no social links', async ({ page }) => {
    await page.goto(routes.about.en);
    await expect(page.getByRole('heading', { name: ui['about.peopleHeading'].en })).toHaveCount(0);
    await expect(page.locator('footer')).not.toContainText('EIN');
    await expect(page.getByRole('heading', { name: ui['footer.socialHeading'].en })).toHaveCount(0);
  });

  for (const lang of ['en', 'es'] as const) {
    test(`Donate button is unavailable but focusable and explained (${lang})`, async ({ page }) => {
      await page.goto(routes.donate[lang]);
      const button = page.locator('main button[aria-disabled="true"]');
      await expect(button).toHaveText(ui['donate.comingSoon'][lang]);
      await expect(button).toHaveAttribute('aria-describedby', 'donate-note');
      await expect(page.locator('#donate-note')).toHaveText(ui['donate.comingSoonNote'][lang]);
      await button.focus();
      await expect(button).toBeFocused();
      // Playwright won't click an aria-disabled element unless forced; clicking must do nothing.
      await button.click({ force: true });
      await expect(page).toHaveURL(routes.donate[lang]);
    });
  }
});

test.describe('template build', () => {
  test.skip(!isTemplateBuild, 'Template build only.');

  test('paired entries: the language switch and hreflang go to the translation', async ({ page }) => {
    const pairs = [
      ['/programs/example-program/', '/es/programas/programa-de-ejemplo/'],
      ['/news/example-news-post/', '/es/noticias/noticia-de-ejemplo/'],
    ] as const;
    for (const [en, es] of pairs) {
      await page.goto(en);
      await expect(page.locator('a.lang-switch')).toHaveAttribute('href', es);
      await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute('href', new RegExp(`${es}$`));
      await page.goto(es);
      await expect(page.locator('a.lang-switch')).toHaveAttribute('href', en);
      await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', new RegExp(`${en}$`));
    }
  });

  test('an entry without a translation switches to the list page and claims no alternate', async ({ page }) => {
    await page.goto('/news/example-post-without-translation/');
    await expect(page.locator('a.lang-switch')).toHaveAttribute('href', routes.news.es);
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0);
  });

  test('draft entries carry a visible draft notice and the section is marked current', async ({ page }) => {
    await page.goto('/programs/example-program/');
    await expect(page.getByText(ui['draft.notice'].en)).toBeVisible();
    await expect(page.locator('nav a[aria-current="true"]')).toHaveText(ui['nav.programs'].en);
    await expect(page.locator('main img').first()).toHaveAttribute('alt', /Example image/);
  });

  test('lists and the home page show entries; About shows mission and people', async ({ page }) => {
    await page.goto(routes.programs.en);
    await expect(page.getByRole('link', { name: 'Example program (template preview)' })).toBeVisible();
    await page.goto(routes.home.es);
    await expect(page.getByRole('heading', { name: ui['home.newsHeading'].es })).toBeVisible();
    await page.goto(routes.about.es);
    await expect(page.getByRole('heading', { name: ui['about.missionHeading'].es })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Example Person With Photo' })).toBeVisible();
    await expect(page.locator('main img[alt^="Foto de ejemplo"]')).toBeVisible();
  });

  test('filled-in settings show: EIN, contact details, social links, working Donate link', async ({ page }) => {
    await page.goto(routes.donate.en);
    const link = page.locator('main a.btn', { hasText: ui['donate.button'].en });
    await expect(link).toHaveAttribute('href', /^https:\/\//);
    await expect(page.locator('footer')).toContainText('EIN: 00-0000000');
    await expect(page.locator('footer a[href^="mailto:"]')).toHaveCount(1);
    await expect(page.locator('footer a[href^="tel:"]')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: ui['footer.socialHeading'].en })).toBeVisible();
  });
});
