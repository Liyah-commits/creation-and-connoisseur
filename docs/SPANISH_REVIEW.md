# Spanish review

Every file that contains Spanish the public will read. It needs review by a Spanish-speaking team member before launch. Tick each box only after reading the whole file on the built site, not just in the editor.

**Reset on 6 November 2026.** The content batch (decision D38) and the switch to usted (D25) changed every Spanish file, so every box is unchecked, including any that had been reviewed before. Files marked **changed** were edited or created on that date.

**Updated 9 November 2026.** The photos, stats, board, news and contact batch (decisions D46 to D53) added or changed the files marked **Changed 9 November 2026**. Their boxes are unchecked, and any that had been ticked are unticked again.

**Reviewer:** _______________________  **Date signed off:** _______________

## Before you start

- **Register:** neutral US Latin American Spanish, using **usted** throughout ("Envíenos un mensaje", "Si usted o su familia necesitan alimentos…", "Únase al club"). The site was first written in tú. Every tú form was replaced, and a search of every Spanish file for tú forms came back clean. Flag any that remain.
- **Gender-neutral phrasing** is used where Spanish would otherwise force a gender: "Haga voluntariado", "Pertenece a Aryah Certain, quien también la dirige", "Persona anfitriona de Noche Cultural", "la persona coordinadora de voluntarios". Aryah's title, "Fundadora y Presidenta", is as supplied. Confirm these read naturally.
- **Club board titles are gendered, as supplied** (D51). Each Spanish title follows that person's supplied Spanish photo description ("Zau, organizador de eventos", "Joy, secretaria", "Jaziel, fotógrafo"). Confirm each one with the person before ticking the People files.
- **Photo descriptions (alt text) were supplied in both languages** with the photos and are used word for word (D46). If one needs changing, tell Aryah, so the English and Spanish stay in step and the source files match.
- **Names stay in English:** "Creation and Connoisseur", "UNLV Food Tasting Club", "Three Square Food Bank", "Olive Crest", "Nevada 211", "Access Nevada", and event and restaurant names ("Taste of the Philippines", "Thai Night", "Down By The Bayou", "Tina's Filipino Cuisine", "Chao Thai"). The film is given its US Latin American title, *La princesa y el sapo*.
- **The pantry is planned, not running.** Every Spanish mention of the despensa móvil must say it's planned or expected for 2027 ("prevista para 2027", "que planeamos", "llevaría"), never that it already operates or is guaranteed, and must not name any outside organization or partner. Check this in the mission, the About story, the club and pantry programs, Get Help, the Pantry team role and Aryah's bio.
- **Same facts as the English:** the Spanish must say no more and no less than the English version of each page.
- **How to see it:** run `pnpm build:test && pnpm serve` and open `http://localhost:4321/es/`. Spanish pages are under `/es/`. The programs and Aryah's bio were published on 7 November 2026, so they're live content: review them first.

### Key terms to confirm

| English | Spanish used |
|---|---|
| food insecurity | inseguridad alimentaria |
| 501(c)(3) nonprofit | organización sin fines de lucro 501(c)(3) |
| mobile food pantry (planned for 2027) | despensa móvil de alimentos (prevista para 2027) |
| food support | apoyo con alimentos |
| food bank | banco de alimentos |
| SNAP (food stamps) | SNAP (cupones de alimentos) |
| Get help | Obtener ayuda |
| Volunteer (page) / volunteering | Voluntariado / hacer voluntariado |
| Volunteer Days (was Biweekly Volunteering) | Jornadas de Voluntariado (was Voluntariado Quincenal) |
| volunteer day | jornada de voluntariado |
| Volunteer with us (Home button) | Sea voluntario |
| Club mission | Misión del club |
| UNLV Food Tasting Club board | Junta del UNLV Food Tasting Club |
| Club life | La vida en el club |
| Favorite food | Comida favorita |
| Our work in numbers (stats strip, screen readers only) | Nuestro trabajo en cifras |
| Photos | Fotos |
| Culture Night | Noche Cultural |
| partner organization | organización aliada |
| About (us) | Quiénes somos |
| Donate | Donar |
| (required) / (optional) | (obligatorio) / (opcional) |
| Email address | Correo electrónico |
| two business days | dos días hábiles |
| Accessibility statement | Declaración de accesibilidad |
| Privacy policy | Política de privacidad |
| board members | miembros de la junta directiva |
| Skip to main content | Saltar al contenido principal |
| Donation link coming soon | Enlace para donar próximamente |

## Pages (`content/es/pages/`)

Each file holds the page title, the search result description, the introduction and the main text.

- [ ] `content/es/pages/home.md`: Inicio (`/es/`). **Changed 9 November 2026 (D54):** the introduction is now Aryah's hero line, "Celebramos las culturas que forman Nevada y trabajamos para que nadie pase hambre."
- [ ] `content/es/pages/about.md`: Quiénes somos (`/es/acerca-de/`). **Changed:** story from the batch, figures removed, pantry planned; usted description. **Changed 9 November 2026:** "Cada dos semanas" removed from the second paragraph (D48). The page also shows the new club board and club life sections (see People and Organization text).
- [ ] `content/es/pages/programs.md`: Programas (`/es/programas/`)
- [ ] `content/es/pages/getHelp.md`: Obtener ayuda (`/es/obtener-ayuda/`). **Changed:** new text from the batch, four resource links, pantry planned. Check especially for plain, friendly language. **Changed 9 November 2026 (D56):** "o escriba a info@creationandconnoisseur.org" replaces the pointer to the Contact page's email.
- [ ] `content/es/pages/volunteer.md`: Voluntariado (`/es/voluntariado/`). **Changed:** new introduction and five roles. Role names and commitments were translated during loading. **Changed 9 November 2026:** the Service volunteer role says "una jornada de voluntariado" instead of "un turno quincenal" (D48).
- [ ] `content/es/pages/donate.md`: Donar (`/es/donar/`). **Changed:** usted. **Changed 9 November 2026 (D60):** new introduction ("Cada donación apoya el trabajo contra la inseguridad alimentaria en UNLV y en todo Las Vegas.") and new main text: "Lo que apoya su donación" (the three programs, each linked) and "Otras formas de ayudar" (voluntariado; alianzas, alimentos o suministros por correo electrónico).
- [ ] `content/es/pages/news.md`: Noticias (`/es/noticias/`)
- [ ] `content/es/pages/contact.md`: Contáctenos (`/es/contacto/`). **Changed:** title, search result description and introduction switched to usted ("Contáctanos" became "Contáctenos", and "Comunícate" became "Comuníquese"). **Changed 9 November 2026:** new main text, the UNLV Food Tasting Club email line, shown under "Otras formas de comunicarse con nosotros" (D52).
- [ ] `content/es/pages/accessibility.md`: Declaración de accesibilidad (`/es/accesibilidad/`). **Changed:** new text from the batch. **Changed 9 November 2026 (D56):** "Escriba a info@creationandconnoisseur.org" replaces the pointer to the Contact page's email.
- [ ] `content/es/pages/privacy.md`: Política de privacidad (`/es/privacidad/`). **Changed:** new text from the batch. Needs legal review too (`docs/OPEN_ITEMS.md`, item 18). **Changed 9 November 2026 (D56):** "escríbanos a info@creationandconnoisseur.org" and "Escriba a info@creationandconnoisseur.org" give the address directly; the date is now "9 de noviembre de 2026". **Changed again (D60):** new section "Donaciones" (Zeffy processes donations; what Zeffy receives and what we receive). The date stays "9 de noviembre de 2026". **Changed again (D61):** "política de privacidad" in the Donaciones section now links to Zeffy's policy, followed by "(en inglés)", because the page has no Spanish version.

## Programs (`content/es/programs/`, published 7 November 2026)

- [ ] `content/es/programs/unlv-food-tasting-club.md`: UNLV Food Tasting Club. **Changed (new).** **Changed 9 November 2026:** "Misión del club" (translated from the club's English mission), the club email line, a main photo and two more photos with supplied descriptions. **Changed again (D54):** the short summary, shown as the page introduction and on the card, is now "Noches culturales que celebran las culturas que forman Nevada." (supplied). **Changed again (D58):** the main photo is now the mariachi group (supplied description), and the extra photos are down to one.
- [ ] `content/es/programs/jornadas-de-voluntariado.md`: Jornadas de Voluntariado (`/es/programas/jornadas-de-voluntariado/`). **Changed 9 November 2026:** renamed from `voluntariado-quincenal.md` ("Voluntariado Quincenal"), new name, summary and schedule line (supplied), "Cada dos semanas" removed, partners line added, photo added (D48). **Changed again (D56):** the photo is now the volunteering photo, with its supplied description ("Una voluntaria entrega una bolsa de comestibles…").
- [ ] `content/es/programs/despensa-movil-de-alimentos.md`: Despensa Móvil de Alimentos (prevista para 2027). **Changed (new).** **Changed 9 November 2026 (D58):** photo added, with its supplied description.

## News (`content/es/news/`, published 9 November 2026)

All **Changed 9 November 2026 (new)**. Each has two paragraphs written from `photos-inbox/FACTS.md`, a summary, and photo descriptions as supplied.

- [ ] `content/es/news/taste-of-the-philippines.md`: Taste of the Philippines (22 de octubre de 2026)
- [ ] `content/es/news/voluntariado-en-three-square.md`: Voluntariado en Three Square: más de 100 familias alimentadas en dos horas (6 de noviembre de 2026). **Changed 9 November 2026 (D58):** photo added, with its supplied description.
- [ ] `content/es/news/thai-night.md`: Thai Night (2 de abril de 2026)
- [ ] `content/es/news/down-by-the-bayou.md`: Down By The Bayou alcanza su capacidad máxima (23 de octubre de 2025)

## People

- [ ] Club board, **Changed 9 November 2026 (new)**: `roleEs` and `bioEs` ("Comida favorita: …") in `content/people/aryah.yaml`, `mya.yaml`, `joy.yaml`, `priya.yaml`, `zau.yaml`, `katelyn.yaml`, `emily.yaml`, `george.yaml` and `jaziel.yaml`. Check the food names read naturally ("sándwich po'boy de camarón", "pollo mochiko con poke de atún ahi picante").
- [ ] `content/people/aryah-certain.yaml`: `roleEs` and `bioEs`. **Changed (new; published 7 November 2026).** The last sentence of the bio was revised to "…y la despensa móvil de alimentos que está en planificación". **Changed 9 November 2026 (D54):** the membership named in the second sentence was removed; it now reads "es fundadora de dos empresas locales".

## Interface text

- [ ] `src/i18n/ui.ts`: every button, label, menu item, form message, error message, footer line and screen-reader-only text. Each entry shows the English (`en:`) next to the Spanish (`es:`). **Changed:** usted throughout, and new strings for the Get Help form. Read the form messages in context by submitting each form empty and then complete, on `/es/contacto/`, `/es/voluntariado/` and `/es/obtener-ayuda/`. **Changed 9 November 2026:** new strings `home.statsHeading`, `about.clubBoardHeading`, `about.clubLifeHeading` and `entry.galleryHeading`. **Changed again (D55):** new string `home.volunteerCta`, "Sea voluntario", the Home page's primary button, as worded in Aryah's redesign brief. It's masculine, unlike the neutral phrasing elsewhere (D25, for example "Haga voluntariado"), so confirm it or suggest a neutral alternative such as "Haga voluntariado con nosotros". **Changed again (D60):** `donate.button` is now "Done ahora"; new strings `donate.giftNote` ("Se aceptan donaciones únicas y mensuales, y Zeffy le envía automáticamente un recibo fiscal por correo electrónico."), `footer.taxLine` and `donate.deductible` (the tax line, word for word from `FACTS.md`: "Creation and Connoisseur es una organización sin fines de lucro 501(c)(3), EIN 93-2889729. Las donaciones son deducibles de impuestos en la medida en que lo permita la ley.").
- [ ] `src/i18n/routes.ts`: the Spanish addresses (`acerca-de`, `programas`, `obtener-ayuda`, `voluntariado`, `donar`, `noticias`, `contacto`, `accesibilidad`, `privacidad`). Changing one after launch needs a redirect, so confirm them now.
- [ ] `src/pages/404.astro`: the Spanish half of the "page not found" page (open any wrong address, like `/es/no-existe/`). Checked for tú forms during the switch; it had none.

## Organization text

- [ ] `content/settings.yaml`: `missionEs` (the mission, rewritten so the pantry is planned), `taglineEs` (the tagline, also used for social bios), `unlvStatementEs` (the relationship to UNLV, shown in every footer) and `descriptionEs` (search results and social previews). **Changed.** **Changed 9 November 2026:** `missionEs` is now "Creation and Connoisseur combate la inseguridad alimentaria en UNLV y en todo Las Vegas.", with no pantry wording (D53).
- [ ] `content/highlights.yaml` (Shared > Photos and stats): the stats and the photo descriptions (`altEs`, supplied). **Changed again (D58):** new `altEs` for the seven page header photos, the three Home card photos, the two Home spare photos and the club life photos (all supplied, word for word). **Changed again (D56):** new volunteering photo description (`volunteerPhoto.altEs`, supplied). **Changed 9 November 2026 (new).** **Changed again (D54):** the stats are now "1,000+ personas alimentadas", "100+ familias alimentadas" and "Cientos de estudiantes en noches culturales" (`valueEs` "Cientos", all supplied).

## Template examples (never published)

These are drafts used only by the test build, but they show editors what good Spanish entries look like, so they should read well.

- [ ] `content/es/programs/programa-de-ejemplo.md`
- [ ] `content/es/news/noticia-de-ejemplo.md`
- [ ] `content/people/example-person-without-photo.yaml` (the `roleEs` and `bioEs` fields). The example person with a photo was removed on 9 November 2026: people have no photo field now (D58).
- [ ] `tests/fixtures/settings.template.yaml`: `missionEs`, `taglineEs` and `unlvStatementEs` (fake text for tests). **Changed.**

## Editor screens (optional)

- [ ] `keystatic.config.ts`: the Spanish collection names in the editor menu ("Páginas", "Programas", "Noticias"). The editor itself is in English.

## Adding Spanish later

Whenever a Spanish page, program, news post or person is added or changed, a Spanish speaker should review it before **Hide from the live site** is unticked. Add new files to this list, and uncheck any file that changes.

No interface strings were added on 9 November 2026 for the photo changes (D58): every new Spanish text is a supplied photo description.

Since D61, every link to another site in page text gets "(lo lleva a un sitio externo)" for screen readers automatically (the `donate.leavesSite` string in `src/i18n/ui.ts`). Listen for it with a screen reader on the Spanish Get Help and privacy pages.
