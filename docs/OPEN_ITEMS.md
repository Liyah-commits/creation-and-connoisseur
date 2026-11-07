# Open items for Aryah

Every fact or asset the site needs that could not be found. Each one ships **empty**: the field exists in the CMS, and the page hides the section until it's filled. Nothing here was guessed.

The site states only four facts, all from the brief: the name, the 501(c)(3) status, the focus on food insecurity at UNLV, and that Aryah Certain owns and runs the organization.

"Where to enter it" points to the Keystatic admin (`/keystatic`). In local development that's `http://127.0.0.1:4321/keystatic`.

*(Final list, Phase 4, 6 November 2026. When an item is supplied, enter it, then delete it from this list.)*

## Organization facts

1. **Official mission statement**, in English and its approved Spanish translation. Where: Shared > Site settings > Mission statement (English / Spanish). Shows on About.
2. **The story for the About page.** Where: English > Pages (English) > about > Main text, and the Spanish page. Shows as "Our story".
3. **Aryah Certain's title, short bio and photo** (with permission and a description of the photo in both languages). Where: Shared > People.
4. **Board members and other people** to list, with roles, bios and photos. Where: Shared > People.
5. **EIN.** Where: Site settings > EIN. Shows in the footer and on Donate.
6. **Exact legal name**, as registered with the IRS. Where: Site settings > Legal name.
7. **Mailing address, public email and phone.** Where: Site settings. Shows in the footer and on Contact.
8. **Donation link** and any other ways to give. Where: Site settings > Donation link. Until then the Donate button reads "Donation link coming soon".
9. **Social media links.** Where: Site settings > Social media links.
10. **How to describe the relationship to UNLV.** The site says only that the organization focuses on food insecurity at UNLV, uses no UNLV marks, and avoids implying endorsement. Confirm the wording, or supply approved wording.
11. **Founding year** (optional, used only in search-engine data). Where: Site settings > Year founded.

## Programs and help

12. **Programs:** names, descriptions, schedules and locations. Where: English > Programs, and Español > Programas.
13. **Get Help details**, in plain language: where to go, when, how, what to bring, and how quickly someone will respond. Where: Pages > getHelp, both languages.
14. **Whether to list community resources** on Get Help (for example, the campus food pantry or Nevada 2-1-1), and which ones.
15. **Volunteer roles** to describe on the Volunteer page.
16. **Any existing news posts** to publish.

## Forms and privacy

17. **`FORMSPREE_FORM_ID`** and the email address that should receive submissions. Until it's set, both forms show a notice that they aren't connected. Where: Vercel environment variables (`docs/ADMIN_GUIDE.md`).
18. **Privacy policy review:** how long form messages are kept, who can see them, a privacy contact, and legal review. The draft says messages are used only to reply and are not sold; confirm or change that.
19. **Accessibility feedback contact and response time** for the accessibility statement.

## Brand and photos

20. **Logo files and brand colors**, if any exist. The site uses a typographic wordmark and an original palette until then.
21. **Photos:** every photo the site should show (home page, About, people, programs, news), with permission to use them. Decorative patterns stand in until then; no stock photos are used.

## Launch

22. **Production domain** (`SITE_URL`). Until it's set, canonical links and the sitemap use Vercel's production address.
23. **GitHub repository and the Keystatic GitHub App** for editing in production, including whether the repository is public (a visible portfolio piece) or private. Nothing has been pushed or deployed (ruling D2); `docs/ADMIN_GUIDE.md` section 4 has the steps.
24. **A Spanish-speaking reviewer**, and their sign-off on every file in `docs/SPANISH_REVIEW.md`.
25. **Confirmation of the "tú" register** for the Spanish text (D25).
26. **Aryah's manual accessibility passes:** keyboard, VoiceOver (macOS and iOS), NVDA, 200 percent zoom and color-blindness simulation, as listed in `docs/ACCESSIBILITY_TEST_REPORT.md` section 8. A WCAG 2.1 AA conformance claim waits on these.
27. **Editors:** who will edit the site, and their GitHub accounts, so they can be given access (`docs/ADMIN_GUIDE.md` section 5).
