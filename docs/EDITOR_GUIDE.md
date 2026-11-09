# Editor guide

How to update the Creation and Connoisseur website. You don't need to know any code. Everything happens in the editing screens at `/keystatic`.

## Before you start

- **You need a GitHub account** that the site admin has given access to the website's repository. GitHub is where the site's content is stored. If you don't have access yet, ask the admin (`docs/ADMIN_GUIDE.md`, section 5).
- **Saving publishes.** When you choose **Save** (or **Create**), your change is stored and the live site updates about one to two minutes later. The exception is anything with **Hide from the live site** ticked: that's saved but stays hidden.
- **Every page exists in English and Spanish.** When you add or change something, do it in both languages before you untick **Hide from the live site**.
- **Only publish confirmed facts.** If you're not sure something is true and approved (a date, a place, a name, a statistic), leave it out and ask Aryah. The site deliberately leaves sections empty rather than guessing.

## Signing in

1. Go to the website address followed by `/keystatic`, for example `https://www.example.org/keystatic`.
2. Choose **Log in with GitHub**, and sign in to GitHub if asked.
3. You'll see the **Dashboard**, with a menu on the left.

## Finding your way around

The menu on the left has three groups:

| Group | What's in it |
|---|---|
| **English** | **Pages (English)**: the fixed pages (Home, About, Get help…). **Programs (English)**. **News posts (English)**. |
| **Español** | The same three, in Spanish: **Páginas**, **Programas**, **Noticias**. |
| **Shared** | **People** (each person has English and Spanish fields), and **Site settings** (contact details, EIN, donation link, mission). |

Every field has a short explanation under its name. Fields with a red star are required.

## Writing so everyone can use the site

These keep the site accessible, which matters to the people it serves and to funders who check.

- **Use headings for structure, in order.** In the main text, choose **Heading 2** for a section and **Heading 3** for a part inside a section. Only use a Heading 3 under a Heading 2, and don't use bold text instead of a heading.
- **Write link text that makes sense on its own.** Write "Read the volunteer guide", not "click here".
- **Keep it plain.** Short sentences, everyday words, no jargon. Get help especially: write it for a stressed student reading on a phone.
- **Describe every photo** (see "Add an image" below).
- **Don't put text inside images.** Screen readers can't read it, and it doesn't translate.
- **Lists:** use the list buttons in the toolbar rather than typing dashes.

## Add a news post

### 1. Write the English post

1. In the menu, choose **News posts (English)**, then **Add** (top right).
2. **Headline**: the title of the post. The **Web address** fills itself in from the headline. You can shorten it, using lowercase words joined by hyphens, but don't change it after the post is published, because old links would break.
3. Leave **Hide from the live site** ticked for now.
4. **Date**: the publication date. It starts as today.
5. **Short summary**: one or two sentences, under 160 characters. It shows in the news list and in search results.
6. **Add an image** (optional): see "Add an image" below. It's the photo on the news list and when the post is shared.
7. **More photos** (optional): up to six more photos, shown in a grid under the text, each with its own description.
8. Write the post in the large text area on the left. Use the toolbar for headings, bold, links and lists.
9. Choose **Create**. The post is saved but hidden.

### 2. Write the Spanish version and link it

1. Choose **Noticias (Spanish news posts)**, then **Add**.
2. Fill in the same fields in Spanish. Give it a Spanish **Web address** (for example `nueva-despensa` rather than `new-pantry`).
3. **English version**: choose the English post you just wrote. This is how the language switch at the top of the site knows the two pages belong together.
4. Leave **Hide from the live site** ticked, and choose **Create**.

### 3. Publish both

1. Open the English post again (**News posts (English)** > the post), untick **Hide from the live site**, and choose **Save**.
2. Open the Spanish post, untick **Hide from the live site**, and choose **Save**.
3. After two minutes, check it on the live site (see "Check your work").

If there is no Spanish version yet, you can still publish the English post. The language switch on it will take Spanish readers to the Spanish news list. Add the translation as soon as you can.

## Edit a program

1. Choose **Programs (English)** and select the program.
2. Change what you need:
   - **Program name**: the heading on the page.
   - **Short summary**: shown on the Programs list.
   - **When**: days and times in plain words, like "Tuesdays, 11 a.m. to 2 p.m.". Leave it empty if it doesn't apply.
   - **Where**: the place in plain words, with building and room if there is one.
   - **Add an image** and **More photos**: the program's card photo, and up to six more shown under the text.
   - **Main text**: everything else.
3. Choose **Save**.
4. Make the same change in Spanish: **Programas (Spanish programs)** > the matching program > edit > **Save**.

To **add** a new program, follow the same steps as a news post: create it in English with **Add**, create the Spanish version with **English version** set to it, then untick **Hide from the live site** on both.

## Add an image (with a description)

Every photo needs a description (alt text) for people who can't see it. The site won't let you save a photo without one.

1. On the program or news post, tick **Add an image**. (People have no photo: their cards show their initials.)
2. Choose **Choose file** and pick a JPG, PNG or WebP from your computer, at least 1200 pixels wide. Only use photos you have permission to use, and that the people in them have agreed to.
3. In **Image description (alt text)**, describe what the photo shows in one sentence, as you would to someone on the phone:
   - Good: "Two volunteers packing bags of groceries at a folding table."
   - Not helpful: "Image of volunteers", "photo123.jpg", or the same words as the headline.
   - Don't start with "Image of" or "Photo of": screen readers already say it's an image.
5. Choose **Save** (or **Create**). If you forgot the description, the editor shows "Image description (alt text) must not be empty" and doesn't save until you add it.

The Spanish version of a program or post has its own **Add an image** box. Add the same photo there with a Spanish description, or leave it off.

To remove an image, untick **Add an image** and save. To remove one of the **More photos**, open its menu in the list and delete it.

## Change the shared photos and stats (Home, page headers, About)

Choose **Photos and stats** (under Shared). It's one screen for both languages:

- **Show a photo at the top of the Home page**: the main Home photo, with a description in English and in Spanish. Use a landscape photo. It loads first, so keep it to one good photo.
- **Home page stats**: up to four figures, shown in a strip under the photo. Each has a **Number or word** (written exactly as it should appear, like "1,000+" or "Hundreds"), its Spanish wording if it's a word ("Cientos"), and what it counts, in English and in Spanish. Only publish a figure you can point to a source for. Don't show Instagram reach, impressions or follower counts.
- **Page header photos**: one photo each for About, Programs, News, Get help, Donate, Contact and Volunteer, with descriptions in both languages. It shows at the top right of the page on computers (cropped to 4:3 from the top) and is hidden on phones. Leave one off and that page's heading uses the full width. Accessibility and Privacy have none.
- **Home page card photos**: the photos on the three "How you can take part" cards. They're cropped to the same 3:2 shape so the row is even. Give all three a photo, or none.
- **Home page spare photos**: the Home page never shows the same photo twice. If a program or news card would repeat a photo shown higher up, it uses the next spare instead. Keep at least two spares that aren't used elsewhere on the Home page.
- **Never** use a photo that shows the face of someone receiving food, or one with a name printed on it.
- **Club life photos (About page)**: up to six photos, shown on About under "Club life", each with a description in both languages.

## Edit a fixed page (Home, About, Get help…)

1. Choose **Pages (English)** (or **Páginas** for Spanish) and select the page. The left column shows each page's internal name (`getHelp`, `about`…).
2. Change the **Page title**, **Search result description**, **Introduction** or **Main text**, then choose **Save**.
3. Don't change the **Internal name** or **File name**, and don't add or delete pages in this list. The site finds each page by its internal name. Deleting one stops the site from updating until it's restored (the admin can do this).
4. Each page needs its own **Search result description**: a different sentence for every page, in each language.

**Links to other sites:** write them as ordinary links. The site adds "(goes to an external site)" for screen readers by itself, in the page's language, so don't type it. On Spanish pages, still add "(en inglés)" after a link to a site that's only in English.

On **Home**, the **Introduction** is the main heading at the top of the page (the hero line). The **Page title** (the organization's name) isn't shown on the page. It's the title in the browser tab and in search results, and the header already shows the name.

On **About**, the main text appears as "Our story". The mission comes from **Site settings**, the people from **People** (in two groups, see "Add a person"), and the header and club life photos from **Photos and stats**. A photo shouldn't appear twice on one page, so don't use the About header photo in club life too.

On **Contact**, the main text appears under "Other ways to reach us", below the form. It holds the UNLV Food Tasting Club's email line. Keep the club's unlv.edu address there and on the club's program page only: never in Site settings or the footer, because a university address shown everywhere would suggest the university endorses the nonprofit.

## Update the organization's details

Choose **Site settings** (under Shared). Fill in a field only when the information is confirmed and approved. Each one appears on the site as soon as you save:

| Field | Where it appears |
|---|---|
| Legal name, EIN | The EIN makes the tax line ("Creation and Connoisseur is a 501(c)(3) nonprofit, EIN …") in every footer and at the end of the Donate page. The legal name shows under the Donate button. |
| Public email, phone, mailing address | Footer and Contact page. The public email is `info@creationandconnoisseur.org`. Never use the club's unlv.edu address here. The privacy policy, accessibility statement and Get Help page also give the email in their text, so change it there too if it ever changes. |
| Donation link | The Donate page's "Donate now" button (until then it reads "Donation link coming soon"). It's the Zeffy form. The header's Donate button always goes to the site's Donate page, not straight to Zeffy. |
| Social media links | Footer and Contact page, each with its icon (Instagram, TikTok and Discord are recognized from the address) |
| Mission statement (English and Spanish) | About page |
| Tagline (English and Spanish) | Under the name in every footer, and in the home page title in search results. Use the same words for social media bios. |
| Relationship to UNLV (English and Spanish) | Footer of every page, in place of the general nonprofit line. Change it only with wording confirmed by UNLV Student Involvement. |
| Short description (English and Spanish) | Search results and social media previews |

## Add a person

1. Choose **People** > **Add**.
2. Fill in **Name**, **Role** and **Short bio** in English and Spanish. Student club board members are listed by first name only, unless they agree to a full name online.
3. **Group**: "Creation and Connoisseur" lists the person under "Our people" on About. "UNLV Food Tasting Club board" lists them in the second group, under that heading.
4. There is no photo: every person card shows the person's initials in a sage circle, so the cards match and no photo with a name printed on it is ever used.
5. **Order** sets the position in the list, lowest first. Use 10, 20, 30… so it's easy to fit someone in later.
6. Untick **Hide from the live site** when the person has approved what's written about them, then choose **Create** or **Save**.

## Hide or delete something

- **To take something off the site but keep it:** tick **Hide from the live site** and save.
- **To delete it:** open it and choose the bin icon at the top right. Delete the Spanish version too. If someone may have linked to it, ask the admin about a redirect (`docs/REDIRECTS.md`).

## Leave the examples alone

Some entries are named "(template preview)" or "Example…". They're there so the automated tests can check the program, news and people templates before real ones exist. Keep **Hide from the live site** ticked on them, and don't delete them. They never appear on the live site.

## Check your work

About two minutes after saving:

1. Open the page on the live site. Refresh if you see the old version.
2. Use the language switch at the top right (**Español** or **English**) to check that it goes to the right page in the other language.
3. Read it once on a phone.

If the change hasn't appeared after five minutes, the site may have refused to update because something was missing. Tell the admin. The live site keeps working on the previous version in the meantime.

## Getting help

Ask the site admin. Every change is recorded with who made it and when, so anything can be undone (`docs/ADMIN_GUIDE.md`, section 9).
