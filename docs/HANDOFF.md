# Handoff: Phase 0 done, start Phase 1

Written 6 November 2026 by the session that ran Phase 0. That session started inside another, unrelated project, whose project-level commit hook blocked every git commit, this repo included. Aryah ruled to relaunch Claude Code from this folder, where that hook doesn't load (D8). Delete this file once Phase 1 is committed.

## First actions for the new session

1. Read `docs/BRIEF.md` (the full brief), `docs/PLAN.md`, `docs/DECISIONS.md`, then this file.
2. **Commit Phase 0 first.** Nothing is committed yet; `git init -b main` has been run. Stage `docs/` and commit with the message: `Phase 0: discovery, plan and decisions`. No Co-Authored-By or other trailer: Aryah's standing rule is that tool attribution doesn't go into git history. The git identity is the global one (`Liyah-commits`).
3. Use Node 24 (`source ~/.nvm/nvm.sh && nvm use 24`; 24.22.0 is installed and is the nvm default). Node 20 was also installed during discovery but is not used (D1).
4. Then build Phase 1 as planned below.

## Rulings so far

- **D1:** Node 24 LTS, not Node 20.
- **D2:** No GitHub repo creation, push or Vercel deploy from the build session. Commit locally only, and give Aryah the commands at the end.
- **D8:** Relaunch from this folder so phase commits work.

## Facts

There is no existing site (`docs/PLAN.md`, section 1). Only four organization facts may appear on the site: the name, the 501(c)(3) status, the focus on food insecurity at UNLV, and that Aryah Certain owns and runs the organization.

Do not state anything else as fact. That includes mission wording, programs, a job title for Aryah, eligibility rules, response times, the founding year, and UNLV affiliation or endorsement. Avoid implying the university endorses the organization, and don't use UNLV marks.

## Versions checked on 6 November 2026 (all run on Node 24)

| Package | Version |
|---|---|
| astro | 7.4.x |
| @astrojs/vercel | 11.0.x |
| @astrojs/react | 7.1.x (peer `oxc-transform-react`) |
| @keystatic/core | 0.6.9 |
| @keystatic/astro | 6.0.0 (peer astro 5, 6 or 7) |
| tailwindcss / @tailwindcss/vite | 4.3.x |
| @playwright/test | 1.65 |
| @axe-core/playwright | 4.14 |
| pa11y-ci | 5.0 (pa11y 10, puppeteer 25) |
| @lhci/cli | 0.16 (lighthouse 13.6) |
| linkinator | 8.1 |
| typescript | 5.9.3 (`@astrojs/check` 0.9.12 needs ^5 or ^6) |
| pnpm | 10.34.x, through corepack and the `packageManager` field |

Set `minimumReleaseAge: 10080` in `pnpm-workspace.yaml` (D7). Add dependencies by range so pnpm can pick the newest version older than 7 days. Pinning a version released yesterday (astro 7.4.7 came out on 5 November) would fail.

pnpm 10 blocks dependency build scripts. Allow only what's needed (`onlyBuiltDependencies`: probably esbuild and sharp). Don't let puppeteer download its own Chrome: point pa11y and Lighthouse at Playwright's Chromium (`chromium.executablePath()` from `playwright`), so there's one browser download locally and in CI.

## Phase 1 design already decided (record each in DECISIONS.md as you build it)

**Routes.** Spanish pages get Spanish slugs, through a typed route table in `src/i18n/routes.ts`. The language toggle uses that table. Thin page files in `src/pages/` and `src/pages/es/` render shared views from `src/views/`.

| Key | English | Spanish |
|---|---|---|
| home | `/` | `/es/` |
| about | `/about/` | `/es/acerca-de/` |
| programs | `/programs/` | `/es/programas/` |
| getHelp | `/get-help/` | `/es/obtener-ayuda/` |
| volunteer | `/volunteer/` | `/es/voluntariado/` |
| donate | `/donate/` | `/es/donar/` |
| news | `/news/` | `/es/noticias/` |
| contact | `/contact/` | `/es/contacto/` |
| accessibility | `/accessibility/` | `/es/accesibilidad/` |
| privacy | `/privacy/` | `/es/privacidad/` |

Details: `trailingSlash: 'always'`. Astro `i18n` is set with `defaultLocale: 'en'`, `locales: ['en','es']`, `prefixDefaultLocale: false`. There is one bilingual `404.astro`, with the Spanish half marked `lang="es"`.

**Content model (Keystatic, content in `content/`).**
- `pagesEn` and `pagesEs` are collections at `content/{en,es}/pages/*`. The slug is an "internal name" field with help text: do not change, the site finds the page by it. The other fields are title, meta description, intro, and body. A build guard fails loudly if a required page entry is missing. (The brief asks for collections, so they are not singletons.)
- `programsEn`/`programsEs` and `newsEn`/`newsEs` are per-language collections. A Spanish entry has an "English version" relationship field, which is how the toggle pairs entries. If an entry has no pair, the toggle goes to the other language's list page.
- `people` is one shared YAML collection: name, role and bio in both languages, a photo, photo alt text in both languages, and order.
- `settings` is a YAML singleton at `content/settings.yaml` with the legal name, EIN, email, phone, mailing address, donation URL, social links (label and URL), mission in both languages, and a short description in both languages. Only the short description is filled, from the four facts.
- Body fields: `fields.markdoc({ extension: 'md', options: { heading: [2, 3], image: false } })`. Verify the `extension` option against the installed `@keystatic/core` types.
- Images: `fields.conditional(fields.checkbox('Add an image'), { true: fields.object({ image: fields.image({ validation: { isRequired: true } }), alt: fields.text({ validation: { length: { min: 1 } } }) }), false: fields.empty() })`. The editor can't save an image without alt text. Image files live under `content/images/<collection>/` with relative `publicPath`, so Astro `image()` optimizes them.
- Drafts: a "Hide from the live site" checkbox. The production build excludes drafts. `SHOW_DRAFTS=true` includes them in the template-test build. Write one clearly labeled example program and one example news post per language as drafts. Without them the program and post templates have nothing to render or test.
- Storage: local in development, GitHub in production, with the repo from `PUBLIC_KEYSTATIC_GITHUB_REPO` (`owner/name`). Use `ui.navigation` groups: English, Español, Shared. Help text in plain language on every field.
- Interface strings go in a typed dictionary, `src/i18n/ui.ts`, with a type check that every key has `en` and `es`.

**Site URL.** Resolve in order: `SITE_URL`, then `https://` + `VERCEL_PROJECT_PRODUCTION_URL`, then `http://localhost:4321`. Never a guessed domain. Test builds set `SITE_URL=http://localhost:4321` so Lighthouse's canonical check sees a matching origin.

**SEO.**
- A custom sitemap endpoint with `xhtml:link` hreflang alternates built from the route table. `@astrojs/sitemap` can't pair translated slugs.
- A `robots.txt` endpoint.
- Canonical tags, hreflang en/es/x-default, Open Graph with `og:locale` set to `en_US` or `es_US`.
- JSON-LD `@type: ["Organization","NGO"]` with `nonprofitStatus: Nonprofit501c3`, and `taxID`, `email` and `sameAs` only when supplied.
- A typographic OG image and favicon (the name as a wordmark, no invented logo).

**Forms.**
- One `FORMSPREE_FORM_ID` for both forms, distinguished by `_subject`. Read it via `astro:env` (server, public, optional).
- `novalidate` plus custom JS: visible labels with "(required)" in text, `aria-invalid`, inline errors linked with `aria-describedby`, focus on the first invalid field, and a pre-rendered `role="status"` live region for success.
- Progressive enhancement: without JS the form posts to Formspree directly. A `_gotcha` honeypot uses `display:none`. Use `autocomplete` tokens (WCAG 1.3.5).
- Unset ID: show the plain-text notice. On a valid submit, announce that nothing was sent because the form isn't connected yet.

**Donate.** The header Donate button links to the Donate page. The page shows a button labeled "Donation link coming soon" with `aria-disabled="true"`, so it stays focusable and screen readers announce it as unavailable. It becomes a real link once `donationUrl` is set.

**Accessibility choices.**
- No sticky header (WCAG 2.4.11).
- Targets at least 24px; nav and buttons 44px.
- Links underlined everywhere.
- Focus: an outline with offset, a blue ring on light surfaces and a saffron ring on the dark footer. Compute the ratios.
- Motion only behind `prefers-reduced-motion: no-preference`.
- The mobile menu is a disclosure (`aria-expanded`, `aria-controls`, Escape closes and returns focus, no trap) and progressively enhanced: the nav is visible without JS.
- Placeholder: a CSS pattern, `aria-hidden`; people without photos get a decorative initials block.

**Palette candidates.** Compute the ratios with a script before using them. Restrict Tailwind to these tokens (`@theme { --color-*: initial; ... }`) so the contrast table is complete.

| Token | Hex |
|---|---|
| cream (page) | `#FFF8EE` |
| white (card) | `#FFFFFF` |
| ink | `#2B1D16` |
| ink-muted | `#5E4A3E` |
| tomato (button) | `#B23A1E` |
| tomato-dark | `#8F2C14` |
| herb | `#2E5E3E` |
| saffron | `#F2B544` |
| focus blue | `#1A4FBF` |

**Fonts.** System sans for body text; a system serif stack (Georgia and similar) for headings.

**Spanish.** Neutral US Latin American Spanish in the "tú" register throughout. Record it and flag it for the reviewer in `SPANISH_REVIEW.md`.

**Testing (two builds).** The production build ships. The template build (`SHOW_DRAFTS=true`) adds the example entries.
- Serve `.vercel/output/static` with a small Node static server (`scripts/serve-static.mjs`). It maps `/x/` to `/x/index.html` and returns `404.html` with status 404. `astro preview` doesn't work with the Vercel adapter.
- Playwright: axe (tags wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice) on every page from the sitemap, at 375px and 1280px, plus the mobile menu open and the forms in error and success states. Behavior tests for the skip link, toggle mapping, menu keyboard handling, form focus and the live region. Reflow at 320px on every page (`scrollWidth <= clientWidth`).
- pa11y-ci: runners axe and htmlcs, standard WCAG2AA, with a URL list generated from the build. Check whether pa11y-ci 5 accepts a JS config.
- Lighthouse CI: every page, one run each, Playwright's Chromium via `chromePath`. Assertions: accessibility, performance and best-practices ≥ 0.95, SEO = 1.
- linkinator on the served build.
- Contrast script.
- GitHub Actions on `pull_request` and pushes to `main`, as a matrix over the two builds, Node 24, `pnpm/action-setup`, `playwright install --with-deps chromium`.

**Open items to list** (each as a numbered entry in `docs/OPEN_ITEMS.md`):
- the official mission statement;
- the story for the About page;
- Aryah's title, bio and photo;
- board and other people;
- the EIN;
- the exact legal name;
- the mailing address, public email and phone;
- the donation URL and other ways to give;
- social links;
- programs (names, descriptions, schedules, locations);
- Get Help details (where, when, how, what to bring, response time, in plain language);
- whether to list community resources (campus pantry, Nevada 2-1-1);
- volunteer roles;
- how to describe the relationship to UNLV;
- the `FORMSPREE_FORM_ID` and its recipient;
- logo files and brand colors;
- every needed photo;
- the production domain (`SITE_URL`);
- the GitHub repo and Keystatic GitHub App;
- privacy policy review (retention, who sees submissions, a privacy contact, legal review);
- the accessibility feedback contact and response time;
- a Spanish reviewer and their sign-off;
- Aryah's manual accessibility passes;
- confirmation of the "tú" register;
- any existing news posts;
- the founding year (optional, for structured data).
