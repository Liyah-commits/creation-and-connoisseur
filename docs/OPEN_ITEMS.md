# Open items for Aryah

Every fact or asset the site needs that could not be found or hasn't been supplied. Each one ships **empty**: the field exists in the CMS, and the page hides the section until it's filled. Nothing here was guessed.

**Where the site's facts come from:** the brief's four facts (the name, the 501(c)(3) status, the focus on food insecurity at UNLV, and that Aryah Certain owns and runs the organization), plus Aryah's content batch of 6 November 2026, loaded with three edits (decision D38).

"Where to enter it" points to the Keystatic admin (`/keystatic`). In local development that's `http://127.0.0.1:4321/keystatic`.

Item numbers stay fixed so other documents can refer to them. **Supplied** items are loaded, and the note says what's left before they go live. Programs and people were loaded as drafts. Pages and Site settings have no draft state, so their new text is in the build now but not yet deployed (D38).

*(Updated 6 November 2026 after the content batch.)*

## Organization facts

1. **Mission statement and tagline.** **Supplied.** The mission (content batch, rewritten so the pantry reads as planned for 2027, D38) is in Site settings > Mission statement and shows on About. The tagline ("Fighting food insecurity at UNLV and across Las Vegas." / "Combatimos la inseguridad alimentaria en UNLV y en todo Las Vegas.") is in Site settings > Tagline. It shows in every footer, in the home page title and in search-engine data (D43).
2. **The story for the About page.** **Supplied**, in Pages > about > Main text, both languages, with the student figures removed and the pantry as planned.
3. **Aryah Certain's title, short bio and photo.** Title ("Founder and President" / "Fundadora y Presidenta") and bio **supplied** (last sentence revised 6 November 2026 to "and the planned mobile food pantry"), in Shared > People > Aryah Certain, as a draft. Still needed: confirm the title matches the bylaws, and supply a photo with permission and a description in both languages. Untick **Hide from the live site** when ready.
4. **Board members and other people** to list, with roles, bios and photos. Where: Shared > People.
5. **EIN.** Where: Site settings > EIN. Shows in the footer and on Donate.
6. **Exact legal name**, as registered with the IRS. Where: Site settings > Legal name.
7. **Mailing address, public email and phone.** Where: Site settings. Shows in the footer and on Contact. The privacy policy, accessibility statement and Get Help page all point people to "the email on our Contact page", so this matters more now.
8. **Donation link** and any other ways to give. Where: Site settings > Donation link. Until then the Donate button reads "Donation link coming soon".
9. **Social media links.** Where: Site settings > Social media links. The pantry program page says sites will be announced "on our social channels". For each profile's bio, use the tagline (item 1), in English or Spanish.
10. **Relationship to UNLV.** Wording **supplied**, in Site settings > Relationship to UNLV, both languages. It shows in every page's footer (D39). Still needed, as the batch says: confirm the exact phrasing with UNLV Student Involvement before deploying.
11. **Founding year** (optional). Where: Site settings > Year founded. Once known, the batch suggests adding it to the first sentence of the About story.

## Programs and help

12. **Programs.** **Supplied**, three drafts in each language: UNLV Food Tasting Club, Biweekly Volunteering, and Mobile Food Pantry (planned for 2027). Untick **Hide from the live site** on each, in both languages, after reading them.
13. **Get Help details.** **Supplied**, in Pages > getHelp, both languages, with a request form added (D40). The response time is two business days.
14. **Community resources on Get Help.** **Supplied**: four links, verified on 6 November 2026 (D41):

    | Resource | Address used | Result |
    |---|---|---|
    | Nevada 211 (food assistance) | `https://www.nevada211.org/food-assistance/` | 200, "Food Assistance – Nevada 211" |
    | Three Square Food Bank (find food) | `https://www.threesquare.org/find-food` | 200, "Get help with finding food in Southern Nevada" |
    | UNLV campus food pantry | `https://www.unlv.edu/unit/food-pantry` | 200, "Food Pantry \| UNLV" (lists current hours) |
    | Access Nevada (SNAP applications) | `https://accessnevada.nv.gov/` | 200, "Access Nevada" (`accessnevada.dwss.nv.gov` redirects here) |

    Recheck them before launch and each semester. The link checker requests them on every test run.
15. **Volunteer roles.** **Supplied**: five roles, in Pages > volunteer, both languages. The Pantry team role says it starts once the planned pantry launches.
16. **Any existing news posts** to publish.

## Forms and privacy

17. **`FORMSPREE_FORM_ID`** and the email address that should receive submissions. All three forms (Contact, Volunteer, Get Help) use one Formspree form, told apart by subject line. Until it's set, the forms show a notice that they aren't connected. Where: Vercel environment variables (`docs/ADMIN_GUIDE.md`).
18. **Privacy policy.** Answers **supplied** and loaded in Pages > privacy, both languages: 12 months' retention, board and volunteer coordinator access, the public email as the contact, never sold. Still needed: the read-through by someone with a law background that the batch recommends, and the public email (item 7).
19. **Accessibility feedback contact and response time.** **Supplied**: the public email, five business days. Loaded in Pages > accessibility. It depends on item 7.

## Brand and photos

20. **Logo files and brand colors**, if any exist. The site uses a typographic wordmark and an original palette until then.
21. **Photos:** every photo the site should show (home page, About, people, programs, news), with permission to use them. Decorative patterns stand in until then; no stock photos are used.

## Launch

22. **Production domain** (`SITE_URL`). Until it's set, canonical links and the sitemap use Vercel's production address.
23. **GitHub repository and the Keystatic GitHub App** for editing in production, including whether the repository is public (a visible portfolio piece) or private. Nothing has been pushed or deployed (ruling D2); `docs/ADMIN_GUIDE.md` section 4 has the steps.
24. **A Spanish-speaking reviewer**, and their sign-off on every file in `docs/SPANISH_REVIEW.md`. Every Spanish file changed with the content batch, so every box is unchecked.
25. **Spanish register.** **Resolved**: usted throughout, ruled 6 November 2026 (D25).
26. **Aryah's manual accessibility passes:** keyboard, VoiceOver (macOS and iOS), NVDA, 200 percent zoom and color-blindness simulation, as listed in `docs/ACCESSIBILITY_TEST_REPORT.md` section 8. A WCAG 2.1 AA conformance claim waits on these. When they're done, replace the "in progress" paragraph in the accessibility statement (both languages) with a plain conformance claim.
27. **Editors:** who will edit the site, and their GitHub accounts, so they can be given access (`docs/ADMIN_GUIDE.md` section 5).
