# Open items for Aryah

Every fact or asset the site needs that could not be found or hasn't been supplied. Each one ships **empty**: the field exists in the CMS, and the page hides the section until it's filled. Nothing here was guessed.

**Where the site's facts come from:** the brief's four facts (the name, the 501(c)(3) status, the focus on food insecurity at UNLV, and that Aryah Certain owns and runs the organization), plus Aryah's content batch of 6 November 2026, loaded with three edits (decision D38), plus the lines marked CONFIRMED in `photos-inbox/FACTS.md` (from the club's Instagram export, 8 November 2026, D46). `photos-inbox/` is git-ignored and stays on Aryah's computer.

"Where to enter it" points to the Keystatic admin (`/keystatic`). In local development that's `http://127.0.0.1:4321/keystatic`.

Item numbers stay fixed so other documents can refer to them. **Supplied** items are loaded, and the note says what's left before they go live. Programs and Aryah's bio were loaded as drafts and published on 7 November 2026, before the first deploy (D44). Pages and Site settings have no draft state, so their text has been in the build since it was loaded.

*(Updated 9 November 2026 after the photos, stats, board, news and contact batch, D46 to D53, and the confirmed stats and hero line, D54.)*

## Organization facts

1. **Mission statement and tagline.** **Supplied.** The mission, "Creation and Connoisseur fights food insecurity at UNLV and across Las Vegas." (replaced 9 November 2026, with no pantry wording, D53), is in Site settings > Mission statement and shows on About. The tagline ("Fighting food insecurity at UNLV and across Las Vegas." / "Combatimos la inseguridad alimentaria en UNLV y en todo Las Vegas.") is in Site settings > Tagline. It shows in every footer, in the home page title and in search-engine data (D43).
2. **The story for the About page.** **Supplied**, in Pages > about > Main text, both languages, with the student figures removed and the pantry as planned.
3. **Aryah Certain's title, short bio and photo.** Title ("Founder and President" / "Fundadora y Presidenta") and bio **supplied** (last sentence revised 6 November 2026 to "and the planned mobile food pantry"), in Shared > People > Aryah Certain, **published** 7 November 2026. Still needed: confirm the title matches the bylaws, and supply a photo with permission and a description in both languages. Since 9 November 2026 every person card shows initials, never a photo (D58), so a headshot would need the photo field added back. **To confirm** (`FACTS.md`): whether this photo is the club costume portrait or a separate professional headshot. `FACTS.md` recommends a headshot for the nonprofit; the costume portrait is already used for her card in the club board group.
4. **Board members and other people** to list, with roles, bios and photos. Where: Shared > People. **Club board supplied** (9 November 2026, D51): nine UNLV Food Tasting Club board members, first names, titles and "Favorite food" bios, in the "UNLV Food Tasting Club board" group. Their cards show initials: the club portraits have names burned in and were removed on 9 November 2026 (D58). Clean portraits from Jaziel would also need the photo field added back. Still needed: each member's agreement before any full name goes online; the Spanish reviewer's check of the gendered Spanish titles with each person. The nonprofit's own board, if it has one, is still needed.
5. **EIN.** **Supplied** (9 November 2026, D60): `93-2889729`, in Site settings > EIN. It shows in the footer and on Donate as part of the tax line, and in the home page's Organization data as `taxID`.
6. **Exact legal name**, as registered with the IRS. Where: Site settings > Legal name.
7. **Mailing address, public email and phone.** Where: Site settings. Shows in the footer and on Contact. The privacy policy, accessibility statement and Get Help page all point people to "the email on our Contact page", so this matters more now. **Public email supplied** (9 November 2026, D56): `info@creationandconnoisseur.org`, in Site settings. It shows in the footer and on Contact, and the privacy policy, accessibility statement and Get Help page now give it directly, in both languages. The contact form stays. The club's `Foodtastingclub@unlv.edu` is still only on the club program page and in its own Contact line (D52). Still needed: the mailing address and phone, if any.
8. **Donation link** and any other ways to give. **Supplied** (9 November 2026, D60): the Zeffy donation form (`https://www.zeffy.com/en-US/donation-form/donate-to-change-lives-28878`), in Site settings > Donation link. It takes one-time or monthly gifts in the nonprofit's name, and Zeffy emails each donor a tax receipt. It replaced the interim link from D53. The Donate page lists the other ways to give (volunteering; partnerships, food and supplies through the public email). **Closed** (9 November 2026, D61): Zeffy has no Spanish version of this form (Aryah checked: the es-ES address returns 404), so both languages keep the en-US link.
9. **Social media links.** **Supplied** (9 November 2026, D53): the club's Instagram, TikTok and Discord, in Site settings > Social media links, shown in the footer and on Contact. For each profile's bio, use the tagline (item 1), in English or Spanish. Off-site, `FACTS.md` says: the Instagram bio says "Official 501(c)(3) Nonprofit". Change it to match the site, for example "UNLV Food Tasting Club, a program of Creation and Connoisseur, a 501(c)(3)."
10. **Relationship to UNLV.** Wording **supplied**, in Site settings > Relationship to UNLV, both languages. It shows in every page's footer (D39). Still needed, as the batch says: confirm the exact phrasing with UNLV Student Involvement before deploying.
11. **Founding year** (optional). Where: Site settings > Year founded. Once known, the batch suggests adding it to the first sentence of the About story.

## Programs and help

12. **Programs.** **Supplied** and **published** 7 November 2026, three in each language: UNLV Food Tasting Club, Volunteer Days (renamed from Biweekly Volunteering on 9 November 2026, with redirects, D48), and Mobile Food Pantry (planned for 2027). If volunteer days do run on a real cadence, change the schedule line in both languages.
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
16. **Any existing news posts** to publish. **Supplied** (9 November 2026, D53): four posts in each language. The optional Taste of the Caribbean notice (12 November 2026) wasn't created; add it only if someone will take it down afterwards.

## Forms and privacy

17. **`FORMSPREE_FORM_ID`** and the email address that should receive submissions. **Supplied** (9 November 2026, D59): Aryah created the Formspree form, and its ID is set in Vercel for Production and Preview, so all three forms (Contact, Volunteer, Get Help) now send, told apart by subject line. Messages go to the email address on the Formspree account. Still to do, in Formspree (`docs/ADMIN_GUIDE.md` 4.5): send one test from each form in each language, and restrict submissions to the site's domain.
18. **Privacy policy.** Answers **supplied** and loaded in Pages > privacy, both languages: 12 months' retention, board and volunteer coordinator access, the public email as the contact, never sold. The public email (`info@creationandconnoisseur.org`) is in the policy since 9 November 2026. Still needed: the read-through by someone with a law background that the batch recommends.
19. **Accessibility feedback contact and response time.** **Supplied**: the public email (`info@creationandconnoisseur.org`, given in the statement since 9 November 2026), five business days. Loaded in Pages > accessibility.

## Brand and photos

20. **Logo files and brand colors.** **Resolved** (9 November 2026, D55): Aryah chose the "desert table" direction, with an original logo mark (sun, mesa and table line), the wordmark in DM Serif Display, and the sand, sage and coral palette.
21. **Photos:** **Supplied** (9 November 2026, D47, D56, D58). Every page that should have a photo has one: the Home photo and cards, page header photos, every program and news post, and About's club life. No decorative patterns remain. Still needed: clean board portraits only if people cards should show photos again (items 3 and 4). Check the board photo's description: it says "The six members of the … executive board", but the board has nine members.

## Launch

22. **Production domain** (`SITE_URL`). Until it's set, canonical links and the sitemap use Vercel's production address.
23. **GitHub repository and the Keystatic GitHub App** for editing in production, including whether the repository is public (a visible portfolio piece) or private. The repository is on GitHub, and pushes are made on Aryah's instruction (D46); `docs/ADMIN_GUIDE.md` section 4 has the Keystatic App steps.
24. **A Spanish-speaking reviewer**, and their sign-off on every file in `docs/SPANISH_REVIEW.md`. Every Spanish file changed with the content batch, so every box is unchecked. The 9 November 2026 batch added or changed more (marked in that file).
25. **Spanish register.** **Resolved**: usted throughout, ruled 6 November 2026 (D25).
26. **Aryah's manual accessibility passes:** keyboard, VoiceOver (macOS and iOS), NVDA, 200 percent zoom and color-blindness simulation, as listed in `docs/ACCESSIBILITY_TEST_REPORT.md` section 8. A WCAG 2.1 AA conformance claim waits on these. When they're done, replace the "in progress" paragraph in the accessibility statement (both languages) with a plain conformance claim.
27. **Editors:** who will edit the site, and their GitHub accounts, so they can be given access (`docs/ADMIN_GUIDE.md` section 5).

## Added 9 November 2026 (from `photos-inbox/FACTS.md`)

28. **The cultural food nights count.** **Resolved** (`FACTS.md`, 9 November 2026): no count of nights is shown, because the club has run far more culture nights than the 13 documented on Instagram. The stat is now "Hundreds of students at culture nights" (D54).
29. **The "1,000+ people fed" stat.** Confirmed by Aryah from the club's captions (over 700 people fed on 23 January 2026, over 100 families fed on 6 November 2026). `FACTS.md`: raise it to "thousands" only if Three Square's impact report for the group supports it. Instagram reach, impressions and follower counts are never shown (D54).
30. **Two confirmed links with no place on the site yet.** The volunteer sign-up form (Google Forms) and "Become a member" (UNLV Involvement Center) are CONFIRMED in `FACTS.md`, but it gives no placement for them, so they aren't on the site. Decide where they go (for example, the Volunteer page and the club program page). The Volunteer page already has its own form.
