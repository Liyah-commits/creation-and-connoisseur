# Creation and Connoisseur website: build plan

Written 6 November 2026, before any code, as Phase 0 of the rebuild.

## 1. Discovery result: there is no existing site

A search on 6 November 2026 found no existing Creation and Connoisseur repo, site export, or content folder. This is a blank-scaffold build. What was searched:

| Where | Result |
|---|---|
| The working directory when the work began (an unrelated project) | Nothing about Creation and Connoisseur. |
| Every other folder in `~/Documents` (all unrelated projects) | Nothing. |
| `~/Desktop`, `~/Downloads`, `~/Sites`, `~/IdeaProjects`, `~/Public`, `~/Pictures` (file names containing connoisseur, creation, candc, pantry, food insecurity; four levels deep) | Nothing relevant. One file name matched a search term but is unrelated. |
| GitHub account `Liyah-commits` (`gh repo list`) | No repository for Creation and Connoisseur. |
| Public web search: "Creation and Connoisseur" with UNLV, nonprofit, food insecurity, Las Vegas | No site or listing for the organization. |

Because nothing exists:

- `docs/CONTENT_INVENTORY.md` records the empty inventory and the method, so the same process can be repeated if old material turns up.
- `docs/REDIRECTS.md` records that there are no old URLs to redirect, and how to add one (in `astro.config.mjs`, which the Vercel adapter turns into a 301; see D23).

## 2. Facts about the organization

The brief is the only source. These are the only organization facts the site may state:

1. The name is Creation and Connoisseur.
2. It is a 501(c)(3) nonprofit.
3. It focuses on food insecurity at UNLV.
4. It is owned and run by Aryah Certain.

Superseded on 6 November 2026: Aryah's content batch now supplies most of the remaining organization text (D38 in `docs/DECISIONS.md`).

Everything else the site needs is a numbered entry in `docs/OPEN_ITEMS.md`. Each such field ships empty, and the template hides an empty section instead of showing filler. No mission wording, program, date, location, schedule, person, logo, photo, donation link, social link or EIN has been made up.

## 3. Stack

As briefed, with one ruled change:

- Astro 7 with TypeScript, Tailwind CSS 4, Keystatic (GitHub mode in production, local mode in development) with the admin at `/keystatic`.
- Astro i18n routing: English at `/`, Spanish at `/es/`.
- Vercel (`@astrojs/vercel`) for hosting. The Keystatic admin and its API run as Vercel functions, and every public page is prerendered static HTML.
- **Node 24 LTS, not Node 20.** Ruled by Aryah on 6 November 2026. Node 20 has been end of life since 30 April 2026, Vercel stopped building Node 20 projects on 1 October 2026, and the current releases of the toolchain need Node 22 or newer. See D1 in `docs/DECISIONS.md`.
- pnpm, pinned through the `packageManager` field.
- The repo is local (`~/Documents/creation-and-connoisseur`) until Aryah creates the GitHub remote. Ruled on 6 November 2026: nothing is pushed or deployed from this session.

## 4. Site map (both languages)

| Page | English | Spanish |
|---|---|---|
| Home | `/` | `/es/` |
| About (mission, story, people) | `/about/` | `/es/acerca-de/` |
| Programs (list) | `/programs/` | `/es/programas/` |
| Program (template) | `/programs/<slug>/` | `/es/programas/<slug>/` |
| Get Help | `/get-help/` | `/es/obtener-ayuda/` |
| Volunteer (form) | `/volunteer/` | `/es/voluntariado/` |
| Donate | `/donate/` | `/es/donar/` |
| News (list) | `/news/` | `/es/noticias/` |
| News post (template) | `/news/<slug>/` | `/es/noticias/<slug>/` |
| Contact (form) | `/contact/` | `/es/contacto/` |
| Accessibility statement | `/accessibility/` | `/es/accesibilidad/` |
| Privacy policy | `/privacy/` | `/es/privacidad/` |
| Not found | `/404.html` (one bilingual page) | |

The header has a skip link, the wordmark, the main navigation (a disclosure menu on small screens), a language toggle that goes to the same page in the other language, and a visible Donate button. The footer has contact, social links, the EIN line, and links to the accessibility statement and privacy policy.

## 5. Content model (Keystatic)

- **Pages**: one collection per language (`content/en/pages`, `content/es/pages`). Each entry holds a title, meta description, intro and body for one fixed page. A build check fails loudly if a required page is missing.
- **Programs** and **News posts**: one collection per language. A Spanish entry names its English counterpart, which is how the language toggle finds the matching page.
- **People**: one shared collection, with the name and photo once and the role, bio and photo alt text in both languages.
- **Site settings**: one YAML singleton for organization facts (legal name, EIN, email, phone, address, donation link, social links, mission in both languages). These are the fields `OPEN_ITEMS.md` asks Aryah to supply.
- Images use a required alt-text field that the editor cannot skip once an image is added.
- Body headings are limited to levels 2 and 3, so editors can't break the one-h1 rule or the heading order.
- Interface strings (buttons, labels, error messages) live in a typed dictionary in `src/i18n/ui.ts`. The build fails if any English key lacks a Spanish string.

## 6. Accessibility approach

The target is WCAG 2.1 AA on every template, plus the WCAG 2.2 AA additions that cost nothing: focus not obscured (no sticky header), targets at least 24 by 24 CSS pixels, no dragging. No overlay of any kind.

Automated gates, all run locally before every commit and in GitHub Actions on every pull request:

1. `@axe-core/playwright` on every built page in both languages, at a phone width and a desktop width, with the WCAG 2.0/2.1/2.2 A and AA tags plus axe best practices. It also scans the forms in their error state and the mobile menu open. The pass condition is zero violations.
2. Playwright behavior tests: the skip link is the first focusable element, the language toggle keeps the page, the mobile menu works by keyboard and Escape, focus moves to the first form error, the success message sits in a live region, and no page scrolls horizontally at 320 CSS pixels (the 400% / 200% reflow case).
3. pa11y-ci with both the axe and HTML_CodeSniffer runners at WCAG2AA, against every built page.
4. Lighthouse CI on every built page: accessibility, performance and best practices at least 95, SEO 100.
5. linkinator broken-link check across the built site.
6. A contrast script that computes every color pair the site uses and fails below 4.5:1 for text or 3:1 for focus indicators and large text.

Two builds are tested. The **production build** contains only real content, which is what ships, and it exercises the empty states. The **template build** adds clearly labeled draft example entries (one program and one news post per language). Without them the program and post templates would go untested, because no real programs or posts exist yet. Drafts never appear in the production build.

## 7. Phases and commits

| Phase | Work | Commit gate |
|---|---|---|
| 0 | Discovery, this plan, decisions, inventory, redirects, open items | Docs only, no code to test |
| 1 | Scaffold, design tokens, layout, i18n routing, Keystatic config, test harness and CI workflow | Full suite green |
| 2 | Every page and template in both languages, forms, SEO, structured data, sitemap | Full suite green |
| 3 | Fix every finding; contrast table; broken-link check | Full suite green |
| 4 | Accessibility test report, editor guide, admin guide, Spanish review list, final open items | Full suite green |

## 8. Out of scope

- A payment processor. The Donate page links out to a donation URL once one exists.
- Analytics and cookies. None are added; the privacy policy says so.
- The Keystatic admin's own interface, which is third-party code. Testing covers every public page. The admin is noted as outside the conformance claim.
- Deploying or pushing, per the ruling above. `docs/ADMIN_GUIDE.md` gives the exact steps.

## 9. Phase 2 design (carried over from the Phase 0 handoff)

Decided before Phase 1 and recorded in `docs/DECISIONS.md` as each part is built.

**Forms (Volunteer and Contact).**
- One `FORMSPREE_FORM_ID` for both forms, told apart by `_subject` (and by language). Read through `astro:env` (server, public, optional).
- `novalidate` plus custom JavaScript: visible labels with "(required)" in text, `aria-invalid`, inline errors linked with `aria-describedby`, focus moved to the first invalid field, and a `role="status"` live region present in the page from the start for the success message.
- Progressive enhancement: without JavaScript the form posts to Formspree directly. A `_gotcha` honeypot hidden with `display:none`. `autocomplete` tokens on personal fields (WCAG 1.3.5).
- Formspree ID not set: the form renders fully with a plain-text notice that it isn't connected yet. On a valid submit, the live region says nothing was sent because the form isn't connected.

**Program and news templates.** One page per entry in each language (`/programs/<slug>/`, `/es/programas/<slug>/`, `/news/<slug>/`, `/es/noticias/<slug>/`), with the language switch paired through the "English version" field. One clearly labeled example program and one example news post per language, saved as drafts, so the template build can test the templates.

**Tests to add with them.** axe on both forms in their error and success states, at both widths; behavior tests for focus moving to the first error, the error text being linked by `aria-describedby`, the live region announcing success, the not-connected message, and the language switch on paired and unpaired entries.

**Phase 4 documents.** `docs/ACCESSIBILITY_TEST_REPORT.md`, `docs/EDITOR_GUIDE.md`, `docs/ADMIN_GUIDE.md`, `docs/SPANISH_REVIEW.md` and the final `docs/OPEN_ITEMS.md`, in the structures the brief gives (`docs/BRIEF.md`).
