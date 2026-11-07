# Brief (verbatim, as given on 6 November 2026)

The source requirements for the rebuild. Changes ruled since are recorded in `docs/DECISIONS.md`: D1 replaces Node 20 with Node 24 LTS, and D2 keeps the repo local with no push or deploy from the build session.

---

Rebuild the Creation and Connoisseur website end to end. Creation and Connoisseur is a 501(c)(3) nonprofit focused on food insecurity at UNLV, owned and run by Aryah Certain. The finished site is a portfolio example for public sector and nonprofit RFPs, so it must prove four things with evidence: WCAG 2.1 AA conformance with a written test report, bilingual English and Spanish delivery, a CMS a non technical volunteer can use, and clean migration practice. Work autonomously. Make decisions, record them in docs/DECISIONS.md, and only stop for something that genuinely blocks you.

PHASE 0, DISCOVERY (do this first, then write docs/PLAN.md before building)
1. Check the current working directory and any sibling folders for an existing Creation and Connoisseur repo, site export, or content folder. If one exists, inventory every page, image, document and URL into docs/CONTENT_INVENTORY.md with a keep, revise, consolidate or remove recommendation, and build docs/REDIRECTS.md mapping every old URL to its new destination with a 301. If nothing exists, say so in PLAN.md and start from a blank scaffold.
2. Extract every fact about the organization from whatever exists: mission wording, programs, dates, locations, people, logo, colors, donation links, social links, EIN. Never invent facts about the organization. Any fact the site needs that you cannot find (EIN, mailing address, program schedule, board names, donation URL, photos) goes into docs/OPEN_ITEMS.md as a numbered list for Aryah, and the site ships with that field empty, never with made up content.

STACK (decided, do not revisit)
Astro with TypeScript, Tailwind CSS, Keystatic as the CMS in GitHub mode so editors get a visual admin at /keystatic, Astro i18n routing with English at / and Spanish at /es/, deployed to Vercel, repo on GitHub. Content lives in content/ as Markdown and YAML managed by Keystatic. Node 20. Use pnpm.

SITE STRUCTURE (both languages, every page)
Home, About (mission, story, people), Programs (one page listing programs plus one template page per program), Get Help (how a student gets food support, plain language, no eligibility jargon), Volunteer (with a form), Donate, News (list plus post template), Contact (with a form), Accessibility statement, Privacy policy. Header with skip link, language toggle that keeps the user on the same page in the other language, and a visible Donate button. Footer with contact, social, EIN line (empty until supplied) and the accessibility statement link.

BILINGUAL
Full Spanish versions of every page and every UI string, not a machine translate widget. Draft the Spanish yourself at professional quality, then write docs/SPANISH_REVIEW.md listing every Spanish file with a checkbox so a Spanish speaking team member reviews each before launch. Set html lang per page, hreflang alternates on every page, and a sitemap that includes both languages.

FORMS
Volunteer and Contact forms use accessible markup: visible labels, required field indication in text not color alone, inline error messages tied with aria-describedby, focus moved to the first error on submit, and a success message announced with a live region. Submission goes to Formspree when the FORMSPREE_FORM_ID environment variable is set. When it is not set, the form renders fully but shows a plain text notice that submissions are not yet connected, and OPEN_ITEMS.md lists it.

DONATE
If a donation URL exists in the source material, the Donate button and page link to it. If none exists, build the page with the copy and a disabled button labeled "Donation link coming soon," and list it in OPEN_ITEMS.md. Do not integrate a payment processor.

ACCESSIBILITY, THE PART THAT MATTERS MOST
Build to WCAG 2.1 AA on every template and component, and apply the 2.2 AA additions where they cost nothing (focus not obscured, target size 24 by 24 minimum, no drag only interactions). Requirements: semantic landmarks on every page, one h1 per page and a logical heading order, skip link as the first focusable element, visible focus indicator with at least 3 to 1 contrast on every interactive element, text contrast at least 4.5 to 1 and large text at least 3 to 1 (check every Tailwind color pair you use and record the ratios in the report), keyboard operability for every control including the language toggle and mobile menu, no keyboard traps, reduced motion respected, images with meaningful alt text or empty alt when decorative, no information conveyed by color alone, forms as specified above, no accessibility overlay of any kind, and zoom to 200 percent without horizontal scrolling.

Automated testing you must set up and run: @axe-core/playwright tests across every page in both languages with zero violations as the pass condition, pa11y-ci against the built site, and Lighthouse CI with thresholds of 95 or above for accessibility, performance and best practices and 100 for SEO. Wire all three into a GitHub Actions workflow that runs on every pull request. Fix every finding before you call a phase done.

Write docs/ACCESSIBILITY_TEST_REPORT.md in this structure: site and date, standard tested (WCAG 2.1 AA), pages and templates covered, tools and versions, a table of every WCAG 2.1 AA success criterion with columns for criterion, method (automated, manual, or both), result, and notes, then a defect log with severity, page, fix and status, then a manual testing section with checkboxes for the passes Aryah will run herself: full keyboard walk of every page, VoiceOver on macOS Safari and iOS, NVDA on Windows Firefox, 200 percent zoom, and color blindness simulation. Pre fill every automated result. Leave the manual checkboxes unchecked with the exact steps written under each so they can be completed in one sitting.

EDITOR EXPERIENCE AND DOCS
Keystatic collections for pages, programs, news posts and people, with field help text in plain language. Write docs/EDITOR_GUIDE.md (how to add a news post, edit a program, upload an image with alt text, publish in both languages) and docs/ADMIN_GUIDE.md (users, environment variables, deploys, backups, how to roll back). Screenshots are not required; precise steps are.

SEO AND MIGRATION HYGIENE
Unique titles and meta descriptions per page per language, Open Graph tags, Organization and NGO structured data, canonical tags, robots.txt, sitemap, and the 301 redirect map implemented in vercel.json if an old site existed. Run a broken link check on the built site and record the result in the test report.

DESIGN
Original, warm and simple. Use the organization's existing logo and colors if they exist in the source material; otherwise choose an accessible palette and record the hex values and contrast ratios in DECISIONS.md. Mobile first. System font stack or one open license font. No stock photos: use an accessible placeholder pattern where images are missing and list each needed photo in OPEN_ITEMS.md.

WORKING RULES
Commit at the end of each phase with a clear message. Run the full test suite before each commit. Keep a running docs/DECISIONS.md with every choice you made and why. When finished, print a summary with: the local dev command, the Vercel deploy steps, the number of pages built per language, the Lighthouse scores, the axe violation count, and the full contents of OPEN_ITEMS.md.

Definition of done: pnpm build succeeds, every axe and pa11y check passes with zero violations in both languages, Lighthouse meets the thresholds, both guides and the test report exist, SPANISH_REVIEW.md lists every Spanish file, and OPEN_ITEMS.md contains every fact you could not find rather than a guess.
