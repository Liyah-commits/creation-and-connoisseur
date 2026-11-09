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

/** The tax line from photos-inbox/FACTS.md, word for word (D60). */
const TAX_FIRST_SENTENCE = {
  en: 'Creation and Connoisseur is a 501(c)(3) nonprofit, EIN 93-2889729.',
  es: 'Creation and Connoisseur es una organización sin fines de lucro 501(c)(3), EIN 93-2889729.',
} as const;
const TAX_LINE = {
  en: `${TAX_FIRST_SENTENCE.en} Donations are tax deductible to the extent allowed by law.`,
  es: `${TAX_FIRST_SENTENCE.es} Las donaciones son deducibles de impuestos en la medida en que lo permita la ley.`,
} as const;

/** The nonprofit's public email (photos-inbox/FACTS.md, D56). */
const NONPROFIT_EMAIL = 'info@creationandconnoisseur.org';

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

  test('empty facts render nothing: no phone; the footer has the tax line, the form link and the nonprofit email only', async ({ page }) => {
    // D60: the tax line's first sentence, from the EIN in Site settings, under the nonprofit description.
    for (const lang of ['en', 'es'] as const) {
      await page.goto(routes.about[lang]);
      await expect(page.locator('footer')).toContainText(TAX_FIRST_SENTENCE[lang]);
    }
    await page.goto(routes.about.en);
    await expect(page.locator('footer a[href^="tel:"]')).toHaveCount(0);
    await expect(page.locator('footer').getByRole('link', { name: ui['footer.contactForm'].en })).toHaveAttribute('href', routes.contact.en);
    const footerEmail = page.locator('footer a[href^="mailto:"]');
    await expect(footerEmail).toHaveCount(1);
    await expect(footerEmail).toHaveAttribute('href', `mailto:${NONPROFIT_EMAIL}`);
  });

  test('the nonprofit email is on Contact, Privacy, Accessibility and Get Help, in both languages, and the contact form stays', async ({ page }) => {
    for (const key of ['contact', 'privacy', 'accessibility', 'getHelp'] as const) {
      for (const lang of ['en', 'es'] as const) {
        await page.goto(routes[key][lang]);
        await expect(page.locator(`main a[href="mailto:${NONPROFIT_EMAIL}"]`).first(), routes[key][lang]).toHaveText(NONPROFIT_EMAIL);
      }
    }
    await page.goto(routes.contact.es);
    await expect(page.locator('main form')).toHaveCount(1);
  });

  for (const lang of ['en', 'es'] as const) {
    test(`Donate follows Site settings: a working link when set, otherwise unavailable but explained (${lang})`, async ({ page }) => {
      await page.goto(routes.donate[lang]);
      if (donationUrl) {
        const link = page.locator('main a.btn', { hasText: ui['donate.button'][lang] });
        await expect(link).toHaveAttribute('href', donationUrl);
        await expect(link).not.toHaveAttribute('target', /.+/);
        await expect(link).toContainText(ui['donate.leavesSite'][lang]);
        await expect(page.locator('main button[aria-disabled="true"]')).toHaveCount(0);
        // D60: intro, then the button and its note, then the two sections, then the tax line, in that order.
        await expect(page.locator('[data-donate] p').first()).toHaveText(ui['donate.giftNote'][lang]);
        const order = await page.locator('main h1, main [data-donate] a.btn, main .prose h2, main [data-tax-line]').evaluateAll((els) => els.map((el) => el.tagName + (el.hasAttribute('data-tax-line') ? '.tax' : '')));
        expect(order).toEqual(['H1', 'A', 'H2', 'H2', 'P.tax']);
        const programLinks = await page.locator('main .prose a').evaluateAll((links) => links.map((a) => (a as HTMLAnchorElement).getAttribute('href')));
        const programs = lang === 'en'
          ? ['/programs/volunteer-days/', '/programs/unlv-food-tasting-club/', '/programs/mobile-food-pantry/']
          : ['/es/programas/jornadas-de-voluntariado/', '/es/programas/unlv-food-tasting-club/', '/es/programas/despensa-movil-de-alimentos/'];
        expect(programLinks).toEqual([...programs, routes.volunteer[lang], `mailto:${NONPROFIT_EMAIL}`]);
        await expect(page.locator('main .prose')).not.toContainText(/%|\$\d/);
        await expect(page.locator('[data-tax-line]')).toHaveText(TAX_LINE[lang]);
        // The header Donate button still goes to this page, not straight to the giving platform.
        await expect(page.locator('header a.btn-accent')).toHaveAttribute('href', routes.donate[lang]);
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
      // D57: the hero line is the one h1; the site name stays in the browser title and og:title, and in the header wordmark.
      await expect(page.locator('main h1')).not.toHaveText('Creation and Connoisseur');
      await expect(page.locator('main h1')).toHaveText(/\S{3,}.*\S{3,}/);
      await expect(page).toHaveTitle(/^Creation and Connoisseur \| /);
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Creation and Connoisseur');
      await expect(page.locator('.wordmark svg')).toHaveAttribute('width', '40');
      const hero = page.locator('main img[fetchpriority="high"]');
      await expect(hero).toHaveCount(1);
      await expect(hero).toHaveAttribute('loading', 'eager');
      await expect(hero).toHaveAttribute('alt', /\S/);
      // At 1024px and wider the photo takes about half the content width, at 4:3, cropped with object-fit: cover.
      await page.setViewportSize({ width: 1280, height: 900 });
      const box = (await hero.boundingBox())!;
      expect(box.width / box.height).toBeCloseTo(4 / 3, 2);
      expect(box.width).toBeGreaterThan(1088 * 0.45);
      await expect(hero).toHaveCSS('object-fit', 'cover');
      const strip = page.locator('section[aria-labelledby="stats-heading"]');
      await expect(strip.getByRole('heading', { name: ui['home.statsHeading'][lang] })).toBeAttached();
      const items = strip.locator('li');
      await expect(items).toHaveCount(3);
      for (const item of await items.all()) {
        // Each item reads as one phrase: the value (a number or a word such as "Hundreds"), then its plain-language label.
        await expect(item).toHaveText(/^\s*\S+\s+\p{L}[\p{L} ]+$/u);
      }
      await expect(items.last()).toHaveText(lang === 'en' ? /^\s*Hundreds\s/ : /^\s*Cientos\s/);
    });

    test(`About: the club board is a second group after the nonprofit's people (${lang})`, async ({ page }) => {
      await page.goto(routes.about[lang]);
      const headings = await page.locator('main h2').allTextContents();
      const people = headings.indexOf(ui['about.peopleHeading'][lang]);
      const board = headings.indexOf(ui['about.clubBoardHeading'][lang]);
      expect(people).toBeGreaterThanOrEqual(0);
      expect(board).toBe(people + 1);
      // Nine board members, first names only.
      const boardCards = page.locator('section[aria-labelledby="club-board-heading"] article');
      await expect(boardCards).toHaveCount(9);
      for (const card of await boardCards.all()) await expect(card.locator('h3')).toHaveText(/^\S+$/);
      // D58: every person card shows initials in a solid sage circle, never a photo.
      const cards = page.locator('main article:has(h3)').filter({ has: page.locator('.initials') });
      await expect(cards).toHaveCount(10);
      for (const card of await cards.all()) {
        await expect(card.locator('img')).toHaveCount(0);
        await expect(card.locator('.initials')).toHaveCSS('background-color', 'rgb(63, 90, 71)');
        await expect(card.locator('.initials span')).toHaveCSS('color', 'rgb(247, 243, 236)');
        await expect(card.locator('.initials span')).toHaveText(/^[A-Z]{1,2}$/);
      }
      await expect(page.locator('main article:has(h3)', { hasText: 'Aryah Certain' }).locator('.initials')).toHaveText('AC');
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

  test('no page claims a biweekly volunteering schedule, shows Instagram figures, or links the old payment app', async ({ page }) => {
    for (const path of PAGES) {
      await page.goto(path);
      const body = page.locator('body');
      await expect(body, path).not.toContainText(/biweekly|every other week|every two weeks|quincenal|cada dos semanas/i);
      // FACTS.md (D54): no Instagram reach, impressions or follower counts anywhere.
      await expect(body, path).not.toContainText(/reached on instagram|alcanzadas en instagram|impressions|impresiones|followers|seguidores/i);
      // FACTS.md (D60): the old interim payment app is gone everywhere.
      await expect(body, path).not.toContainText(/cash ?app|unlvfood/i);
      await expect(page.locator('a[href*="cash.app"]'), path).toHaveCount(0);
    }
  });

  test('the volunteering photo: on Volunteer Days, the Volunteer page and the Home page, never the hero, never wider than 900px', async ({ page }) => {
    const placements = [
      [routes.home.en, /bag of groceries/],
      [routes.home.es, /bolsa de comestibles/],
      [routes.volunteer.en, /bag of groceries/],
      [routes.volunteer.es, /bolsa de comestibles/],
      ['/programs/volunteer-days/', /bag of groceries/],
      ['/es/programas/jornadas-de-voluntariado/', /bolsa de comestibles/],
    ] as const;
    for (const width of [1000, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      for (const [path, alt] of placements) {
        await page.goto(path);
        let found = 0;
        for (const img of await page.locator('main img').all()) {
          if (!alt.test((await img.getAttribute('alt')) ?? '')) continue;
          found++;
          await expect(img, path).toHaveAttribute('loading', 'lazy');
          expect(await img.getAttribute('fetchpriority'), path).toBeNull();
          expect((await img.boundingBox())!.width, `${path} at ${width}px`).toBeLessThanOrEqual(900);
        }
        expect(found, path).toBeGreaterThan(0);
      }
    }
    // The Volunteer page shows it in the page header (D58).
    await page.goto(routes.volunteer.en);
    await expect(page.locator('main > div').first().locator('img[alt*="bag of groceries"]')).toHaveCount(1);
  });

  test('privacy: the Zeffy policy is linked, with the screen-reader note; Spanish marks it as English', async ({ page }) => {
    for (const lang of ['en', 'es'] as const) {
      await page.goto(routes.privacy[lang]);
      const link = page.locator('main .prose a[href="https://support.zeffy.com/legal-data-privacy-security"]');
      await expect(link).toHaveCount(1);
      await expect(link.locator('.sr-only')).toHaveText(` ${ui['donate.leavesSite'][lang]}`);
      if (lang === 'es') expect(await link.evaluate((a) => a.nextSibling?.textContent?.trim().startsWith('(en inglés)'))).toBe(true);
    }
  });

  test('every link to another site in page text carries the screen-reader note in the page language (D61)', async ({ page }) => {
    let checked = 0;
    for (const path of PAGES) {
      await page.goto(path);
      const lang = path.startsWith('/es/') ? 'es' : 'en';
      for (const link of await page.locator('main .prose a[href^="http"]').all()) {
        await expect(link.locator('.sr-only'), `${path} ${await link.getAttribute('href')}`).toHaveText(` ${ui['donate.leavesSite'][lang]}`);
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(10);
  });

  test('no placeholder pattern or empty image slot anywhere, and no photo twice on any page', async ({ page }) => {
    for (const path of PAGES) {
      await page.goto(path);
      await expect(page.locator('.placeholder-pattern'), path).toHaveCount(0);
      const alts = await page.locator('main img').evaluateAll((imgs) => imgs.map((img) => (img as HTMLImageElement).alt));
      for (const alt of alts) expect(alt.trim(), `${path}: an image without alt text`).not.toBe('');
      const repeated = alts.filter((alt, i) => alts.indexOf(alt) !== i);
      expect(repeated, `${path}: photos shown twice`).toEqual([]);
    }
  });

  test('page header photos: 18rem and rounded on desktop, hidden on phones; none on Accessibility and Privacy', async ({ page }) => {
    const withPhoto = (['about', 'programs', 'news', 'getHelp', 'donate', 'contact', 'volunteer'] as const).flatMap((key) => [routes[key].en, routes[key].es]);
    const header = () => page.locator('main > div').first();
    await page.setViewportSize({ width: 1280, height: 900 });
    for (const path of withPhoto) {
      await page.goto(path);
      const img = header().locator('img');
      await expect(img, path).toHaveCount(1);
      await expect(img, path).toBeVisible();
      await expect(img, path).toHaveAttribute('loading', 'lazy');
      await expect(img, path).toHaveCSS('border-radius', '12px');
      expect(Math.round((await img.boundingBox())!.width), path).toBe(288);
    }
    for (const path of [routes.accessibility.en, routes.accessibility.es, routes.privacy.en, routes.privacy.es]) {
      await page.goto(path);
      await expect(header().locator('img'), path).toHaveCount(0);
      // The heading's column spans the full content width: no empty second column.
      expect(await header().locator('.container-page').evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length), path).toBe(1);
    }
    await page.setViewportSize({ width: 375, height: 812 });
    for (const path of [routes.about.en, routes.volunteer.es]) {
      await page.goto(path);
      await expect(header().locator('img'), path).toBeHidden();
    }
  });

  test('Home: the three "How you can take part" cards are an even row, each with a 3:2 photo', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    for (const lang of ['en', 'es'] as const) {
      await page.goto(routes.home[lang]);
      const cards = page.locator('section[aria-labelledby="actions-heading"] li');
      await expect(cards).toHaveCount(3);
      const boxes = await cards.evaluateAll((items) =>
        items.map((li) => {
          const img = li.querySelector('img')!.getBoundingClientRect();
          return { height: li.getBoundingClientRect().height, ratio: img.width / img.height, headingTop: li.querySelector('h3')!.getBoundingClientRect().top };
        }),
      );
      for (const box of boxes) {
        expect(box.ratio).toBeCloseTo(1.5, 1);
        expect(Math.abs(box.height - boxes[0]!.height)).toBeLessThan(1);
        expect(Math.abs(box.headingTop - boxes[0]!.headingTop)).toBeLessThan(1);
      }
    }
  });

  test('Home: sections are at most 4rem apart on desktop and 3rem on phones', async ({ page }) => {
    for (const [width, cap] of [[1280, 64], [375, 48]] as const) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(routes.home.en);
      const gaps = await page.locator('main section, footer').evaluateAll((els) => {
        const out: number[] = [];
        for (let i = 1; i < els.length; i++) out.push(Math.round(els[i]!.getBoundingClientRect().top - els[i - 1]!.getBoundingClientRect().bottom));
        return out;
      });
      for (const gap of gaps) expect(gap, `gap at ${width}px: ${gaps.join(', ')}`).toBeLessThanOrEqual(cap);
    }
  });

  test('images below the hero are lazy loaded', async ({ page }) => {
    for (const path of [routes.home.en, routes.about.es, routes.volunteer.en, '/programs/volunteer-days/', '/programs/unlv-food-tasting-club/', '/news/taste-of-the-philippines/']) {
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
    await expect(page.getByRole('heading', { name: 'Example Person Without Photo' })).toBeVisible();
    await expect(page.locator('main article', { hasText: 'Example Person Without Photo' }).locator('.initials')).toHaveText('EP');
  });

  test('filled-in settings show: EIN, contact details, social links, working Donate link', async ({ page }) => {
    await page.goto(routes.donate.en);
    const link = page.locator('main a.btn', { hasText: ui['donate.button'].en });
    await expect(link).toHaveAttribute('href', /^https:\/\//);
    await expect(page.locator('footer')).toContainText('Creation and Connoisseur is a 501(c)(3) nonprofit, EIN 00-0000000.');
    await expect(page.locator('footer a[href^="mailto:"]')).toHaveCount(1);
    await expect(page.locator('footer a[href^="tel:"]')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: ui['footer.socialHeading'].en })).toBeVisible();
  });
});
