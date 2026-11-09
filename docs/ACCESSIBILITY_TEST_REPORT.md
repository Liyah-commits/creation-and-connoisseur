# Accessibility test report

## 1. Site and date

| | |
|---|---|
| **Site** | Creation and Connoisseur website (English and Spanish) |
| **Build tested** | Local production and template builds of this repository, served from `.vercel/output/static` by `scripts/serve-static.mjs` at `http://localhost:4321` |
| **Date of automated testing** | 6 November 2026; run again the same day after the content batch and the switch to usted (decisions D25 and D38 to D42). Run again on 7 November 2026 after the programs and Aryah's bio were published (D44); the numbers below are from that run. |
| **Tested by** | Automated suite set up during the rebuild. Manual passes: Aryah Certain (section 8, not yet run) |
| **Conformance status** | **Automated testing: zero violations.** A WCAG 2.1 AA conformance claim should be made only after the manual passes in section 8 are complete. |

## 2. Standard tested

**WCAG 2.1 Level AA** (all Level A and AA success criteria). Three WCAG 2.2 AA additions were also applied because they cost nothing: 2.4.11 Focus Not Obscured (Minimum), 2.5.7 Dragging Movements and 2.5.8 Target Size (Minimum) (section 6.2).

No accessibility overlay, widget or plug-in is used.

## 3. Pages and templates covered

Every page is tested in both languages. The page list is read from the built `sitemap.xml`, so a new page is tested automatically.

**Production build** (real content only, 26 pages, 13 per language). This is what ships: the 10 fixed pages and the 3 published programs in each language. It also tests the states that are still empty: no news posts, no EIN, contact details or social links, and Donate unavailable.

| Page | English | Spanish |
|---|---|---|
| Home | `/` | `/es/` |
| About | `/about/` | `/es/acerca-de/` |
| Programs (list) | `/programs/` | `/es/programas/` |
| Get Help | `/get-help/` | `/es/obtener-ayuda/` |
| Volunteer (form) | `/volunteer/` | `/es/voluntariado/` |
| Donate | `/donate/` | `/es/donar/` |
| News (list) | `/news/` | `/es/noticias/` |
| Contact (form) | `/contact/` | `/es/contacto/` |
| Accessibility statement | `/accessibility/` | `/es/accesibilidad/` |
| Privacy policy | `/privacy/` | `/es/privacidad/` |
| Not found (bilingual) | any unknown address (`404.html`) | |

**Template build** (`SHOW_DRAFTS=true`, 31 pages, 15 of them Spanish). It adds the draft entries, so the remaining templates are tested before anything is published: the labeled examples (decision D28), plus the published programs and Aryah's People entry:

| Template | Pages |
|---|---|
| Program page | `/programs/example-program/` (with image), `/es/programas/programa-de-ejemplo/` (without image), and the three published programs in each language (UNLV Food Tasting Club, Volunteer Days, Mobile Food Pantry) |
| News post page | `/news/example-news-post/`, `/es/noticias/noticia-de-ejemplo/` (paired), `/news/example-post-without-translation/` (no translation) |
| Lists with entries, home page with programs and news | `/programs/`, `/news/`, `/`, and the Spanish equivalents |
| People (About) | the published people and one example person; every card shows initials in a sage circle (D58) |
| Filled-in settings | fake EIN, contact details, social link, mission and a working Donate link (`tests/fixtures/settings.template.yaml`) |
| Forms, connected | Formspree success and failure states, with the request intercepted in the test browser |

**Interactive states tested:** mobile menu open; all three forms (Contact, Volunteer, Get Help) in their error state and after a valid submit, in both languages and at both widths; the not-connected form notice; the unavailable Donate button.

**Out of scope:** the Keystatic editing screens at `/keystatic` (third-party software used only by editors; the accessibility statement says so), Formspree's own pages, and the external donation site once one is linked.

## 4. Tools and versions

| Tool | Version | Used for |
|---|---|---|
| Node.js | 24.22.0 | Runtime |
| Astro | 7.4.4 | Site build |
| Playwright (`@playwright/test`) | 1.64.1 | Browser tests |
| Chromium (Chrome for Testing, via Playwright) | 156.0.8078.4 | The one browser for Playwright, pa11y and Lighthouse |
| `@axe-core/playwright` / axe-core | 4.14.0 / 4.14.0 | axe on every page and state. Tags: `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`, `best-practice` |
| pa11y-ci / pa11y | 5.0.0 / 10.0.0 | Second automated engine, standard `WCAG2AA` |
| axe-core (inside pa11y) | 4.13.0 | pa11y runner 1 |
| HTML_CodeSniffer (`@pa11y/html_codesniffer`) | 2.6.0 | pa11y runner 2 |
| Lighthouse CI (`@lhci/cli`) / Lighthouse | 0.15.1 / 12.6.1 | Accessibility, performance, best-practices and SEO scores, default mobile emulation and throttling |
| linkinator | 8.1.0 | Broken-link check |
| `scripts/contrast.mjs` | in this repo | WCAG contrast ratio of every color pair the site uses |
| TypeScript / `@astrojs/check` | 5.9.3 / 0.9.12 | Type check, including that every interface string exists in both languages |

All of these run in GitHub Actions on every pull request and every push to `main` (`.github/workflows/ci.yml`), once per build.

## 5. Automated results

### 5.1 Summary

| Check | Production build | Template build | Pass condition | Result |
|---|---|---|---|---|
| axe scans (pages × 2 widths, menu open, 404, form states) | 79 scans | 89 scans | 0 violations | **0 violations** |
| Playwright tests (axe, structure, keyboard, forms, content) | 241 passed, 0 failed | 283 passed, 0 failed | all pass | **Pass** |
| pa11y-ci (axe + HTML_CodeSniffer, WCAG2AA) | 26/26 pages, 0 errors | 31/31 pages, 0 errors | 0 errors | **Pass** |
| Lighthouse accessibility | 100 on every page | 100 on every page | ≥ 95 | **Pass** |
| Lighthouse performance | 100 on every page | 100 on every page | ≥ 95 | **Pass** |
| Lighthouse best practices | 100 on every page | 100 on every page | ≥ 95 | **Pass** |
| Lighthouse SEO | 100 on every page | 100 on every page | 100 | **Pass** |
| Broken links, internal (fragments checked, redirects count as broken) | 32 checked, 0 broken | 57 checked, 0 broken | 0 broken | **Pass** |
| Broken links, external | 6 checked, 0 failed | 6 checked, 0 failed | reported | **Pass** |
| Contrast pairs | 20 of 20 pass | same tokens | all pass | **Pass** |
| Type check | 0 errors | | 0 errors | **Pass** |

Skipped tests are the ones that only apply to the other build: 11 template-only tests skipped in the production build, 4 production-only tests skipped in the template build.

Run it again with `pnpm test:all`. Detailed output goes to `reports/production/` and `reports/templates/`: `playwright.json`, `pa11y.json`, `links.json` and `lighthouse/` (one HTML and JSON report per page).

### 5.2 What the Playwright tests check on every page, in both languages

- axe: zero violations at 375px and 1280px wide.
- `html lang` matches the language of the address.
- Exactly one h1, and no skipped heading levels.
- One `header`, `nav`, `main` and `footer` landmark.
- The skip link is the first Tab stop, is visible when focused, and moves focus to `main`.
- No horizontal scrolling at 320 CSS px (WCAG 1.4.10; the same as 1280px at 400% zoom).
- Text spacing at the WCAG 1.4.12 values loses no content at 375px and 1280px.
- Text resized to 200% causes no horizontal scrolling (WCAG 1.4.4).
- Canonical link, meta description and `og:locale` are present and correct.
- Every page's title and meta description is unique.

And across the site:

- The language switch on all 10 fixed pages goes to the same page in the other language, is marked with `lang` and `hreflang`, and works by keyboard. hreflang alternates (en, es, x-default) are correct. Paired entries switch to each other; an entry with no translation switches to the list page and claims no alternate.
- Mobile menu: `aria-expanded` and `aria-controls`; Enter and Space toggle it; Escape closes it and returns focus to the button; Tab can leave it (no trap); the links are visible without JavaScript; there's no menu button on desktop.
- Full keyboard walk of four representative pages at both widths: every stop has an outline at least 2px wide, in the correct color, is scrolled into view, and is not covered by other content.
- Buttons, navigation links and the language switch are at least 44px tall.
- Reduced motion: no transitions run.
- The 404 page returns status 404, is bilingual and is `noindex`.
- The three forms (Contact, Volunteer, Get Help), in both languages: visible labels; "(required)" and "(optional)" in text; `autocomplete` tokens; the live region is present and empty on load; the honeypot is hidden. Submitting empty marks every required field `aria-invalid`, shows "Error: …" text linked by `aria-describedby`, and moves focus to the first one. An invalid email gets its own message, and errors clear when fixed. A valid submit is announced in the live region (success when connected; "nothing was sent" when not, with no request made). A failed send is announced and keeps what was typed. Without JavaScript the form uses native validation and a real POST.
- Content states: drafts are absent from the production build and return 404. Empty facts render nothing. The unavailable Donate button is focusable, explained by `aria-describedby`, and does nothing when activated. In the template build, the filled-in settings (EIN, contact details, social links, Donate link) appear.

### 5.3 Contrast ratios

Computed by `scripts/contrast.mjs` from the color tokens in `src/styles/global.css` (the only colors Tailwind is allowed to use). Text needs 4.5:1 (no text on the site relies on the large-text 3:1 allowance). Focus indicators and other non-text elements need 3:1.

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

Updated 9 November 2026 for the "desert table" palette (D55). Coral is used for text only as white-on-coral in the Donate button, never on sand or sandstone. Sandstone is decoration only, and ink-muted never sits on it.

### 5.4 Broken-link check

linkinator started from every sitemap page and followed every same-site link, checking `#fragment` targets and treating any redirect as broken (so a link missing its trailing slash would fail). On 7 November 2026: production build, 32 internal links, 0 broken; template build, 57 internal links, 0 broken. All six external links returned 200: the four Get Help resources (Nevada 211, Three Square, the UNLV food pantry and Access Nevada; addresses in `docs/OPEN_ITEMS.md`, item 14) and Formspree's and Vercel's privacy policies. `example.org` links exist only in the template build's fake settings and are skipped.

## 6. WCAG 2.1 Level A and AA success criteria

**Method:** *Automated* means checked by the tools in section 4 on every page in both languages, including tests written for this site. *Manual* means human review: design and content review during the build, and the passes in section 8. **Result:** "Pass (automated)" means every automated check passes; "manual pending" marks where the human passes in section 8 must still confirm it.

### 6.1 WCAG 2.1

| Criterion | Level | Method | Result | Notes |
|---|---|---|---|---|
| 1.1.1 Non-text Content | A | Both | Pass (automated); manual pending | axe and HTML_CodeSniffer image rules pass. Decorative patterns, initials blocks and icons are `aria-hidden`. The CMS can't save an image without a description (tested end to end, D31). The screen reader passes judge description quality. |
| 1.2.1 Audio-only and Video-only (Prerecorded) | A | Manual | Not applicable | No audio or video. |
| 1.2.2 Captions (Prerecorded) | A | Manual | Not applicable | No video. |
| 1.2.3 Audio Description or Media Alternative (Prerecorded) | A | Manual | Not applicable | No video. |
| 1.2.4 Captions (Live) | AA | Manual | Not applicable | No live media. |
| 1.2.5 Audio Description (Prerecorded) | AA | Manual | Not applicable | No video. |
| 1.3.1 Info and Relationships | A | Both | Pass (automated); manual pending | Landmarks, one h1 and ordered headings (tested on every page), lists, description lists, labels tied to fields, hints and errors tied by `aria-describedby` (tested). Editors can only use heading levels 2 and 3. |
| 1.3.2 Meaningful Sequence | A | Both | Pass (automated); manual pending | Source order matches visual order at both widths; the keyboard walk follows it. |
| 1.3.3 Sensory Characteristics | A | Manual | Pass | No instruction relies on shape, color, size, position or sound (copy reviewed). |
| 1.3.4 Orientation | AA | Both | Pass | No orientation lock. Tested at portrait phone (375 × 812) and landscape desktop sizes. |
| 1.3.5 Identify Input Purpose | AA | Automated | Pass | `autocomplete="name"`, `"email"` and `"tel"` (tested); axe `autocomplete-valid`. |
| 1.4.1 Use of Color | A | Both | Pass (automated); color-blindness simulation pending | Links are always underlined. The current page has a thicker underline and `aria-current`. Errors begin with "Error:". Required fields say "(required)". axe `link-in-text-block` passes. |
| 1.4.2 Audio Control | A | Manual | Not applicable | No audio. |
| 1.4.3 Contrast (Minimum) | AA | Automated | Pass | 11 text pairs, lowest 5.97:1 (section 5.3). axe and HTML_CodeSniffer contrast checks pass on every page and state. |
| 1.4.4 Resize Text | AA | Both | Pass (automated); browser zoom pending | Root text doubled on every page: no horizontal scrolling. Sizes are in rem. |
| 1.4.5 Images of Text | AA | Manual | Pass | The wordmark and all headings are live text. The share image is used only by social platforms. Example images (drafts only) repeat their text in the alt text. |
| 1.4.10 Reflow | AA | Both | Pass (automated); manual pending | Every page at 320 CSS px: no horizontal scrolling. |
| 1.4.11 Non-text Contrast | AA | Automated | Pass | Focus indicators 3.93:1 to 8.89:1, field borders 8.32:1, button shapes at least 5.66:1 (section 5.3). |
| 1.4.12 Text Spacing | AA | Automated | Pass | WCAG test values on every page at 375px and 1280px: no overflow, no clipping. |
| 1.4.13 Content on Hover or Focus | AA | Manual | Pass | No tooltips or hover-revealed content. The mobile menu opens only when activated, and stays open until closed. |
| 2.1.1 Keyboard | A | Both | Pass (automated); manual pending | Keyboard walk; menu (Enter, Space, Escape); forms; language switch by keyboard (all tested). |
| 2.1.2 No Keyboard Trap | A | Both | Pass (automated); manual pending | Tab leaves the open menu (tested). There's no modal or focus trap anywhere. |
| 2.1.4 Character Key Shortcuts | A | Manual | Not applicable | No keyboard shortcuts on the public site. |
| 2.2.1 Timing Adjustable | A | Manual | Not applicable | No time limits. |
| 2.2.2 Pause, Stop, Hide | A | Manual | Not applicable | Nothing moves, blinks, scrolls or updates on its own. |
| 2.3.1 Three Flashes or Below Threshold | A | Manual | Not applicable | No flashing content. |
| 2.4.1 Bypass Blocks | A | Automated | Pass | Skip link first on every page, moves focus to `main` (tested); landmarks; axe `bypass` and `region` pass. |
| 2.4.2 Page Titled | A | Automated | Pass | A descriptive title on every page, unique across both languages (tested). |
| 2.4.3 Focus Order | A | Both | Pass (automated); manual pending | Logical order (keyboard walk). Focus moves to the first form error; Escape returns focus to the menu button (tested). |
| 2.4.4 Link Purpose (In Context) | A | Both | Pass (automated); manual pending | axe `link-name` passes. No "click here". The language switch has visually hidden text ("Ver esta página en español"). The editor guide teaches descriptive link text. |
| 2.4.5 Multiple Ways | AA | Manual | Pass | Every page links to every fixed page through the header navigation, Donate button and footer (technique G126). Entries are linked from their list page and the home page. |
| 2.4.6 Headings and Labels | AA | Both | Pass (automated); manual pending | Headings and labels describe their content (reviewed). |
| 2.4.7 Focus Visible | AA | Automated | Pass | A 3px outline with a 3px gap on every interactive element. The keyboard walk checks every stop. |
| 2.5.1 Pointer Gestures | A | Manual | Not applicable | No multipoint or path-based gestures. |
| 2.5.2 Pointer Cancellation | A | Manual | Pass | Only native links and buttons, which act on release. |
| 2.5.3 Label in Name | A | Both | Pass (automated); manual pending | Every accessible name contains the visible label. The language switch's name starts with its visible word. |
| 2.5.4 Motion Actuation | A | Manual | Not applicable | Nothing responds to device motion. |
| 3.1.1 Language of Page | A | Automated | Pass | `lang="en"` or `lang="es"` matches the address (tested); axe `html-lang-valid` passes. |
| 3.1.2 Language of Parts | AA | Both | Pass (automated); screen reader pending | The language switch carries `lang` and `hreflang`. The Spanish half of the 404 page is `lang="es"`. Spanish pages flag links to English-only pages "(en inglés)". |
| 3.2.1 On Focus | A | Both | Pass | Focus never changes the page or context (keyboard walk). |
| 3.2.2 On Input | A | Both | Pass | Typing never submits or navigates. The language switch is a link the user chooses. |
| 3.2.3 Consistent Navigation | AA | Both | Pass | One layout component gives every page the same header, navigation order and footer. |
| 3.2.4 Consistent Identification | AA | Manual | Pass | The same label is used for the same function everywhere. The Spanish About label matches its page title (D35). |
| 3.3.1 Error Identification | A | Automated | Pass | Invalid fields are named in text, with `aria-invalid` and `aria-describedby` (tested in all three forms, in both languages). |
| 3.3.2 Labels or Instructions | A | Automated | Pass | Visible labels, "(required)" and "(optional)" in text, hints, and a note on required fields (tested). |
| 3.3.3 Error Suggestion | AA | Automated | Pass | Messages say how to fix the error ("Enter an email address in the format name@example.com."). |
| 3.3.4 Error Prevention (Legal, Financial, Data) | AA | Manual | Not applicable | No legal, financial or data-changing transactions. Donations happen on an external site. |
| 4.1.1 Parsing | A | Manual | Pass | The W3C erratum (2023) treats 4.1.1 as always satisfied for HTML. Astro generates the markup, and IDs are unique per page. |
| 4.1.2 Name, Role, Value | A | Both | Pass (automated); screen reader pending | Native elements throughout. The menu button has `aria-expanded` and `aria-controls`; the unavailable Donate button has `aria-disabled` with a description (tested). axe ARIA and name rules pass. |
| 4.1.3 Status Messages | AA | Both | Pass (automated); screen reader pending | A `role="status"` live region, present from page load, announces success, "not connected" and failure (tested). |

### 6.2 WCAG 2.2 additions applied

| Criterion | Level | Method | Result | Notes |
|---|---|---|---|---|
| 2.4.11 Focus Not Obscured (Minimum) | AA | Automated | Pass | No sticky or fixed elements. The keyboard walk checks every focus stop is in view and not covered. |
| 2.5.7 Dragging Movements | AA | Manual | Pass | Nothing needs dragging. |
| 2.5.8 Target Size (Minimum) | AA | Automated | Pass | Buttons, navigation links and the language switch are at least 44px (tested); footer links at least 24px tall; inline text links are exempt. axe (`wcag22aa` tag) passes. |
| 3.2.6 Consistent Help | A | Manual | Pass | The contact link is in the same place in every footer. |
| 3.3.7 Redundant Entry | A | Manual | Not applicable | Each form is a single step. |

## 7. Defect log

Every defect found during the build. All are fixed, and the full suite passes after each fix.

| # | Found by | Severity | Page(s) | Problem | Fix | Status |
|---|---|---|---|---|---|---|
| 1 | Missing-page build guard | High (blocked the build) | All | Astro lowercased entry IDs (`getHelp` became `gethelp`), so pages couldn't find their content | Entry IDs are now the exact file names (D12) | Fixed (Phase 1) |
| 2 | Manual check of the editor in dev | High (blocked local editing) | `/keystatic` | The admin and its API returned 404 in development because of the trailing-slash setting | A dev-only middleware adds the slash for Keystatic paths (D10) | Fixed (Phase 1) |
| 3 | Visual review | Low | Pages with main text | Extra gap above the first heading in the main text | Removed the top margin on the first element | Fixed (Phase 1) |
| 4 | New uniqueness test | Low | `/`, `/es/` | The English and Spanish home pages had the same `<title>` | The home title adds a short description in each language (D29) | Fixed (Phase 2) |
| 5 | Visual review | Low | About (template build) | A person's photo was squeezed into an oval | Fixed-size round frame around the photo | Fixed (Phase 2) |
| 6 | pa11y (axe 4.13 `color-contrast`) | Moderate (automated failure) | 5 entry pages (template build) | The decorative "←" character in the back link was flagged; axe 4.14 in Playwright didn't flag it | Replaced it with an `aria-hidden` SVG icon | Fixed (Phase 2) |
| 7 | End-to-end editor test | Moderate | Programs and news, both languages | English and Spanish entries shared an image folder, so entries with the same web address would overwrite each other's images | A separate image folder per language (D31) | Fixed (Phase 3) |
| 8 | Keyboard-walk test | Low | All | Smooth scrolling delayed focused elements coming into view | Smooth scrolling removed (D33) | Fixed (Phase 3) |
| 9 | Spanish review during the build | Low | Spanish navigation | "Acerca de" read as unfinished, and didn't match the page title | "Quiénes somos" for both (D35) | Fixed (Phase 3) |
| 10 | Loading the content batch | Moderate | `/get-help/`, `/es/obtener-ayuda/` | The new Get Help text says "use the form below", but the page had no form | Added a Get Help request form, with the same accessible pattern and tests as the others (D40) | Fixed (content batch) |
| 11 | Uniqueness test | Low | UNLV Food Tasting Club, both languages (template build) | The club's name is the same in both languages, so its two pages shared a browser title | Program and news titles now include their section (D42) | Fixed (content batch) |
| 12 | Broader search for tú forms | Low | `/es/contacto/` | The usted switch first missed "Contáctanos" (page title) and "Comunícate" (search description) | Changed to "Contáctenos" and "Comuníquese" (D25) | Fixed (content batch) |

Test-harness problems found and fixed along the way (not site defects): the static test server crashed on abandoned requests (D30), and two test assertions were wrong (a description regex, and Playwright refusing to click an `aria-disabled` button without `force`).

## 8. Manual testing

Run these yourself. Automated tools catch roughly a third to a half of accessibility problems. These passes cover the rest: whether things make sense, sound right and feel usable. Together they take about two to three hours.

### Setup (once, about 5 minutes)

1. In the project folder run `pnpm build:templates && pnpm serve`. Leave it running. The site is at `http://localhost:4321`. This build includes every template and the example entries.
2. To check the production-only states afterwards (Donate unavailable, empty lists), stop the server, run `pnpm build:test && pnpm serve`, and look at `/donate/`, `/programs/` and `/es/noticias/`.
3. Or use a deployed Vercel preview address instead of `localhost`.
4. For each failure, note the page, what you did, what happened and what you expected, and add a row to the defect log (section 7).

**Pages to cover:** the 20 pages in section 3; the three programs in each language (`/programs/unlv-food-tasting-club/`, `/programs/volunteer-days/`, `/programs/mobile-food-pantry/` and their Spanish versions); the four news posts in each language (added 9 November 2026, with photo grids); the Home page photo and stats strip, and the club board and club life sections on About; `/programs/example-program/`, `/news/example-news-post/` and `/es/programas/programa-de-ejemplo/`; and one wrong address (`/es/no-existe/`).

### 8.1 Full keyboard walk of every page

In Chrome or Firefox on a computer. In Safari, first turn on Settings > Advanced > **Press Tab to highlight each item on a webpage**. Don't touch the mouse or trackpad.

For each page:

1. Click in the address bar, type the address, press Enter, then press **Tab** once.
2. Check that "Skip to main content" appears at the top left. Press **Enter**. The next **Tab** should land on the first link or field inside the main content.
3. Reload. Press **Tab** repeatedly through the whole page, to the footer, then **Shift+Tab** back to the top. At every stop:
   - you can see where focus is (a blue ring; a yellow ring in the dark footer);
   - the focused item isn't hidden or cut off;
   - the order follows the reading order, top to bottom and left to right.
4. Activate links with **Enter** and buttons with **Enter** and **Space**.

Then these specific checks:

5. **Language switch:** on any page, Tab to "Español" (or "English") and press Enter. You should land on the same page in the other language.
6. **Mobile menu:** make the window narrow (about 400px wide) or zoom to 400%. Tab to "Menu" and press Enter: the links appear. Tab through them. Press **Escape**: the menu closes and focus is back on "Menu". Open it again with **Space** and Tab past the last link: focus should leave the menu.
7. **Forms (`/contact/`, `/volunteer/`, `/get-help/` and their Spanish versions):** Tab to the submit button without filling anything in and press Enter. Focus should jump to "Your name" (or "Su nombre"), with a red "Error: …" message above it. Fill in every field (use a made-up email such as `test@example.org`), submit, and check the message under the button.
8. **Donate (production build):** Tab to "Donation link coming soon". It should take focus and do nothing when you press Enter.

- [ ] `/` and `/es/`
- [ ] `/about/` and `/es/acerca-de/`
- [ ] `/programs/` and `/es/programas/`
- [ ] `/programs/example-program/` and `/es/programas/programa-de-ejemplo/`
- [ ] The three programs, in both languages
- [ ] `/get-help/` and `/es/obtener-ayuda/` (including step 7)
- [ ] `/volunteer/` and `/es/voluntariado/` (including step 7)
- [ ] `/donate/` and `/es/donar/` (including step 8)
- [ ] `/news/` and `/es/noticias/`
- [ ] `/news/example-news-post/` and `/es/noticias/noticia-de-ejemplo/`
- [ ] `/contact/` and `/es/contacto/` (including step 7)
- [ ] `/accessibility/` and `/es/accesibilidad/`
- [ ] `/privacy/` and `/es/privacidad/`
- [ ] `/es/no-existe/` (the 404 page)
- [ ] Mobile menu (step 6), on one English and one Spanish page
- [ ] Language switch (step 5), on one fixed page and one entry page

### 8.2 VoiceOver on macOS with Safari

1. Open Safari. Turn VoiceOver on with **Cmd+F5**. "VO" below means **Control+Option** held together.
2. For each page below, load it and:
   - listen to the page title being read;
   - press **VO+U** to open the rotor. Use Left/Right arrow to switch between **Landmarks**, **Headings**, **Links** and **Form controls**. Check there's one banner, navigation, main and content-info landmark; that the headings make an outline that matches the page (one level 1); and that link names make sense out of context. Press Escape to close;
   - press **VO+Right arrow** repeatedly to read the page from the top. Check that images are described sensibly, decorative patterns are silent, and nothing reads as gibberish.
3. On an English page, move to "Español": VoiceOver should say it in a Spanish voice. On a Spanish page, it should read the whole page in Spanish.
4. On `/contact/`: move to each field with **VO+Right arrow**. Each should be announced with its label, "required" where marked, and its hint. Submit empty: VoiceOver should announce the first field as invalid, with its error message. Fill in the fields and submit: the result message should be announced without you moving to it.
5. On `/donate/` (production build): "Donation link coming soon" should be announced as a dimmed (unavailable) button, with its explanation.
6. At narrow width: "Menu" should be announced as a button, "collapsed", then "expanded" after you activate it with **VO+Space**.
7. Turn VoiceOver off with **Cmd+F5**.

- [ ] `/` and `/es/`
- [ ] `/about/` (people cards with initials; club life photos)
- [ ] `/get-help/` and `/es/obtener-ayuda/`
- [ ] `/contact/` and `/es/contacto/` (step 4)
- [ ] `/volunteer/` (step 4)
- [ ] `/donate/` (step 5)
- [ ] `/programs/example-program/` (image description, "When" and "Where")
- [ ] Language switching (step 3)
- [ ] Mobile menu (step 6)

### 8.3 VoiceOver on iOS with Safari

1. Use the Vercel preview address, or your computer's local network address (run `pnpm serve` and find your computer's IP address in System Settings > Network).
2. Turn VoiceOver on: Settings > Accessibility > VoiceOver. (Set Accessibility Shortcut to VoiceOver so a triple-click of the side button toggles it.)
3. Swipe right to move item by item, and double-tap to activate. Use the rotor (twist two fingers) to choose Headings or Form Controls, then swipe down to jump between them.
4. Check:
   - the skip link is the first item;
   - "Menu" announces as collapsed or expanded, and the links can be reached when it's open;
   - every form field announces its label, "required" and its hint, and the keyboard type suits it (an email keyboard for email);
   - submitting the form empty announces the error, and a complete submit announces the result;
   - the language switch works, and Spanish pages are read in Spanish;
   - pinching to zoom works on every page.

- [ ] `/` and `/es/`
- [ ] `/contact/` and `/es/voluntariado/` (forms)
- [ ] `/programs/example-program/`
- [ ] `/donate/`
- [ ] Mobile menu
- [ ] Pinch zoom

### 8.4 NVDA on Windows with Firefox

1. Install the current NVDA from `https://www.nvaccess.org/download/` and the current Firefox. In NVDA, open the NVDA menu (**Insert+N**) > Preferences > Settings > Speech, and make sure **Automatic language switching** is ticked. "NVDA" below means the **Insert** key (or **Caps Lock** if set up that way).
2. For each page below, load it and:
   - press **H** to move through headings, and **1** to jump to the level 1 heading;
   - press **D** to move through landmarks;
   - press **K** to move through links, and listen to their names;
   - press **NVDA+F7** for the elements list (links, headings, landmarks) and review it;
   - press **Down arrow** to read the page line by line.
3. Forms: press **F** to move to the first field. NVDA switches to focus mode when you type. Check the label, "required" and hint are read. Submit empty with Enter on the button: NVDA should read the first invalid field and its error. Complete and submit: the result message should be read automatically.
4. On an English page, move to "Español": NVDA should switch to a Spanish voice. Read part of a Spanish page.
5. At narrow width (resize the window): the menu button is read as "Menu, button, collapsed", then "expanded" after you press Space.
6. On `/donate/` (production build): the unavailable button is read as "unavailable" or "dimmed", with its explanation.

- [ ] `/` and `/es/`
- [ ] `/about/`
- [ ] `/get-help/` and `/es/obtener-ayuda/`
- [ ] `/contact/` and `/es/contacto/` (step 3)
- [ ] `/volunteer/` and `/es/voluntariado/` (step 3)
- [ ] `/donate/` (step 6)
- [ ] `/news/example-news-post/`
- [ ] Language switching (step 4)
- [ ] Mobile menu (step 5)

### 8.5 200 percent zoom

1. In Chrome on a computer, set the window to about 1280 pixels wide.
2. Press **Cmd/Ctrl and +** until the zoom shows 200%.
3. On every page check that:
   - nothing needs sideways scrolling;
   - no text overlaps or is cut off;
   - the header switches to the "Menu" button, and the menu works;
   - forms remain usable, and error messages are fully visible.
4. Repeat at 400% for three pages (`/`, `/contact/`, `/es/obtener-ayuda/`). Sideways scrolling must still not be needed.
5. In Firefox: View > Zoom > **Zoom Text Only**, then zoom to 200%, and check three pages for overlapping or cut-off text.
6. Reset zoom with **Cmd/Ctrl and 0**.

- [ ] All 20 fixed pages at 200%, in Chrome
- [ ] The 4 entry pages at 200%
- [ ] 400% on 3 pages (step 4)
- [ ] Text-only zoom in Firefox (step 5)

### 8.6 Color blindness simulation

1. In Chrome, open DevTools (**Cmd+Option+I** or **F12**), then the **⋮** menu > More tools > **Rendering**.
2. Under **Emulate vision deficiencies**, choose each in turn: Protanopia, Deuteranopia, Tritanopia, Achromatopsia, and Blurred vision.
3. For each, check `/`, `/contact/` (submit it empty to show the errors), `/programs/example-program/` and `/donate/`:
   - links are still recognisable as links (they're underlined);
   - the current page in the navigation still stands out (thicker underline);
   - buttons are still recognisable as buttons;
   - error messages are understandable without color (they start with "Error:");
   - the focus ring is still visible when you Tab.
4. Set it back to **No emulation**.

- [ ] Protanopia
- [ ] Deuteranopia
- [ ] Tritanopia
- [ ] Achromatopsia
- [ ] Blurred vision

### 8.7 Optional: Windows High Contrast

Screenshots in Chromium's forced-colors mode showed no problems (D34). If you have a Windows machine: Settings > Accessibility > Contrast themes > choose one > Apply, then repeat steps 1 to 4 of section 8.1 on `/`, `/contact/` and `/donate/`, checking that buttons, fields and focus rings stay visible.

- [ ] Windows High Contrast

### Sign-off

When every box above is ticked and any new defects are fixed and retested, record the result here and update the date in the accessibility statement (both languages).

**Manual testing completed by:** _______________________  **Date:** _______________

**Outcome:** ☐ No defects found  ☐ Defects found and fixed (listed in section 7)

## 9. Limitations

- The Keystatic editor at `/keystatic` is third-party software used only by the site's editors. It isn't covered by this report, and the accessibility statement says so.
- Formspree's own pages (shown only if someone submits a form without JavaScript) and the external donation site (once linked) are controlled by those services.
- Automated tests run in Chromium only. The manual passes cover Safari (macOS and iOS) and Firefox with NVDA.
- Content added later must keep to the editor guide's rules (headings, link text, alt text, plain language). The automated suite in CI catches structural problems in new content, but not the quality of descriptions or wording.
