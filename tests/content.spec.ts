/**
 * Content states that differ between the two builds:
 *   production - drafts are excluded, empty facts render nothing, and the
 *                published content follows its rules (photos, stats, board,
 *                club email placement, no biweekly claim, redirects)
 *   templates  - example entries render, the language switch pairs entries,
 *                and the filled-in settings (EIN, contact, Donate link) show
 */
import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { routes } from '../src/i18n/routes';
import { ui } from '../src/i18n/ui';
import { PAGES } from './helpers';

const isTemplateBuild = PAGES.includes('/programs/example-program/');

/** The real Site settings file, read directly, so the Donate test follows whatever is set there. */
const donationUrl = /^donationUrl:\s*(\S+)/m.exec(readFileSync('content/settings.yaml', 'utf8'))?.[1]?.replace(/^['"]|['"]$/g, '') ?? '';

/** The only pages allowed to show the club's unlv.edu address (photos-inbox/FACTS.md, D52). */
const CLUB_EMAIL_PAGES = [
  '/programs/unlv-food-tasting-club/',
  '/es/programas/unlv-food-tasting-club/',
  routes.contact.en,
  routes.contact.es,
];

test.describe('production build', () => {
  test.skip(isTemplateBuild, 'Production build only.');

  test('drafts are not published; published entries are', async ({ page }) => {
    // The labeled examples are drafts and must never ship.
    expect(PAGES.some((path) => path.includes('example') || path.includes('ejemplo'))).toBe(false);
    const response = await page.goto('/programs/example-program/');
    expect(response?.status()).toBe(404);
    await page.goto(routes.programs.en);
    await expect(page.getByText(ui['draft.badge'].en, { exact: true })).toHaveCount(0);
    // News has published posts, so the list shows them instead of the empty state.
    await page.goto(routes.news.es);
    await expect(page.getByText(ui['news.empty'].es)).toHaveCount(0);
    await expect(page.locator('main article')).toHaveCount(4);
  });

  test('empty facts render nothing: no EIN line, no nonprofit email or phone', async ({ page }) => {
    await page.goto(routes.about.en);
    await expect(page.locator('footer')).not.toContainText('EIN');
    await expect(page.locator('footer a[href^="mailto:"]')).toHaveCount(0);
    await expect(page.locator('footer a[href^="tel:"]')).toHaveCount(0);
    // With no public email, the footer's contact column points to the contact form.
    await expect(page.locator('footer').getByRole('link', { name: ui['footer.contactForm'].en })).toHaveAttribute('href', routes.contact.en);
  });

  for (const lang of ['en', 'es'] as const) {
    test(`Donate follows Site settings: a working link when set, otherwise unavailable but explained (${lang})`, async ({ page }) => {
      await page.goto(routes.donate[lang]);
      if (donationUrl) {
        const link = page.locator('main a.btn', { hasText: ui['donate.button'][lang] });
        await expect(link).toHaveAttribute('href', donationUrl);
        await expect(link).toContainText(ui['donate.leavesSite'][lang]);
        await expect(page.locator('main button[aria-disabled="true"]')).toHaveCount(0);
        return;
      }
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

    test(`Home: the hero photo loads first, the stats strip has a label for each number (${lang})`, async ({ page }) => {
      await page.goto(routes.home[lang]);
      const hero = page.locator('main img[fetchpriority="high"]');
      await expect(hero).toHaveCount(1);
      await expect(hero).toHaveAttribute('loading', 'eager');
      await expect(hero).toHaveAttribute('alt', /\S/);
      const strip = page.locator('section[aria-labelledby="stats-heading"]');
      await expect(strip.getByRole('heading', { name: ui['home.statsHeading'][lang] })).toBeAttached();
      const items = strip.locator('li');
      await expect(items).toHaveCount(3);
      for (const item of await items.all()) {
        // Each item reads as one phrase: the number, then its plain-language label.
        await expect(item).toHaveText(/^\s*[\d,]+\+?\s+\p{L}.{10,}$/u);
      }
    });

    test(`About: the club board is a second group after the nonprofit's people (${lang})`, async ({ page }) => {
      await page.goto(routes.about[lang]);
      const headings = await page.locator('main h2').allTextContents();
      const people = headings.indexOf(ui['about.peopleHeading'][lang]);
      const board = headings.indexOf(ui['about.clubBoardHeading'][lang]);
      expect(people).toBeGreaterThanOrEqual(0);
      expect(board).toBe(people + 1);
      // Aryah Certain's nonprofit card keeps its initials placeholder until a photo is chosen.
      const founder = page.locator('section[aria-labelledby="people-heading"] article', { hasText: 'Aryah Certain' });
      await expect(founder.locator('img')).toHaveCount(0);
      // Nine board members, first names only, each with a described photo.
      const boardCards = page.locator('section[aria-labelledby="club-board-heading"] article');
      await expect(boardCards).toHaveCount(9);
      for (const card of await boardCards.all()) {
        await expect(card.locator('h3')).toHaveText(/^\S+$/);
        await expect(card.locator('img')).toHaveAttribute('alt', /\S/);
      }
      await expect(page.locator('section[aria-labelledby="club-life-heading"] img')).toHaveCount(3);
    });

    test(`social links show an icon and a visible name, in the footer and on Contact (${lang})`, async ({ page }) => {
      await page.goto(routes.contact[lang]);
      for (const scope of [page.locator('footer'), page.locator('main')]) {
        for (const [name, host] of [['Instagram', 'www.instagram.com'], ['TikTok', 'www.tiktok.com'], ['Discord', 'discord.gg']] as const) {
          const link = scope.getByRole('link', { name, exact: true });
          await expect(link).toHaveCount(1);
          expect(new URL((await link.getAttribute('href'))!).hostname).toBe(host);
          await expect(link.locator('svg')).toHaveAttribute('aria-hidden', 'true');
        }
      }
    });
  }

  test('the club unlv.edu email appears only on the club program and Contact pages, never in the footer', async ({ page }) => {
    for (const path of PAGES) {
      await page.goto(path);
      await expect(page.locator('footer'), path).not.toContainText(/unlv\.edu/i);
      const clubEmail = page.locator('main a[href^="mailto:"]').filter({ hasText: /@unlv\.edu$/i });
      await expect(clubEmail, path).toHaveCount(CLUB_EMAIL_PAGES.includes(path) ? 1 : 0);
    }
  });

  test('no page claims a biweekly volunteering schedule', async ({ page }) => {
    for (const path of PAGES) {
      await page.goto(path);
      await expect(page.locator('body'), path).not.toContainText(/biweekly|every other week|every two weeks|quincenal|cada dos semanas/i);
    }
  });

  test('images below the hero are lazy loaded', async ({ page }) => {
    for (const path of [routes.home.en, routes.about.es, '/programs/unlv-food-tasting-club/', '/news/taste-of-the-philippines/']) {
      await page.goto(path);
      const lazy = page.locator('main img:not([fetchpriority="high"])');
      expect(await lazy.count(), path).toBeGreaterThan(0);
      for (const img of await lazy.all()) await expect(img, path).toHaveAttribute('loading', 'lazy');
    }
  });

  test('the renamed volunteering program: old addresses are 301 redirects to the new ones', async () => {
    const config = JSON.parse(readFileSync('.vercel/output/config.json', 'utf8')) as { routes: { src?: string; status?: number; headers?: Record<string, string> }[] };
    const redirects = [
      ['/programs/biweekly-volunteering/', '/programs/volunteer-days/'],
      ['/es/programas/voluntariado-quincenal/', '/es/programas/jornadas-de-voluntariado/'],
    ] as const;
    for (const [from, to] of redirects) {
      const route = config.routes.find((r) => r.src && new RegExp(r.src).test(from));
      expect(route?.status, from).toBe(301);
      expect(route?.headers?.Location, from).toBe(to);
      expect(PAGES).toContain(to);
    }
  });
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
