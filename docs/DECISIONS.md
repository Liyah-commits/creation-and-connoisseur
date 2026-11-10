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
- **People:** one shared YAML collection: name once, role and bio in both languages, and a sort order. *(Since D58 there is no photo field: every card shows initials.)*
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

**D17. Palette and contrast.** *Superseded on 9 November 2026 by the "desert table" palette (D55); kept as the record of the first build.*
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

**D18. Focus indicator.** *The ring is unchanged in D55, except that on the dark footer it is now sand-50 instead of saffron.*
- A 3px outline with a 3px gap on every interactive element (`:focus-visible`). It's focus blue on light surfaces and saffron on the dark footer. Because of the gap, the ring sits against the page background rather than the control, so the ratios that matter are blue on cream, white and saffron, and saffron on ink (all in the table).
- The skip link uses the blue ring, not saffron: its ring sits on cream, where saffron would be 1.74:1.

**D19. Fonts.** *Superseded by D55: DM Serif Display and Inter, self-hosted.* System sans-serif for text and a system serif stack (Georgia and similar) for headings. No web fonts to download, so nothing shifts while fonts load.

**D20. Header, navigation and interaction choices.**
- No sticky header, so focused content is never hidden behind it (WCAG 2.4.11).
- The skip link is the first focusable element and moves focus to `<main tabindex="-1">`.
- On small screens the navigation is a disclosure (`aria-expanded`, `aria-controls`). Escape closes it and returns focus to the button, and there's no focus trap. It's progressively enhanced: without JavaScript there's no button and the links are simply shown. An inline script adds a `js` class before first paint, so the menu doesn't flash open.
- Buttons, navigation links and the language switch are at least 44px tall; every target is at least 24px.
- Links are underlined everywhere, so they never rely on color.
- Button color transitions run only under `prefers-reduced-motion: no-preference`. There is no smooth scrolling: it was removed in Phase 3 because it only animated the skip-link jump and delayed focused elements coming into view.
- The language switch says "Español" (or "English") in that language, with `lang` and `hreflang` set, and a visually hidden "Ver esta página en español" so its purpose is clear to screen reader users.
- Missing photos get a decorative CSS pattern (`aria-hidden`). No stock photos. *(Superseded by D58: no pattern; a missing photo leaves no slot.)*

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

**D24. Share image and icons are typographic.** *Superseded by D55: the icons and share image are now drawn from the logo mark.* `public/og-image.png` (1200 by 630) shows the name as a wordmark, and the icons show "C&C" on tomato. No logo has been supplied, so none was invented. `pnpm images` (`scripts/make-images.mjs`) regenerates them from HTML in Playwright's Chromium. Replace them once real logo files exist (`docs/OPEN_ITEMS.md`).

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
- **Edit 1, the pantry:** every mention of the mobile food pantry, including the mission statement, describes it as planned and targeted for 2027, never as existing or committed. "Launching 2027", "In 2027 we take the next step", "we run monthly distributions" and "the launch of the mobile food pantry" became "planned for 2027", "Our next step is planned for 2027", "the plan is for monthly distributions" and, in Aryah's own wording, "and the planned mobile food pantry" ("y la despensa móvil de alimentos que está en planificación"). Every mention of an outside organization or partner was removed from the pantry text in both languages, so the pantry reads as Creation and Connoisseur's own plan. Mentions outside the pantry text stay as written: partner organizations in Biweekly Volunteering and the Service volunteer role, and "partnerships" in Aryah's bio. (A membership named in the bio was removed on 9 November 2026, D54.)
- **Edit 2, the figures:** "more than 200" and "hundreds of" were removed. The text says "student members" with no number, in both languages.
- **Edit 3, the register:** see D25.
- **Kept as written:** "campus program" for the UNLV Food Tasting Club, and the accessibility statement's "manual testing… is in progress" paragraph (until the manual passes are complete).
- **Drafts:** programs and Aryah's People entry were saved with **Hide from the live site** ticked, then published before the first deploy (D44). Pages and Site settings have no draft state in Keystatic. The new About story, Get Help, Volunteer, Privacy and Accessibility text, the mission and the UNLV statement are therefore in the production build now. Nothing has been deployed (D2), so none of it is public. Read it on a local build before the first deploy.
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

**D44. The three programs and Aryah's bio are published before the first deploy.** Ruled by Aryah, 7 November 2026. Left as drafts, the site would have launched with an empty Programs page and no founder on About. **Hide from the live site** was unticked on Aryah's People entry and on all six program entries (three per language). The labeled examples stay drafts, because the template build needs them. The production tests now check the new state: the examples are absent (and return 404), no "Draft" label appears, and News, which has no posts yet, still shows its empty state.

## Before going public (7 November 2026)

**D45. Secrets check, and history cleaned before the first push.** The repo will be public, so evaluators can read the tests, CI and docs. Before choosing that, the full git history (all 8 commits, every file in every commit) was checked:
- **No secrets.** No `.env` file was ever committed. Every version of `.env.example` has empty values. There are no Keystatic values (client ID, client secret, `KEYSTATIC_SECRET`, app slug), no real Formspree ID (only the test placeholder `template-test` and the documentation example `abcdwxyz`), no token or private-key patterns, and no local file paths. `.env`, `.vercel/` and `reports/` are git-ignored.
- **Two non-secret exposures, fixed by rewriting history** (ruled by Aryah). Nothing had been pushed, so no one else was affected. Every commit got a new ID, and the commit dates are unchanged.
  - Every commit was authored with a personal Gmail address. It's now Aryah's GitHub privacy address (`281488484+Liyah-commits@users.noreply.github.com`), which is also this repo's commit email from now on.
  - The Phase 0 discovery record (`docs/PLAN.md`, D3, D8 and the old `docs/HANDOFF.md`) named other projects and files on Aryah's computer, and her GitHub repo count. They're replaced with generic wording ("an unrelated project", "every other folder in `~/Documents`") in every commit. The record of what was searched, and how, is unchanged.
- The site's files are identical before and after the rewrite (checked with a diff of the final commits); only those two documents changed. The full suite last passed on that same site content.

## Photos, stats, board, news and contact details (9 November 2026)

**D46. Source: `photos-inbox/FACTS.md`, published only where marked CONFIRMED.** Aryah supplied `photos-inbox/` on 8 November 2026: 30 photos, each with a sidecar giving English alt text (line 1) and Spanish alt text (line 2), and `FACTS.md`, confirmed from the club's Instagram export (post and reel captions, events, insights), the photos and the club's bio.site page. `photos-inbox/` and `instagram-export/` are git-ignored: the originals may show people who never agreed to be in a public repo, so only the optimized copies below are committed. Rules followed:
- Only lines marked CONFIRMED are published. Everything marked TO CONFIRM or NEEDED went to `docs/OPEN_ITEMS.md` and ships empty.
- Alt texts are used word for word. A script checked all 52 alt texts in the new content against the sidecars (each one is an exact sidecar line) and checked every referenced image file exists.
- **Ruled by Aryah, 9 November 2026:** the stat "13 cultural food nights since 2024" isn't published. `FACTS.md` marks it CONFIRMED in its stats list but TO CONFIRM in its "Still needed" list, and one of the 13 (the Italian American Heritage dinner, October 2024) is noted "confirm it was held". The Home strip shows the other three stats. The count is one entry in Keystatic, so it can be added once checked.
- Aryah asked for this batch to be committed and pushed (9 November 2026). The repository was already on GitHub; D2 governed the original build session.

**D47. Photos are optimized WebP copies in Keystatic's own folders.** Ruled by Aryah, 9 November 2026: they go in `content/images/` (the layout D31 tested), not `public/` or `src/assets/`, so editors can still replace them in Keystatic.
- Each committed file was re-encoded from the original in `photos-inbox/`: WebP at quality 78, width capped at 1600 pixels (800 for board portraits, which show at 112 to 224 pixels), orientation applied, and all metadata stripped (EXIF, including any location, and color profiles). 39 files, 4.6 MB. Programs and news keep a copy per language (D31).
- Astro then serves AVIF with a WebP fallback, at responsive widths. Astro's default fallback for a non-JPEG source is PNG, which put about 64 MB of PNG files into the deploy that no current browser would download. Every `<Picture>` now sets `fallbackFormat="webp"`, and the deploy's images went from 72 MB to 8.7 MB.
- The Home photo is the only image that isn't lazy loaded (`loading="eager"`, `fetchpriority="high"`), since it's the likely largest paint. Every other image is lazy loaded (tested).

**D48. "Biweekly Volunteering" is now "Volunteer Days" ("Jornadas de Voluntariado"), with redirects.** `FACTS.md`: the posts show a volunteer day every few months, and the club's Instagram graphic says weekly. Neither supports "every other week".
- The schedule is the `FACTS.md` line ("Regular volunteer days through the school year, announced on Instagram and in our group chat"), without its "Schedule:" label, because the page's "When" label already says it. The same applies to the Spanish line.
- The cadence claim was also removed from the program's summary and main text, the About story ("Every other week, those volunteers…") and the Service volunteer role ("a biweekly shift"), in both languages. A test fails if any page says "biweekly", "every other week", "every two weeks", "quincenal" or "cada dos semanas".
- The web addresses changed too (`/programs/volunteer-days/`, `/es/programas/jornadas-de-voluntariado/`), since the old ones carried the claim. The old addresses are 301 redirects in `astro.config.mjs` (D23), recorded in `docs/REDIRECTS.md` and tested against `.vercel/output/config.json`.
- Partners named on the program, as `FACTS.md` confirms: Three Square Food Bank and Olive Crest.

**D49. Home and About photos and stats are a shared Keystatic singleton.** "Home and About photos and stats" (`content/highlights.yaml`, under Shared) holds the Home photo with English and Spanish descriptions, up to four stats (a number, and a label in each language), and up to six club life photos for About. It's shared, like People, so a photo or a number is entered once for both languages. The stats strip sits under the Home photo. It has a visually hidden heading ("Our work in numbers"), and each number and its label read as one phrase.

**D50. Programs and news posts can have "More photos".** An optional list of up to six photos, each with required alt text, shown under the main text with the heading "Photos". Photos keep their own shape (no cropping). The single main image is still the one used on list cards and in social previews.

**D51. People have a Group, and the club board is listed on About.** The Group is either "Creation and Connoisseur" (the default) or "UNLV Food Tasting Club board". About shows the board as a second section, headed "UNLV Food Tasting Club board" ("Junta del UNLV Food Tasting Club"), directly after "Our people".
- The nine board members from `FACTS.md` (the 29 September 2026 post) are listed by first name only, as `FACTS.md` asks, with the bio "Favorite food: …" in both languages and their club portraits. Each portrait has the person's name and title printed on it; `FACTS.md` says to use them until clean originals arrive.
- Aryah appears twice on purpose: as Aryah Certain, Founder and President of the nonprofit, unchanged (initials until her About photo is chosen, which is still TO CONFIRM), and as Aryah, President and Treasurer, in the club board with the club portrait, as `FACTS.md` recommends.
- **Spanish titles are gendered, as supplied.** Each title follows the person's supplied Spanish alt text ("Zau, organizador de eventos", "Joy, secretaria", "Jaziel, fotógrafo"). This is an exception to D25's neutral phrasing: the forms come from Aryah's source, not from guessing gender from names. The Spanish reviewer should confirm each one with the person.

**D52. The club's email appears only on the club page and in one Contact line.** `Foodtastingclub@unlv.edu` is shown on the UNLV Food Tasting Club program page (both languages) and in a "UNLV Food Tasting Club" line on Contact. It's never in the footer or in Site settings, because a unlv.edu address shown site-wide would imply the university's endorsement.
- Site settings' public email stays empty, so the footer and Contact point to the contact form.
- The Contact line is the Contact page's main text. That text now appears under "Other ways to reach us", after the form. It used to appear above the form, but it was empty until now.
- A test visits every page and checks the address appears exactly once on those four pages, and nowhere else.

**D53. Social links, Donate link and mission.**
- **Social links:** Instagram, TikTok and Discord are in Site settings. They show in the footer and now also on Contact. Each link has a decorative icon, chosen from the address, and its visible name ("Instagram"), which is also its accessible name. An address the site doesn't recognize gets a generic link icon.
- **Donate link:** an interim payment link from `FACTS.md`, to be replaced with a nonprofit processor before December (replaced by Zeffy, D60). The production Donate test now follows Site settings: it checks the working link when one is set, and the unavailable state otherwise.
- **Mission:** now exactly "Creation and Connoisseur fights food insecurity at UNLV and across Las Vegas." ("…combate la inseguridad alimentaria en UNLV y en todo Las Vegas."). The pantry sentence was removed from this field; the pantry is still described as planned on its own program page.
- **News:** four posts in each language, from the `FACTS.md` news list, each with two short paragraphs written only from its facts and its photos' descriptions. "Volunteering at Three Square" is text only: `FACTS.md` offered the board photo (08) as an alternative, but it shows the board on a city street, not volunteering. The optional Taste of the Caribbean notice wasn't created, because it would have to be taken down after 12 November. With posts published, the production test checks the News list instead of its empty state (D44).

## Confirmed stats and hero line (9 November 2026)

**D54. Stats, hero line and club intro follow the updated `FACTS.md`.** Aryah updated `photos-inbox/FACTS.md` on 9 November 2026, and it overrides the earlier content.
- **Stats:** exactly three, in this order, with no extra wording: "1,000+ people fed" ("personas alimentadas"), "100+ families fed" ("familias alimentadas") and "Hundreds of students at culture nights" ("Cientos de estudiantes en noches culturales").
  - "1,000+" is Aryah's figure from the club's captions (over 700 people on 23 January 2026, over 100 families on 6 November 2026).
  - No count of nights is shown, because the club has run far more than the 13 documented on Instagram.
  - The Instagram reach stat was removed. Instagram reach, impressions and follower counts are never shown, and a test checks every page for them.
  - Because "Hundreds" is a word, each stat now has an optional Spanish value ("Cientos"). When it's empty, the English value is used.
- **Hero line:** the Home introduction is Aryah's wording: "Celebrating the cultures that make up Nevada, and making sure no one goes hungry." ("Celebramos las culturas que forman Nevada y trabajamos para que nadie pase hambre."). The h1 stays the organization's name, because the page title field (60 characters at most) is also the browser title.
- **Club intro:** the UNLV Food Tasting Club program's short summary, which is the introduction under its heading (and its card text), is now "Culture nights celebrating the cultures that make up Nevada." ("Noches culturales que celebran las culturas que forman Nevada.").
- **Mission:** already the `FACTS.md` mission (D53). Unchanged.
- **No mention of a particular service club anywhere.** Aryah's instruction of 9 November 2026. Aryah's bio no longer names a membership (both languages), and the two decision and review notes that named it were reworded. Older commits in the git history still contain the earlier wording.

## Desert table redesign (9 November 2026)

**D55. "Desert table" redesign: palette, type, logo and icons.** Direction B, chosen by Aryah on 9 November 2026 (`photos-inbox/REDESIGN.md`, git-ignored).
- **Why:** the first palette (tomato, saffron and cream, D17) and the "C&C" favicon (D24) were placeholders made before any brand existed. The new look is meant to feel warm, calm and specific to Nevada, and to let the food photos carry the color: sand neutrals, a deep sage for actions, and coral as a small accent.
- **Palette:** it replaces the whole `@theme` color block, and the token names changed. Every class that used `cream`, `tomato`, `tomato-dark`, `herb` or `saffron` was moved to the new names across `src/`. A search of `src/` for the old names comes back empty.

  | Token | Hex | Role |
  |---|---|---|
  | sand-50 | `#F7F3EC` | Page background |
  | white | `#FFFFFF` | Cards, page headers, form fields |
  | sand | `#EFE3D1` | Stats strip band; card borders |
  | sandstone | `#E3C9A8` | Decoration only: rules under headers, image frames, the draft badge, the logo's table line |
  | ink | `#26302A` | Body text and headings |
  | ink-muted | `#4E5A52` | Intros, dates, roles, hints, form field borders |
  | sage | `#3F5A47` | Primary buttons, stat numbers, current navigation item |
  | sage-dark | `#2C4033` | Links, primary button hover, footer background |
  | coral | `#B04A32` | Donate button, the logo's sun |
  | coral-dark | `#8E3A25` | Donate hover, form error text and error borders |
  | focus | `#1A4FBF` | Focus indicator (unchanged) |

- **Rules:** coral is never text on sand or sandstone (4.28:1 and 3.41:1 would fail). The only coral text is white-on-coral in the Donate button. ink-muted is never on sandstone. Text selection is ink on sandstone.
- **Focus ring on the footer:** the ring stays focus blue on light surfaces (D18). The footer is now sage-dark, where blue would be about 1.5:1, so the footer ring is sand-50 (10.05:1). The keyboard-walk test checks both colors.
- **Contrast, every pair the templates use** (`scripts/contrast.mjs` checks these on every run; text needs 4.5:1 and non-text 3:1, and no text relies on the large-text allowance):

| Foreground | Background | Use | Type | Ratio | Needed | Result |
|---|---|---|---|---|---|---|
| ink `#26302A` | sand-50 `#F7F3EC` | Body text on the page background; the wordmark in the header | text | 12.34:1 | 4.5:1 | Pass |
| ink `#26302A` | white `#FFFFFF` | Text on cards, page headers, form fields and secondary buttons; the Home hero line | text | 13.65:1 | 4.5:1 | Pass |
| ink `#26302A` | sand `#EFE3D1` | Stat labels on the stats strip | text | 10.77:1 | 4.5:1 | Pass |
| ink `#26302A` | sandstone `#E3C9A8` | Draft badge, draft notice and text selection | text | 8.57:1 | 4.5:1 | Pass |
| ink-muted `#4E5A52` | white `#FFFFFF` | Introductions, dates, roles, hints and the unavailable Donate button | text | 7.22:1 | 4.5:1 | Pass |
| ink-muted `#4E5A52` | sand-50 `#F7F3EC` | Muted text on the page background (404 page) | text | 6.53:1 | 4.5:1 | Pass |
| sage `#3F5A47` | sand `#EFE3D1` | Stat numbers on the stats strip | text | 6.00:1 | 4.5:1 | Pass |
| sage `#3F5A47` | sand-50 `#F7F3EC` | The current navigation item; "and" in the header wordmark | text | 6.87:1 | 4.5:1 | Pass |
| sage-dark `#2C4033` | sand-50 `#F7F3EC` | Links on the page background, including the language switch area | text | 10.05:1 | 4.5:1 | Pass |
| sage-dark `#2C4033` | white `#FFFFFF` | Links on cards, page headers and forms | text | 11.12:1 | 4.5:1 | Pass |
| white `#FFFFFF` | sage `#3F5A47` | Primary buttons (Volunteer with us, Send) | text | 7.60:1 | 4.5:1 | Pass |
| white `#FFFFFF` | sage-dark `#2C4033` | Primary buttons on hover | text | 11.12:1 | 4.5:1 | Pass |
| white `#FFFFFF` | coral `#B04A32` | Donate button in the header | text | 5.42:1 | 4.5:1 | Pass |
| white `#FFFFFF` | coral-dark `#8E3A25` | Donate button on hover | text | 7.55:1 | 4.5:1 | Pass |
| coral-dark `#8E3A25` | white `#FFFFFF` | Form error text | text | 7.55:1 | 4.5:1 | Pass |
| sand-50 `#F7F3EC` | sage-dark `#2C4033` | Footer text and headings | text | 10.05:1 | 4.5:1 | Pass |
| sandstone `#E3C9A8` | sage-dark `#2C4033` | Footer links | text | 6.98:1 | 4.5:1 | Pass |
| sand-50 `#F7F3EC` | ink `#26302A` | The skip link | text | 12.34:1 | 4.5:1 | Pass |
| focus `#1A4FBF` | sand-50 `#F7F3EC` | Focus indicator on the page background | non-text | 6.51:1 | 3:1 | Pass |
| focus `#1A4FBF` | white `#FFFFFF` | Focus indicator on cards, page headers and forms | non-text | 7.21:1 | 3:1 | Pass |
| sand-50 `#F7F3EC` | sage-dark `#2C4033` | Focus indicator in the footer | non-text | 10.05:1 | 3:1 | Pass |
| ink `#26302A` | white `#FFFFFF` | Secondary button border | non-text | 13.65:1 | 3:1 | Pass |
| ink `#26302A` | sand-50 `#F7F3EC` | Menu button border in the header | non-text | 12.34:1 | 3:1 | Pass |
| ink-muted `#4E5A52` | white `#FFFFFF` | Form field borders; unavailable button border | non-text | 7.22:1 | 3:1 | Pass |
| sage `#3F5A47` | white `#FFFFFF` | Primary button shape against cards, forms and the Home hero | non-text | 7.60:1 | 3:1 | Pass |
| coral `#B04A32` | sand-50 `#F7F3EC` | Donate button shape against the header | non-text | 4.90:1 | 3:1 | Pass |
| coral-dark `#8E3A25` | white `#FFFFFF` | Error border on invalid form fields | non-text | 7.55:1 | 3:1 | Pass |
| sage `#3F5A47` | sand-50 `#F7F3EC` | Form status message border | non-text | 6.87:1 | 3:1 | Pass |

- **Type:**
  - Headings and the wordmark are DM Serif Display, which has one weight, so `h1`, `h2` and `h3` are weight 400 with `font-synthesis-weight: none`, and every `font-bold` on serif text was removed. The browser never fakes a bold.
  - Body and interface text is Inter (variable). Body size stays 1.0625rem with line-height 1.6.
  - Both are self-hosted through `@fontsource/dm-serif-display` and `@fontsource-variable/inter` (5.3.0, older than the seven-day rule of D7), with `font-display: swap` and the system stacks as fallbacks. Only the Latin and Latin Extended subsets are declared (`src/styles/fonts.css`), so Spanish accents render. No request goes to Google Fonts or any other font service.
  - The two Latin files every page uses first (DM Serif Display regular, Inter regular) are preloaded.
- **Logo:** an original mark of a coral sun setting behind a sage mesa, on a sandstone table line ("a Nevada table"), with no UNLV marks, colors or typefaces.
  - In the header: the mark at 32px (`aria-hidden`), then the wordmark as live text ("Creation *and* Connoisseur", DM Serif Display, ink, "and" in italic sage). The lockup is still the home link, with the same accessible name.
  - In the footer: the mark at 24px. On sage-dark the sage mesa would disappear, so there it sits on a small sand-50 rounded tile, the same tile as the favicon.
  - The drawing is `src/components/LogoMark.astro`.
- **Icons and share image:** `pnpm images` (`scripts/make-images.mjs`) draws them from the mark, with colors read from `global.css`, the hero line from `content/en/pages/home.md`, and the self-hosted DM Serif Display. `favicon.svg` is the mark on a sand-50 rounded square (rx 12 on a 64 viewBox) and keeps its `<title>`. `favicon.ico` holds 32 and 16 pixel images. `apple-touch-icon.png` is 180 pixels on sand-50. `og-image.png` is 1200 by 630: sand-50, the mark, the wordmark and the English hero line in ink. The example images for the template build are only redrawn with `--examples`, and keep their original look, which their alt text describes. Nothing else in `public/` changed.
- **Layout:**
  - The saffron band at the top of every page is gone. A 2px sandstone rule runs under the site header and under each page's header band (the page title band, the Home hero and the program and news header).
  - Cards (program and news cards, people, the Home action cards, the Donate box, the forms and empty states) are white with a 1px sand border, 12px corners and no shadow (`.card`).
  - The Home hero keeps the Thai Night photo. The hero line is in DM Serif Display. There is one primary button, sage, "Volunteer with us" ("Sea voluntario"), and one secondary button outlined in ink ("Get help").
  - The stats strip is a sand band, with numbers in sage DM Serif Display and labels in ink. It is one column on phones and three columns from 640px. At 320, 768 and 1280px, in both languages, nothing overflows and each value (including "Hundreds" and "Cientos") stays on one line.
  - Links are still underlined everywhere, and the focus style is unchanged. The only transition is the existing button background, inside `prefers-reduced-motion: no-preference`.
- **Spanish:** "Sea voluntario" is Aryah's wording from the brief. It uses the masculine form, unlike D25's neutral phrasing, so the Spanish reviewer should confirm it (`docs/SPANISH_REVIEW.md`).

## Nonprofit email and volunteering photo (9 November 2026)

**D56. The nonprofit email and the volunteering photo.** From the updated `photos-inbox/FACTS.md`.
- **Email:** `info@creationandconnoisseur.org` (live 9 November 2026) is the public email in Site settings, so it shows in the footer and on Contact. The privacy policy, accessibility statement and Get Help page now give it directly instead of pointing to "the email on our Contact page", in both languages, because `FACTS.md` asks for it anywhere the site gives a general contact address. The privacy policy's "last updated" date is now 9 November 2026. The contact form stays. `Foodtastingclub@unlv.edu` is unchanged: only on the club program page and in its Contact line (D52). Tests check the footer has exactly this address and that it appears on all four pages in both languages.
- **Volunteering photo** (`31-volunteer-handoff.jpg`, 1284 by 900, a phone screenshot): re-encoded to WebP at its own width, with no metadata (48 KB). It's cropped so no food recipient's face shows, and `FACTS.md` says never to swap in an uncropped version. The site shows it uncropped, except that program cards crop to 3:2. Its alt text is the supplied sidecar, word for word, and neither the alt text nor any caption names a partner, because the photo's partner isn't confirmed.
  - **Volunteer Days:** it replaces photo 18 as the program's main image in both languages, so it's the card image and the image at the top of the program page.
  - **Volunteer page:** it sits in the page header, in place of the decorative pattern. `PageHeader` now takes an optional photo.
  - **Home:** it sits at the top of the Volunteer card in "How you can take part". The Volunteer Days program card further down the Home page shows it too.
  - It comes from a new "Show a volunteering photo" field in the shared screen, renamed "Photos and stats (Home, About, Volunteer)" (D49).
  - **Never wider than 900px, never the hero:** program and news page images are now capped at 900px wide (the cap applied at a 1000px window, where the program image used to fill 936px). The other placements are narrower. Every placement is lazy loaded, and the Home hero is still the Thai Night photo. A test checks the width at 1000 and 1280px on all six pages.

## Home page fixes (9 November 2026)

**D57. The hero line is the Home page's h1; a larger hero photo and logo mark.**
- **H1:** the organization's name appeared twice at the top of the Home page, in the header wordmark and as the hero h1. The hero line from `FACTS.md` (the Home page's Introduction field) is now the one h1, in both languages, at the normal h1 size, and the repeated name is gone from the hero. The Page title is unchanged, so the browser title, `og:title` and search results are unchanged ("Creation and Connoisseur | …"). If the Introduction is ever left empty, the Page title becomes the h1, so the page always has one. This replaces D54's note that the h1 stayed the organization's name.
- **Hero photo:** from 1024px it takes half the content width (two equal columns, minus the gap) and is cropped to 4:3 with `object-fit: cover`. Below 768px it is full width under the heading and buttons. From 768 to 1023px it keeps the earlier two-column layout (text 3, photo 2), which the request didn't cover. It's still the only eager image, with `fetchpriority="high"`, and `sizes` was updated for the wider column.
- **Logo:** the mark in the header lockup is 40px (it was 32px, D55). The wordmark's size and alignment and the home link's accessible name ("Creation and Connoisseur") are unchanged.
- At 320, 768 and 1280px (and 1024px), in both languages, the Home page has no horizontal overflow. A test checks the h1, the titles, the 40px mark, and the photo's 4:3 ratio and width at 1280px.

## Photos in place of patterns (9 November 2026)

**D58. Every blank spot gets a photo or goes away.** Aryah's instruction of 9 November 2026. Photos and alt text are from `photos-inbox/` (each sidecar, word for word). Every new photo was re-encoded to WebP at quality 78, no wider than its own width (and 1600px at most), with no metadata.
- **No placeholder pattern:** the `.placeholder-pattern` CSS and every element that used it are gone (page headers, cards, person cards, the Home hero fallback). No component renders an empty or decorative image slot: a card or header without a photo simply has none, and the text takes the space. A test checks every page.
- **Page header photos** come from "Page header photos" in the shared screen, now called "Photos and stats":
  - About: the executive board (08). Programs: the fall kickoff room (20). News: the student speaker (13). Get help: tacos being served (06). Donate: students eating (15). Contact: a general meeting (03). Volunteer: the volunteer handoff (31, moved from its own field).
  - They are 18rem wide, cropped to 4:3 from the top, with 12px corners like the cards, lazy loaded, and hidden below 768px (not downloaded there).
  - Accessibility, Privacy and the 404 page have none, and their header text spans the full width (one grid column; tested).
- **Home cards:** Get help (05), Volunteer (18) and Donate (22) each have a photo cropped to 3:2. The cards stretch to the same height, so the headings line up (tested at 1280px).
- **Programs and news:**
  - Mobile Food Pantry: 16.
  - UNLV Food Tasting Club: 17, so it no longer reuses the hero (01). Its extra photos are now 20 only, since 17 would otherwise appear twice on the page.
  - Volunteer Days: 31.
  - "Volunteering at Three Square": 31. Its alt text names no partner. `FACTS.md` says the photo's partner isn't confirmed, so readers might assume it's from that shift.
- **No photo twice on a page:** in either language, on any page (a test compares every image's alt text on every page).
  - **Home:** photos are placed in page order. A program or news card that would repeat a photo already higher up uses the next "Home page spare photo" instead: 07, then 23. Today that swaps the Three Square post's 31 (already on the Volunteer Days card) for 07, and Thai Night's 01 (the hero) for 23. Photos are compared by alt text, because the English and Spanish copies of a photo are separate files with the same sidecar text.
  - **About:** the header is 08, so club life is now 22, 23 and 04 (a spare) instead of 08, 22 and 23. Club life photos are cropped to 3:2 so the row is even.
- **Person cards:** no photos. The club portraits (09 to 11 and 25 to 30) have names and titles burned in. Every card shows the initials in a solid sage circle, in sand-50 DM Serif Display, centered (sand-50 on sage, 6.87:1, now a checked pair in `scripts/contrast.mjs`). The photo field was removed from People, the portrait files were deleted, and so was the example person with a photo. Cards in a row are the same height.
- **Spacing on Home:** the hero band is 3rem/4rem top and bottom (it was 5rem on desktop). Sections after the stats strip are exactly 3rem apart on phones and 4rem on wider screens, and the footer starts 3rem/4rem below the last one (the footer's top margin is now 3rem on phones everywhere). Tested. The only remaining `min-height` that could leave space is the page-level one that keeps the footer at the bottom of a short window. Measured on Home, About, Programs, News, Get help, Donate, Contact and Volunteer at 375 and 1280px, it leaves no empty space under any section, so it stays.

## Forms connected (9 November 2026)

**D59. The forms send to Aryah's Formspree form.** Aryah created the form on 9 November 2026 (approved: set it and deploy).
- **No code change.** The forms already follow Formspree's two documented ways in (D26). Without JavaScript they post straight to `https://formspree.io/f/<id>` (Formspree's "Basic HTML" guide). With JavaScript they send in the background with `fetch` and `Accept: application/json`, which is the protocol Formspree's AJAX guide and its `@formspree/ajax` library use. They already send Formspree's special fields: `_subject` (form and language) and the `_gotcha` honeypot. Only `FORMSPREE_FORM_ID` was missing.
- **Not adopted:**
  - `@formspree/ajax`: it loads a script from unpkg and manages its own error messages, which would replace the tested accessible validation, inline errors and live-region announcements.
  - `@formspree/react`: the public pages don't render with React; React is only used by the Keystatic admin.
- **Where the ID lives:** in Vercel's environment variables (Production and Preview), not in the repo, as `.env.example` and `docs/ADMIN_GUIDE.md` already said. It is not a secret (it appears in every form's `action`), but keeping it in Vercel means a new form needs no code change. The test builds still set their own value (empty for production, `template-test` for templates), and the tests intercept requests, so a test run never sends a message.
- **Checked after deploying:** the live forms post to the Formspree endpoint, and the "not connected yet" notice is gone. No test message was sent; Aryah sends one from each form (`docs/ADMIN_GUIDE.md` 4.5, step 5).

## Donations through Zeffy (9 November 2026)

**D60. Donations go through Zeffy, and the Donate page is rebuilt around it.** From the "Donations (CONFIRMED Nov 9, 2026)" section of `photos-inbox/FACTS.md`.
- **Donation link:** Site settings > Donation link is the Zeffy form (`https://www.zeffy.com/en-US/donation-form/donate-to-change-lives-28878`): one-time or monthly gifts, with Zeffy emailing each donor a tax receipt. It replaces the interim link from D53, which is gone from `src/` and `content/` in both languages, and the tests check that no page mentions or links it.
- **EIN:** `93-2889729`, in Site settings > EIN. It also feeds the home page's Organization data (`taxID`).
- **Donate page, in this order:**
  1. The header, with the introduction ("Every gift supports the work against food insecurity at UNLV and across Las Vegas.") and the page's header photo.
  2. A "Donate now" button ("Done ahora") to Zeffy, in the same tab, with "goes to an external site" for screen readers. Under it is a line on one-time and monthly gifts and Zeffy's tax receipt.
  3. "What your gift supports": one sentence naming Volunteer Days, the UNLV Food Tasting Club culture nights and the mobile food pantry planned for 2027, each linked to its program page. As `FACTS.md` says, there's nothing about how money is divided: no percentages and no "your $25 buys" lines.
  4. "Other ways to give": volunteering (linked) and, for partnerships or food and supply donations, the public email.
  5. The tax line, word for word in each language: "Creation and Connoisseur is a 501(c)(3) nonprofit, EIN 93-2889729. Donations are tax deductible to the extent allowed by law."
  - The page text (introduction and both sections) is in Pages > donate, so editors can change it. The button, its note and the tax line are part of the page's design: the tax line is built from the EIN in Site settings, so the EIN lives in one place. The test checks the order, the links, the absence of amounts and the exact tax line.
- **Footer:** the tax line's first sentence, in each language, sits under the nonprofit description. It replaces the old "EIN: …" line, so the EIN isn't shown twice.
- **Header:** the Donate button still goes to the site's Donate page, not straight to Zeffy (tested).
- **Privacy policy:** a new "Donations" section. Zeffy processes donations and receives the donor's name, email address and payment details under its own privacy policy. We receive the donor's name, email address and the amount of the gift, to thank them and keep records. The "last updated" date was already 9 November 2026, today.
- **Long email addresses wrap:** with the WCAG 1.4.12 text spacing, `info@creationandconnoisseur.org` overflowed the Donate page's list at 375px, and Get help and Contact at 320px. Every `mailto:` link now uses `overflow-wrap: anywhere`, and those pages have no overflow at 320px with the spacing applied.
- **Not checked:** Zeffy answers automated requests with a bot challenge (HTTP 403). So the link checker reports the Zeffy link as a warning, not a failure (external links are warnings, D21), and it couldn't confirm whether Zeffy has a Spanish version of the form or the address of its privacy policy. The privacy section names the policy without linking to it.

**D61. The Zeffy privacy policy is linked, and every external link in page text gets a screen-reader note.** Aryah's instruction of 9 November 2026.
- **Privacy page:** in the Donations section, Zeffy's policy now links to `https://support.zeffy.com/legal-data-privacy-security` (it redirects to Zeffy's "Legal, Data Privacy & Security" help page, which loads). That page is offered in English, German and French but not Spanish, so the Spanish link is followed by "(en inglés)", as elsewhere on Spanish pages (D38). This replaces D60's note that the policy address couldn't be confirmed.
- **The screen-reader note:** the link carries the site's existing external-link text, `donate.leavesSite` ("(goes to an external site)" / "(lo lleva a un sitio externo)"), visually hidden.
  - The privacy text is Markdown edited in Keystatic, and Keystatic's editor shows raw HTML as literal text. So a hand-typed `<span>` would confuse editors and could be mangled on save.
  - Instead, a small plugin for Astro's Markdown processor (`src/lib/external-link-note.ts`) adds the note at build time to every absolute http(s) link in page text, in the page's language (from the content file's folder). Editors write ordinary links.
  - This marks all external links in page text, not only Zeffy's: Formspree and Vercel on the privacy page, and the four Get Help resources. That's consistent with the Donate button. Links within the site and email links are untouched, and so are the links built by components (footer social links, the Donate button), which have their own text.
  - A test checks every external link in page text on every page.
- **Dependency:** Astro 7's default Markdown processor, Sätteri, takes plugins through `markdown.processor: satteri({ hastPlugins })`. Astro doesn't re-export `satteri()`, so `@astrojs/markdown-satteri` is now a direct dependency, pinned to 0.4.6, the exact version Astro 7.4.4 already installs. So no new code was downloaded, and the rendering defaults (GFM, smart punctuation) are unchanged. When Astro is upgraded, move this pin to the version Astro uses.
- **Spanish Donate form:** Zeffy has no Spanish version of the donation form (Aryah checked: the es-ES address returns 404), so both languages keep the en-US link, and `docs/OPEN_ITEMS.md` item 8 is closed.

**D62. Page header photos load eagerly; the volunteering photo moves to the Three Square post.** Aryah's instruction of 9 November 2026.
- **Header photos:** they sit above the fold, so `PageHeader` now loads them with `loading="eager"` and `decoding="async"` instead of lazily. The image has a sand background, so its 4:3 frame shows sand, never an empty white box, while the photo arrives. They are still hidden below 768px. Since they are no longer lazy, phones also download the small 288px version they don't show. The Lighthouse budgets still pass on Lighthouse's mobile run. Only the Home photo has `fetchpriority="high"`; every other image is still lazy (tested, with the header photo marked `data-header-photo`).
- **Photos:**
  - "Volunteering at Three Square": 31, the volunteer handoff. The post's own image already was 31, but on Home it was swapped for spare 07 because the Volunteer Days card showed 31 higher up. With Volunteer Days on 18, it no longer repeats, so Home shows 31 on the post too.
  - Volunteer Days (card and program page, both languages): 18, the culture-night serving photo. This departs from `FACTS.md`'s note that 31 goes on Volunteer Days; Aryah's instruction is newer.
  - Home Volunteer card: 06, tacos being served (it was 18). Photo 06 is also the Get help header, a different page.
  - All alt text is the sidecar's, word for word.
- **Spare photos:** spare 07, the fall kickoff game, is removed, so the rule that put it on the Three Square post is gone. The duplicate check itself stays, because Thai Night's news photo (01) is the Home photo. On Home, that card uses the one remaining spare, 23 (Smash and Slice), which isn't used elsewhere on Home. The test that compares every image's alt text on every page confirms no photo appears twice on Home in English or Spanish, and a new test checks the three placements above.

**D63. The Thai Night card on Home shows a Thai Night photo.** Aryah's instruction of 9 November 2026.
- **Home Get help card:** 23, the Smash and Slice outing (it was 05).
- **Thai Night news card on Home:** 05, the Thai Night plate and Thai tea, so the card shows a Thai Night photo instead of the pizza outing. The post's own image is still 01, which is also the main Home photo, so on Home the duplicate check swaps it for the spare. The one spare is now 05 (it was 23), so that swap lands on a Thai Night photo. The Thai Night post page is unchanged: 01 at the top, 05 in its gallery.
- The two image files traded places. Both were already optimized copies in the repo, so no new image came from `photos-inbox/`. All alt text is the sidecar's, word for word.
- The test that compares every image's alt text on every page confirms no photo appears twice on Home in English or Spanish, and the Home placement test now also checks the Get help card and the Thai Night card.
