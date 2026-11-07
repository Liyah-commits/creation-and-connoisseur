# Decisions

A running record of every choice made in the rebuild and why. Newest entries go at the bottom of their section. "Ruled" means Aryah decided; everything else was decided during the build under the brief's instruction to work autonomously.

## Phase 0: discovery and stack

**D1. Node 24 LTS instead of Node 20.** Ruled by Aryah, 6 November 2026.
- **Why:** The brief fixed Node 20, but Node 20 reached end of life on 30 April 2026 and Vercel stopped building Node 20 projects on 1 October 2026 (Vercel changelog, "Node.js 20 is being deprecated"). The current releases of Astro, `@astrojs/react`, `@axe-core/playwright`, pa11y-ci, Lighthouse CI and linkinator all require Node 22 or newer.
- **Effect:** Keeping Node 20 meant an unsupported runtime, a toolchain pinned a year back, and a deploy Vercel would refuse. Node 24 is supported until April 2028.
- **Where it applies:** `.nvmrc`, `package.json` `engines`, and the CI workflow all say 24. Every other stack choice stays as briefed.

**D2. The repo stays local; no GitHub push or Vercel deploy from the build session.** Ruled by Aryah, 6 November 2026.
- **Why:** Creating a remote and deploying are outward-facing.
- **Effect:** Commits are made locally in `~/Documents/creation-and-connoisseur`. `docs/ADMIN_GUIDE.md` has the exact commands to create the repo, connect Vercel and set the environment variables.

**D3. The site is built in its own folder, not inside the repo where the work began.**
- **Why:** The session started in an unrelated repo. A sibling folder keeps the two projects' histories, CI and dependencies separate.

**D4. Blank scaffold, no redirects.**
- **Why:** Discovery found no prior site (`docs/PLAN.md`, section 1).
- **Effect:** `docs/CONTENT_INVENTORY.md` and `docs/REDIRECTS.md` record the empty result and the process for anything found later. (Phase 0 planned an empty `redirects` list in `vercel.json`; D23 moved redirects to `astro.config.mjs`, so there is no `vercel.json`.)

**D5. Only the four facts in the brief are stated on the site.**
- **The four facts:** the name; 501(c)(3) status; the focus on food insecurity at UNLV; that it is owned and run by Aryah Certain.
- **Everything else:** goes to `docs/OPEN_ITEMS.md` and renders as nothing. An empty field hides its whole section (heading included) rather than leaving a blank heading or placeholder text.

**D6. Current major versions.**
- **Versions:** Astro 7, `@astrojs/vercel` 11, `@keystatic/core` 0.6 with `@keystatic/astro` 6, Tailwind CSS 4, Playwright 1.65, `@axe-core/playwright` 4.14, pa11y-ci 5, Lighthouse CI 0.16, linkinator 8, TypeScript 5.9 (the newest major `@astrojs/check` supports), pnpm 10.
- **Why:** Each is the current release that runs on Node 24.
- **How they're pinned:** exact versions, through the lockfile. D22 lists the exact versions installed: the 7-day release-age rule (D7) held Playwright at 1.64 and Lighthouse CI at 0.15.

**D7. pnpm holds back any package version published less than 7 days ago (`minimumReleaseAge`).**
- **Why:** This guards against a compromised release being pulled in before the ecosystem notices it. It's cheap supply-chain hygiene, and it's the kind of control public-sector reviewers ask about.

**D8. Build from a Claude Code session started in this folder.** Ruled by Aryah, 6 November 2026.
- **Why:** The discovery session started inside another, unrelated project, whose project-level commit hook blocked git commits in every repo touched from that session. The hook belongs to that project, so it was neither edited nor worked around.
- **Effect:** From Phase 1 on, the build runs from `~/Documents/creation-and-connoisseur`, where per-phase commits work. `docs/HANDOFF.md` carries the planned Phase 1 design across, and Phase 0's commit is made first in the new session. At the end of Phase 1 the handoff's remaining design was moved into `docs/PLAN.md` (section 9) and `docs/OPEN_ITEMS.md`, and the handoff file was deleted.

## Phase 1: scaffold, layout, routing, CMS and test harness

**D9. Spanish pages have Spanish addresses, from one typed route table.**
- **What:** `src/i18n/routes.ts` maps each page key to its English and Spanish path (`/about/` and `/es/acerca-de/`, and so on). The header language switch, hreflang links, the sitemap, the navigation and the tests all read from it. Page files in `src/pages/` and `src/pages/es/` are three lines each and render a shared view from `src/views/`, so the two languages can't drift apart in layout.
- **Why:** Spanish speakers get addresses in their language, which is part of real bilingual delivery. One table means a page can't be linked in one place and missed in another.
- **Astro i18n:** `defaultLocale: 'en'`, `locales: ['en','es']`, `prefixDefaultLocale: false`. Each view is passed its language explicitly rather than inferring it from the URL.

**D10. Addresses end in a slash (`trailingSlash: 'always'`), with a dev-only fix for Keystatic.**
- **Why:** One form of every address avoids duplicate URLs. The canonical tags, sitemap and internal links all use the slash form.
- **Problem found:** Keystatic's admin calls `/api/keystatic/...` and reloads `/keystatic/...` without a slash. Astro's dev server answers those with 404, which broke local editing.
- **Fix:** a small Vite middleware in `astro.config.mjs` (dev server only) adds the slash to Keystatic paths before Astro checks them. In production the Vercel adapter already redirects slashless paths with a 308, which keeps the method and query string, so the GitHub sign-in callback and token refresh still work. Checked with `curl` against the dev server on 6 November 2026: `/keystatic` and `/api/keystatic/tree` return 200.

**D11. Content model.**
- **Pages:** one collection per language (`content/en/pages`, `content/es/pages`), as the brief asks for collections. Each fixed page is an entry whose file name is its route key (`getHelp.md`), shown in Keystatic as an "Internal name" with "Do not change" help text. `getPage()` in `src/lib/content.ts` fails the build, with the file path and how to restore it, if any entry is missing.
- **Programs and news:** one collection per language. A Spanish entry has an "English version" relationship field; the language switch uses it to pair entries. An entry with no translation switches to the other language's list page, and claims no hreflang pair.
- **People:** one shared YAML collection: name and photo once, role, bio and photo description in both languages, and a sort order. People without a photo get a decorative initials block.
- **Site settings:** one YAML singleton (`content/settings.yaml`) for legal name, EIN, email, phone, mailing address, donation link, social links, mission in both languages, a short description in both languages, and an optional founding year. Only the short description is filled, from the four facts.
- **Main text:** Markdoc saved as `.md` (`extension: 'md'` exists in the installed `@keystatic/core` 0.6.9 types). Headings are limited to levels 2 and 3, so editors can't add a second h1 or skip levels. Images, tables, code and dividers are switched off in the editor to keep the text simple and accessible.
- **Images:** an "Add an image" checkbox that reveals a required image and a required description (alt text). An image can't be saved without one. Files go in `content/images/<collection>/` with relative paths, so Astro optimizes them (AVIF and WebP, responsive sizes).
- **Interface strings:** `src/i18n/ui.ts`, a typed dictionary. `satisfies Record<string, Record<Lang, string>>` makes `pnpm check` fail if any key lacks English or Spanish, and a second check fails if a route has no navigation label.

**D12. Entry IDs are file names, exactly.**
- **Why:** Astro lowercases entry IDs by default (`getHelp` became `gethelp`), which broke page lookup. The missing-page guard caught it on the first build. Using the file name as the ID also keeps Keystatic's relationship values (which are file names) identical to Astro's IDs.

**D13. Keystatic storage: local in development, GitHub in production, never local in production.**
- **What:** `pnpm dev` saves edits straight to `content/`. A production build uses GitHub mode with the repo from `PUBLIC_KEYSTATIC_GITHUB_REPO` (`owner/name`).
- **Why not fall back to local mode when the variable is missing:** local mode on a live site would expose a write API. Instead the admin shows a "not configured" repository until the variable is set. `docs/ADMIN_GUIDE.md` lists the variables.
- **Navigation:** groups named English, Español and Shared, with plain-language help text on every field.
- **One-time setup:** Keystatic creates its GitHub App through a setup screen that only runs in development with GitHub storage. `PUBLIC_KEYSTATIC_STORAGE=github` forces GitHub mode in `pnpm dev` for that step (added in Phase 4 while writing `docs/ADMIN_GUIDE.md`).

**D14. Drafts: new entries start hidden; the template build shows them.**
- **What:** programs and news posts have a "Hide from the live site" checkbox, ticked by default, so a half-written entry never goes live by accident. The production build excludes drafts. `SHOW_DRAFTS=true` (the template build) includes them, with a visible "Draft" label.
- **Why:** there are no real programs or posts yet, so labeled draft examples are the only way to test those templates without publishing anything.

**D15. Site URL, never guessed.**
- **Order:** `SITE_URL`, then `https://` + `VERCEL_PROJECT_PRODUCTION_URL` (set by Vercel), then `http://localhost:4321`. Test builds set `SITE_URL=http://localhost:4321`, so Lighthouse's canonical check sees the same origin it's testing.

**D16. Search and sharing metadata.**
- A custom `sitemap.xml` endpoint with `xhtml:link` hreflang alternates (en, es, x-default) from the route table. `@astrojs/sitemap` can't pair pages whose addresses differ by language.
- `robots.txt` allows everything public and disallows `/keystatic/` and `/api/`.
- Every page: a unique title and meta description per language (from the CMS), a canonical link, hreflang en/es/x-default, Open Graph with `og:locale` `en_US` or `es_US`, and a Twitter card.
- Organization and NGO structured data (`@type: ["Organization","NGO"]`, `nonprofitStatus: Nonprofit501c3`) on the home page in each language. `taxID`, `email`, `telephone`, `legalName`, `foundingDate` and `sameAs` appear only once supplied.
- One bilingual `404.html`, served with status 404, `noindex`, the Spanish half marked `lang="es"`.

**D17. Palette and contrast.**
- **Why these colors:** there's no logo or brand color to inherit (`docs/OPEN_ITEMS.md`), so the palette is new: warm and food-related (cream, tomato, herb, saffron) with a dark brown ink.
- **Restricted:** Tailwind's default palette is switched off (`--color-*: initial`), so only these tokens can be used and the contrast table below covers every pair.
- **Checked by script:** `scripts/contrast.mjs` reads the tokens from `src/styles/global.css`, computes every pair with the WCAG formula, writes `reports/contrast.md`, and fails the suite below 4.5:1 for text or 3:1 for non-text and focus indicators. Saffron is never used for text or meaningful shapes on light backgrounds (1.74:1 on cream); it's decoration there.

| Token | Hex |
|---|---|
| cream (page) | `#FFF8EE` |
| white (cards) | `#FFFFFF` |
| ink (text) | `#2B1D16` |
| ink-muted | `#5E4A3E` |
| tomato (buttons) | `#B23A1E` |
| tomato-dark (links, hover) | `#8F2C14` |
| herb (accents) | `#2E5E3E` |
| saffron (decoration, footer links) | `#F2B544` |
| focus blue | `#1A4FBF` |

| Foreground | Background | Use | Type | Ratio | Needed | Result |
|---|---|---|---|---|---|---|
| ink `#2B1D16` | cream `#FFF8EE` | Body text on the page background | text | 15.44:1 | 4.5:1 | Pass |
| ink `#2B1D16` | white `#FFFFFF` | Text on cards, page headers, form fields and secondary buttons | text | 16.28:1 | 4.5:1 | Pass |
| ink-muted `#5E4A3E` | white `#FFFFFF` | Introductions, dates, roles, hints and the unavailable Donate button | text | 8.32:1 | 4.5:1 | Pass |
| ink-muted `#5E4A3E` | cream `#FFF8EE` | Muted text on the page background (404 page) | text | 7.89:1 | 4.5:1 | Pass |
| tomato-dark `#8F2C14` | cream `#FFF8EE` | Links and the current navigation item | text | 7.85:1 | 4.5:1 | Pass |
| tomato-dark `#8F2C14` | white `#FFFFFF` | Links on cards and page headers; form error text | text | 8.27:1 | 4.5:1 | Pass |
| white `#FFFFFF` | tomato `#B23A1E` | Primary buttons (Donate, Get help, Send) | text | 5.97:1 | 4.5:1 | Pass |
| white `#FFFFFF` | tomato-dark `#8F2C14` | Primary buttons on hover | text | 8.27:1 | 4.5:1 | Pass |
| ink `#2B1D16` | saffron `#F2B544` | Draft badge and text selection | text | 8.89:1 | 4.5:1 | Pass |
| cream `#FFF8EE` | ink `#2B1D16` | Footer text and the skip link | text | 15.44:1 | 4.5:1 | Pass |
| saffron `#F2B544` | ink `#2B1D16` | Footer links | text | 8.89:1 | 4.5:1 | Pass |
| focus `#1A4FBF` | cream `#FFF8EE` | Focus indicator on the page background | non-text | 6.83:1 | 3:1 | Pass |
| focus `#1A4FBF` | white `#FFFFFF` | Focus indicator on cards, page headers and forms | non-text | 7.21:1 | 3:1 | Pass |
| focus `#1A4FBF` | saffron `#F2B544` | Focus indicator where it crosses the saffron band at the top of the page | non-text | 3.93:1 | 3:1 | Pass |
| saffron `#F2B544` | ink `#2B1D16` | Focus indicator in the footer | non-text | 8.89:1 | 3:1 | Pass |
| ink `#2B1D16` | white `#FFFFFF` | Secondary button and menu button border | non-text | 16.28:1 | 3:1 | Pass |
| ink-muted `#5E4A3E` | white `#FFFFFF` | Form field borders; unavailable button border | non-text | 8.32:1 | 3:1 | Pass |
| tomato `#B23A1E` | cream `#FFF8EE` | Primary button shape against the page | non-text | 5.66:1 | 3:1 | Pass |
| tomato `#B23A1E` | white `#FFFFFF` | Primary button shape against cards | non-text | 5.97:1 | 3:1 | Pass |
| tomato-dark `#8F2C14` | white `#FFFFFF` | Error border on invalid form fields | non-text | 8.27:1 | 3:1 | Pass |

**D18. Focus indicator.**
- A 3px outline with a 3px gap on every interactive element (`:focus-visible`). It's focus blue on light surfaces and saffron on the dark footer. Because of the gap, the ring sits against the page background rather than the control, so the ratios that matter are blue on cream, white and saffron, and saffron on ink (all in the table).
- The skip link uses the blue ring, not saffron: its ring sits on cream, where saffron would be 1.74:1.

**D19. Fonts.** System sans-serif for text and a system serif stack (Georgia and similar) for headings. No web fonts to download, so nothing shifts while fonts load.

**D20. Header, navigation and interaction choices.**
- No sticky header, so focused content is never hidden behind it (WCAG 2.4.11).
- The skip link is the first focusable element and moves focus to `<main tabindex="-1">`.
- On small screens the navigation is a disclosure (`aria-expanded`, `aria-controls`). Escape closes it and returns focus to the button, and there's no focus trap. It's progressively enhanced: without JavaScript there's no button and the links are simply shown. An inline script adds a `js` class before first paint, so the menu doesn't flash open.
- Buttons, navigation links and the language switch are at least 44px tall; every target is at least 24px.
- Links are underlined everywhere, so they never rely on color.
- Button color transitions run only under `prefers-reduced-motion: no-preference`. There is no smooth scrolling: it was removed in Phase 3 because it only animated the skip-link jump and delayed focused elements coming into view.
- The language switch says "Español" (or "English") in that language, with `lang` and `hreflang` set, and a visually hidden "Ver esta página en español" so its purpose is clear to screen reader users.
- Missing photos get a decorative CSS pattern (`aria-hidden`). No stock photos.

**D21. Test harness.**
- **Two builds:** production (real content only, so empty states are tested) and templates (`SHOW_DRAFTS=true`, adds the labeled example entries). `pnpm test:all` runs both; CI runs them as a matrix.
- **Server:** `scripts/serve-static.mjs` serves `.vercel/output/static` like Vercel: `/x/` to `/x/index.html`, a 308 for a missing slash, `404.html` with status 404, compressed text. `astro preview` doesn't work with the Vercel adapter.
- **Pages tested:** read from the built sitemap (`scripts/site-urls.mjs`), so a new page is tested automatically.
- **axe (Playwright):** tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` and `best-practice`, on every page at 375px and 1280px, plus the mobile menu open and the 404 page. Zero violations to pass.
- **Behavior (Playwright):** one h1 and no skipped heading levels; landmarks; skip link first and working; `html lang`; canonical and `og:locale`; language switch pairs and hreflang for every route; switch reachable by keyboard; mobile menu by keyboard (Enter, Space, Tab, Escape, no trap); navigation visible without JavaScript; target sizes; visible focus; no horizontal scrolling at 320px on every page; reduced motion; 404 status.
- **pa11y-ci 5:** accepts a JavaScript config (`.pa11yci.cjs`, which may return a promise). Runners axe and htmlcs, standard WCAG2AA, every sitemap URL.
- **Lighthouse CI:** every page, one run each, Lighthouse's default mobile emulation and throttling (the stricter setting). Thresholds: accessibility, performance and best practices at least 0.95, SEO 1.
- **Links:** linkinator from every sitemap page. Internal links are strict: every link followed, fragments checked, and any redirect counted as broken, so a link missing its slash is caught. External links are requested once and reported; a failure is a warning unless `STRICT_EXTERNAL_LINKS=1`, because outside sites can be briefly down or block automated requests.
- **One browser:** pa11y and Lighthouse use Playwright's Chromium (`chromium.executablePath()`). Puppeteer's own download is blocked: pnpm doesn't run its install script, and CI sets `PUPPETEER_SKIP_DOWNLOAD`.
- **Reports:** written to `reports/<build>/` (git-ignored, uploaded by CI as artifacts).

**D22. What the 7-day release-age rule (D7) changed.**
- `@lhci/cli` is 0.15.1 (Lighthouse 12.6.1), not 0.16.0: 0.16.0 was published on 2 November 2026, four days before the build. Move to 0.16 after 9 November.
- `playwright` and `@playwright/test` are 1.64.1, not 1.65.0 (published 5 November).
- Astro resolved to 7.4.4, `@astrojs/vercel` to 11.0.17, `@astrojs/react` to 7.1.2 and Tailwind to 4.3.3, the newest versions older than seven days.
- `oxc-transform-react` isn't installed. It's an optional peer of `@astrojs/react` and `@vitejs/plugin-react`, used only for the React Compiler, which this site doesn't use. The two packages also ask for different versions of it (0.145 and 0.152).
- pnpm itself is pinned to 10.34.9 (25 October) through `packageManager`.

**D23. Redirects go in `astro.config.mjs`, not `vercel.json`.**
- **Why:** the Vercel adapter writes the deployment's routing itself (`.vercel/output/config.json`). A test entry in Astro's `redirects` showed up there as a route with status 301 on 6 November 2026. Whether Vercel also applies `vercel.json` redirects on top of an adapter's output couldn't be confirmed from Vercel's documentation, so the site doesn't rely on it. The brief's aim, a 301 for every old URL at Vercel's edge, is unchanged.
- **Effect:** there's no `vercel.json`. `docs/REDIRECTS.md` has the steps. It doesn't apply yet, because there's no old site (D4).

**D24. Share image and icons are typographic.** `public/og-image.png` (1200 by 630) shows the name as a wordmark, and the icons show "C&C" on tomato. No logo has been supplied, so none was invented. `pnpm images` (`scripts/make-images.mjs`) regenerates them from HTML in Playwright's Chromium. Replace them once real logo files exist (`docs/OPEN_ITEMS.md`).

**D25. Spanish register and gender.** Revised 6 November 2026: usted replaces tú. Ruled by Aryah.
- **Usted throughout.** The site was first written in neutral US Latin American Spanish in the tú register. It now uses usted everywhere: interface strings, form labels, hints, errors and success messages, button labels, and every page.
- **Why:** Aryah's content batch (6 November 2026, D38) is written in usted, and a page can't mix the two registers. Usted also suits the wider audience the new content speaks to. Get Help and the planned pantry address families and neighborhoods, not only students, and usted is the conventional register for public-service information in US Spanish.
- **How:** a find and replace of the tú forms (imperatives, *tu/tus*, *te*, verb endings), not a rewrite. A search of every Spanish file for tú forms came back clean. The 404 page had no tú forms, so it didn't change.
- **Gender:** where Spanish would otherwise force a gender, the copy uses a neutral phrasing: "Haga voluntariado", "Pertenece a Aryah Certain, quien también la dirige", "Persona anfitriona de Noche Cultural", "la persona coordinadora de voluntarios". The exception is Aryah's title, "Fundadora y Presidenta", as supplied.
- The Spanish reviewer still signs off every file (`docs/SPANISH_REVIEW.md`).

## Phase 2: pages, templates and forms

**D26. Forms.** Built to the design in `docs/PLAN.md` section 9, with these details:
- **One Formspree form for both forms.** `_subject` says which form and which language it came from, and `_language` carries `en` or `es`. That means one ID and one inbox to set up.
- **Validation:** fields keep the HTML `required` attribute. The script sets `novalidate` when it runs, so people without JavaScript still get the browser's own validation, and people with it get the custom messages.
- **Errors:** each message sits between the label (and hint) and the field. It starts with "Error:" in text, so it doesn't rely on the red color. It's added to the field's `aria-describedby` only while it shows, and it clears as soon as the field is fixed. On submit, focus moves to the first invalid field.
- **Live region:** a `role="status"` region is in the page from the start. It's cleared and refilled for each result, so a repeated message is announced again. Failure ("could not be sent") is announced too, and what the person typed is kept.
- **Not connected (no `FORMSPREE_FORM_ID`):** a plain-text notice above the form, linked to the form with `aria-describedby`. A valid submit announces that nothing was sent, and the browser makes no request (tested). Without JavaScript the form would post to its own page, which sends nothing anywhere. This state only lasts until the ID is set.
- **Spam:** a `_gotcha` honeypot hidden with `display:none`, so it's never focusable or announced.
- **Personal data fields** use `autocomplete` tokens (`name`, `email`, `tel`) for WCAG 1.3.5.
- **Volunteer form fields:** name, email, phone (optional), how you'd like to help, and when you're free (optional). No role list, because no volunteer roles are known yet (`docs/OPEN_ITEMS.md`).

**D27. Program and news pages.** Each entry page has a link back to its list, the title as the one h1, the date (news), the summary as the introduction, "When" and "Where" as a description list (programs, only when filled), the image with its alt text, and the main text. A shared image also becomes the page's `og:image`, and news posts are `og:type` article. The navigation marks the section (`aria-current="true"`) on entry pages.

**D28. What the template build adds, and why each part is fake on purpose.**
- **Example entries, all drafts:** one program and one news post per language, paired through "English version", plus a second English post with no translation, to test the language switch's fallback to the list page. There are also two example people, one with a photo and one without (to test the initials block). People got the same "Hide from the live site" checkbox as programs and news, so example or unfinished entries never ship.
- **Example images** are generated by `pnpm images` and say "Example image" on them.
- **Settings fixture:** `tests/fixtures/settings.template.yaml` holds obviously fake values (EIN `00-0000000`, `example.org` addresses, "Example mission statement…"). It's used only when `SHOW_DRAFTS=true`, so the footer EIN line, contact details, social links, mission and the working Donate link are tested before the real values exist. `example.org` is reserved for examples (RFC 2606), and the link checker skips it.
- **Formspree:** the template build uses the placeholder ID `template-test` so the connected path (success and failure) can be tested. The tests intercept the request in the browser, so nothing is ever sent. The production build has no ID and tests the "not connected" path.
- **The production build** is tested for the opposite: no example page is in the sitemap, `/programs/example-program/` returns 404, empty sections are absent, and the Donate button is unavailable but focusable and explained.

**D29. The English and Spanish home pages have different browser titles.** Both pages' h1 is the organization's name. The browser title adds a short description in the page's language ("Creation and Connoisseur | Nonprofit focused on food insecurity at UNLV"), because the brief asks for unique titles per page per language. A test now checks that every title and every meta description on the site is unique.

**D30. The test server survives abandoned requests.** Fast test runs sometimes close a page while a file is still being sent. The first version of `scripts/serve-static.mjs` crashed on that, which failed the rest of the run. It now checks the connection before writing and catches the error.

## Phase 3: findings and fixes

**D31. The editor workflow was tested end to end in the real admin.** On 6 November 2026 a script drove the Keystatic admin in `pnpm dev`. It created a program, ticked "Add an image", uploaded a file and tried to save without a description. Keystatic refused ("Image description (alt text) must not be empty"). With a description it saved, and the new entry then built and rendered in Astro. That confirmed three things the guides rely on: alt text can't be skipped, Keystatic's files match Astro's schema, and its image path (`content/images/<collection>/<slug>/image/value/image.png`) resolves.
- **Fix that came out of it:** English and Spanish programs (and news posts) shared one image folder keyed by the web address, so an English and a Spanish entry with the same address would have overwritten each other's images. Each language now has its own folder (`content/images/programs/en/`, `.../es/`). The example images moved to Keystatic's real folder layout.

**D32. More automated checks for what rule engines can't see.**
- **Text spacing (WCAG 1.4.12):** every page, at both widths, with the WCAG test values (line height 1.5, paragraph spacing 2em, letter spacing 0.12em, word spacing 0.16em). Pass condition: no horizontal overflow and no clipped content.
- **Text resized to 200% (WCAG 1.4.4):** every page at 1280px with the root font size doubled. Pass condition: no horizontal overflow.
- **Full keyboard walk (WCAG 2.1.1, 2.4.3, 2.4.7, 2.4.11):** four representative pages (home, Spanish contact form, volunteer form, About), at both widths with the mobile menu open. Every focus stop must have an outline at least 2px wide, be scrolled into view, not be covered by other content, and use the right ring color (saffron in the footer, blue elsewhere).

**D33. Smooth scrolling removed.** It only animated the skip-link jump, and the keyboard walk showed focused elements arriving in view late while it ran. Less motion is the better default.

**D34. Windows High Contrast (forced colors) checked.** Screenshots in Chromium with `forced-colors: active` showed buttons keeping a visible border (the transparent border becomes a system-color border), focus rings in the system highlight color, the unavailable Donate button keeping its dashed border, and form errors still readable as text. No change was needed. Aryah's manual passes should repeat this on Windows (`docs/ACCESSIBILITY_TEST_REPORT.md`).

**D35. Spanish About page: "Quiénes somos".** The navigation label "Acerca de" read as unfinished on its own. "Quiénes somos" is the usual Latin American label for an About page, and the page title now matches it (consistent identification, WCAG 3.2.4). The address stays `/es/acerca-de/`, so no link changes.

## Phase 4: documents

**D36. The test report doesn't claim conformance yet.** Every automated check passes with zero violations, but tools can't judge everything: whether descriptions make sense, how a screen reader sounds, real zoom behavior. The report marks those criteria "manual pending" and gives step-by-step passes (section 8). A WCAG 2.1 AA claim should be made after they're done, which is also what public-sector evaluators expect to see.

**D37. Guides are written from the real screens.** Button names and messages in `docs/EDITOR_GUIDE.md` ("Add", "Create", "Save", "Choose file", the alt-text error) and the setup screen in `docs/ADMIN_GUIDE.md` ("Keystatic Setup", "Create GitHub App") were taken from the running admin during the build, not from memory.

## Content batch (6 November 2026)

**D38. Aryah's content batch is loaded, with three edits.**
- **Source:** "Creation and Connoisseur: Website Content Batch (English and Spanish)", by Aryah, 6 November 2026, received as `~/Downloads/CONTENT_BATCH.md`. It isn't committed to the repo: it contains the text before the edits below, which shouldn't be published.
- **What it changes:** D5 limited the site to four facts. The batch, written by Aryah, now supplies the mission, story, programs, volunteer roles, Get Help resources, privacy answers, the accessibility contact, the UNLV relationship wording, and Aryah's title and bio. Those are now facts the site states. Everything the batch says it can't supply (EIN, legal name, address, email, phone, donation link, social links, year founded, Formspree ID, domain, photos, board roster) still ships empty.
- **Edit 1, the pantry:** every mention of the mobile food pantry, including the mission statement, describes it as planned and targeted for 2027, never as existing or committed. "Launching 2027", "In 2027 we take the next step", "we run monthly distributions" and "the launch of the mobile food pantry" became "planned for 2027", "Our next step is planned for 2027", "the plan is for monthly distributions" and, in Aryah's own wording, "and the planned mobile food pantry" ("y la despensa móvil de alimentos que está en planificación"). Every mention of Rotary and of partners was removed from the pantry text in both languages, so the pantry reads as Creation and Connoisseur's own plan. Mentions outside the pantry text stay as written: partner organizations in Biweekly Volunteering and the Service volunteer role, and "a Rotarian" and "partnerships" in Aryah's bio.
- **Edit 2, the figures:** "more than 200" and "hundreds of" were removed. The text says "student members" with no number, in both languages.
- **Edit 3, the register:** see D25.
- **Kept as written:** "campus program" for the UNLV Food Tasting Club, and the accessibility statement's "manual testing… is in progress" paragraph (until the manual passes are complete).
- **Drafts:** programs and Aryah's People entry are saved with **Hide from the live site** ticked. Pages and Site settings have no draft state in Keystatic. The new About story, Get Help, Volunteer, Privacy and Accessibility text, the mission and the UNLV statement are therefore in the production build now. Nothing has been deployed (D2), so none of it is public. Read it on a local build before the first deploy.
- **Choices made while loading** (all confirmed by Aryah on 6 November 2026):
  - Programs need a required "Short summary" (shown in lists and search results). The batch has none, so each was written from the batch's own sentences, under 160 characters. "Who it is for" has no field, so it's a bold line in the main text.
  - The batch gives Spanish role descriptions but not Spanish role names or commitments. Those were translated: "Voluntariado de servicio", "Persona anfitriona de Noche Cultural", "Equipo de eventos", "Equipo de la despensa (previsto para 2027)", "Voluntariado de habilidades profesionales".
  - In the privacy policy, the bold run-in labels ("What we collect.") became headings, with the same words. That follows the editor guide's own rule and makes the policy navigable. The existing hosting paragraph (Vercel processes IP addresses) and the "last updated" date were kept, because the batch doesn't cover them.
  - In the accessibility statement, the existing sentence saying `/keystatic` is out of scope, and the review date, were kept. The test report depends on the statement saying so.
  - On Spanish pages, links to English-only sites are marked "(sitio en inglés)" or "(en inglés)", as elsewhere on the site.
  - The batch's short-form mission wasn't loaded: it had no Keystatic location, and it described the pantry as existing. Aryah replaced it with a tagline that describes what exists today (D43).
  - The forms' privacy line now matches the supplied policy: "We only use what you send us to reply to you and to run our programs."

**D39. The UNLV relationship statement is a Site settings field, shown in the footer.** Confirmed by Aryah, 6 November 2026. The batch puts it "wherever the disclaimer field sits", and there wasn't one. Site settings now has "Relationship to UNLV (English / Spanish)". When filled, it replaces the footer's general "501(c)(3) nonprofit" line on every page, since its first sentence says the same and more. The batch asks for the wording to be confirmed with UNLV Student Involvement before publishing (`docs/OPEN_ITEMS.md`, item 10).

**D40. Get Help has a request form.** Confirmed by Aryah, 6 November 2026, since the copy promises one. The batch's Get Help text says "Use the form below", and the page had no form. It now has a third form, built from the same component: name, email, phone (optional), and "What do you need?" with the batch's prompt as the hint ("Tell us what you need, how many people are in your household, and the best way to reach you."). It goes to the same Formspree form, with the subject "Get Help request". Email is required, as on the other forms. If people without email need to use it, the next step is to accept either an email or a phone number.

**D41. The four Get Help resource links were verified on 6 November 2026.** Each was requested and its page title checked. Final addresses are used, so no link goes through a redirect. Three Square answers 200 even for pages that don't exist, so its page was confirmed by its title. The addresses are recorded in `docs/OPEN_ITEMS.md`, and the link checker requests them on every test run.

**D42. Program and news pages put their section in the browser title.** "UNLV Food Tasting Club" is the club's name in both languages, so its English and Spanish pages had the same title, and the uniqueness test (D29) failed. Rather than change the name, entry pages are now titled "<name> | Programs | Creation and Connoisseur" (or "Programas", "News", "Noticias"). That keeps every title unique, and it also tells people which part of the site they're on.

**D43. Tagline.** Supplied by Aryah on 6 November 2026, to replace the batch's short-form mission. It describes what exists today:
- English: "Fighting food insecurity at UNLV and across Las Vegas."
- Spanish: "Combatimos la inseguridad alimentaria en UNLV y en todo Las Vegas."

The site had no tagline field, so Site settings now has "Tagline (English / Spanish)", up to 100 characters. It appears under the organization's name in every footer, in the home page's browser and search-result title ("Creation and Connoisseur | Fighting food insecurity…", without the final period), and as `slogan` in the Organization structured data. The same words are the approved text for social media bios, which are off-site (`docs/OPEN_ITEMS.md`, item 9). The home page's visible introduction is unchanged.
