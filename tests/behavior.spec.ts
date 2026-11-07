/**
 * Keyboard and structure behavior that automated rule checkers can't see.
 */
import { expect, test } from '@playwright/test';
import { routes } from '../src/i18n/routes';
import { PAGES, VIEWPORTS } from './helpers';

test.describe('every page', () => {
  for (const path of PAGES) {
    test(`structure and skip link: ${path}`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);

      // html lang matches the language of the address.
      await expect(page.locator('html')).toHaveAttribute('lang', path.startsWith('/es/') ? 'es' : 'en');

      // Exactly one h1, and headings never skip a level going down.
      await expect(page.locator('h1')).toHaveCount(1);
      const levels = await page.locator('h1, h2, h3, h4, h5, h6').evaluateAll((els) => els.map((el) => Number(el.tagName[1])));
      for (let i = 1; i < levels.length; i++) expect(levels[i]! - levels[i - 1]!, `heading order ${levels.join(',')}`).toBeLessThanOrEqual(1);

      // Landmarks.
      await expect(page.locator('header')).toHaveCount(1);
      await expect(page.locator('main#main')).toHaveCount(1);
      await expect(page.locator('footer')).toHaveCount(1);
      await expect(page.locator('nav')).toHaveCount(1);

      // The skip link is the first thing Tab reaches, and it moves focus to main.
      await page.keyboard.press('Tab');
      const skip = page.locator('a.skip-link');
      await expect(skip).toBeFocused();
      await expect(skip).toBeInViewport();
      await page.keyboard.press('Enter');
      await expect(page.locator('main#main')).toBeFocused();
    });

    test(`no horizontal scrolling at 320px: ${path}`, async ({ page }) => {
      // 320 CSS px is the WCAG 1.4.10 reflow width (1280px at 400% zoom; covers 200%).
      await page.setViewportSize({ width: 320, height: 640 });
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, 'page is wider than the viewport').toBeLessThanOrEqual(0);
    });

    test(`metadata: ${path}`, async ({ page }) => {
      await page.goto(path);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical && new URL(canonical).pathname).toBe(path);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /^.{20,}$/s);
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', path.startsWith('/es/') ? 'es_US' : 'en_US');
    });
  }
});

test('every page has a unique title and meta description', async ({ page }) => {
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();
  for (const path of PAGES) {
    await page.goto(path);
    const title = await page.title();
    const description = (await page.locator('meta[name="description"]').getAttribute('content')) ?? '';
    expect(titles.get(title), `title "${title}" on ${path}`).toBeUndefined();
    expect(descriptions.get(description), `description on ${path}`).toBeUndefined();
    titles.set(title, path);
    descriptions.set(description, path);
  }
});

test.describe('language switch', () => {
  for (const [key, paths] of Object.entries(routes)) {
    test(`${key}: English and Spanish point at each other`, async ({ page }) => {
      await page.goto(paths.en);
      const toSpanish = page.locator('a.lang-switch');
      await expect(toSpanish).toHaveAttribute('href', paths.es);
      await expect(toSpanish).toHaveAttribute('lang', 'es');
      await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute('href', new RegExp(`${paths.es}$`));

      await toSpanish.click();
      await expect(page).toHaveURL(paths.es);
      const toEnglish = page.locator('a.lang-switch');
      await expect(toEnglish).toHaveAttribute('href', paths.en);
      await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', new RegExp(`${paths.en}$`));
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', new RegExp(`${paths.en}$`));
    });
  }

  test('reachable and operable by keyboard', async ({ page }) => {
    await page.goto('/about/');
    await page.keyboard.press('Tab'); // skip link
    await page.keyboard.press('Tab'); // language switch
    await expect(page.locator('a.lang-switch')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(routes.about.es);
  });
});

test.describe('mobile menu', () => {
  test.use({ viewport: VIEWPORTS.mobile });

  test('opens and closes by keyboard, Escape returns focus, no trap', async ({ page }) => {
    await page.goto('/');
    const button = page.locator('[data-menu-button]');
    const menu = page.locator('#site-menu');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(button).toHaveAttribute('aria-controls', 'site-menu');
    await expect(menu).toBeHidden();

    await button.focus();
    await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(menu).toBeVisible();

    // Tab moves into the menu links.
    await page.keyboard.press('Tab');
    await expect(menu.locator('a').first()).toBeFocused();

    // Escape closes it and returns focus to the button.
    await page.keyboard.press('Escape');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeHidden();
    await expect(button).toBeFocused();

    // Space toggles it too, and Tab can leave the open menu (no trap).
    await page.keyboard.press('Space');
    await expect(menu).toBeVisible();
    const links = await menu.locator('a').count();
    for (let i = 0; i <= links; i++) await page.keyboard.press('Tab');
    const focusInMenu = await page.evaluate(() => document.getElementById('site-menu')?.contains(document.activeElement));
    expect(focusInMenu).toBe(false);
  });

  test('navigation is visible without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: VIEWPORTS.mobile });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('#site-menu')).toBeVisible();
    await expect(page.locator('[data-menu-button]')).toBeHidden();
    await context.close();
  });

  test('desktop shows the navigation without the menu button', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/');
    await expect(page.locator('#site-menu')).toBeVisible();
    await expect(page.locator('[data-menu-button]')).toBeHidden();
  });
});

test.describe('targets and focus', () => {
  test('buttons and navigation links are at least 44px tall; other targets at least 24px', async ({ page }) => {
    for (const viewport of Object.values(VIEWPORTS)) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      const sizes = await page.locator('.btn, .nav-link, .lang-switch').evaluateAll((els) =>
        els.filter((el) => (el as HTMLElement).offsetParent !== null).map((el) => ({ text: el.textContent?.trim(), h: el.getBoundingClientRect().height, w: el.getBoundingClientRect().width })),
      );
      for (const size of sizes) {
        expect(size.h, `${size.text} height`).toBeGreaterThanOrEqual(44);
        expect(size.w, `${size.text} width`).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('focus is visible: every focusable element in the header gets an outline', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/');
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const outline = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        const style = getComputedStyle(el);
        return { tag: el.tagName, width: parseFloat(style.outlineWidth), style: style.outlineStyle };
      });
      expect(outline.style, `${outline.tag} outline style`).not.toBe('none');
      expect(outline.width, `${outline.tag} outline width`).toBeGreaterThanOrEqual(2);
    }
  });
});

test('404 returns status 404 and is bilingual', async ({ page }) => {
  const response = await page.goto('/no-such-page/');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('Page not found');
  await expect(page.locator('[lang="es"]').first()).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
});

test('reduced motion: no transitions run when the user asks for less motion', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  const transitions = await page.locator('.btn').evaluateAll((els) => els.map((el) => getComputedStyle(el).transitionDuration));
  for (const duration of transitions) expect(duration).toMatch(/^0s(, 0s)*$/);
  await context.close();
});
