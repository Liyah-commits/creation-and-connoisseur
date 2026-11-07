# Spanish review

Every file that contains Spanish the public will read. It needs review by a Spanish-speaking team member before launch. Tick each box only after reading the whole file on the built site, not just in the editor.

**Reset on 6 November 2026.** The content batch (decision D38) and the switch to usted (D25) changed every Spanish file, so every box is unchecked, including any that had been reviewed before. Files marked **changed** were edited or created on that date.

**Reviewer:** _______________________  **Date signed off:** _______________

## Before you start

- **Register:** neutral US Latin American Spanish, using **usted** throughout ("Envíenos un mensaje", "Si usted o su familia necesitan alimentos…", "Únase al club"). The site was first written in tú. Every tú form was replaced, and a search of every Spanish file for tú forms came back clean. Flag any that remain.
- **Gender-neutral phrasing** is used where Spanish would otherwise force a gender: "Haga voluntariado", "Pertenece a Aryah Certain, quien también la dirige", "Persona anfitriona de Noche Cultural", "la persona coordinadora de voluntarios". Aryah's title, "Fundadora y Presidenta", is as supplied. Confirm these read naturally.
- **Names stay in English:** "Creation and Connoisseur", "UNLV Food Tasting Club", "Three Square Food Bank", "Nevada 211", "Access Nevada".
- **The pantry is planned, not running.** Every Spanish mention of the despensa móvil must say it's planned or expected for 2027 ("prevista para 2027", "que planeamos", "llevaría"), never that it already operates or is guaranteed, and must not mention Rotary or partners. Check this in the mission, the About story, the club and pantry programs, Get Help, the Pantry team role and Aryah's bio.
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
| Biweekly Volunteering | Voluntariado Quincenal |
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

- [ ] `content/es/pages/home.md`: Inicio (`/es/`)
- [ ] `content/es/pages/about.md`: Quiénes somos (`/es/acerca-de/`). **Changed:** story from the batch, figures removed, pantry planned; usted description.
- [ ] `content/es/pages/programs.md`: Programas (`/es/programas/`)
- [ ] `content/es/pages/getHelp.md`: Obtener ayuda (`/es/obtener-ayuda/`). **Changed:** new text from the batch, four resource links, pantry planned. Check especially for plain, friendly language.
- [ ] `content/es/pages/volunteer.md`: Voluntariado (`/es/voluntariado/`). **Changed:** new introduction and five roles. Role names and commitments were translated during loading.
- [ ] `content/es/pages/donate.md`: Donar (`/es/donar/`). **Changed:** usted.
- [ ] `content/es/pages/news.md`: Noticias (`/es/noticias/`)
- [ ] `content/es/pages/contact.md`: Contáctenos (`/es/contacto/`). **Changed:** title, search result description and introduction switched to usted ("Contáctanos" became "Contáctenos", and "Comunícate" became "Comuníquese").
- [ ] `content/es/pages/accessibility.md`: Declaración de accesibilidad (`/es/accesibilidad/`). **Changed:** new text from the batch.
- [ ] `content/es/pages/privacy.md`: Política de privacidad (`/es/privacidad/`). **Changed:** new text from the batch. Needs legal review too (`docs/OPEN_ITEMS.md`, item 18).

## Programs (`content/es/programs/`, published 7 November 2026)

- [ ] `content/es/programs/unlv-food-tasting-club.md`: UNLV Food Tasting Club. **Changed (new).**
- [ ] `content/es/programs/voluntariado-quincenal.md`: Voluntariado Quincenal. **Changed (new).**
- [ ] `content/es/programs/despensa-movil-de-alimentos.md`: Despensa Móvil de Alimentos (prevista para 2027). **Changed (new).**

## People

- [ ] `content/people/aryah-certain.yaml`: `roleEs` and `bioEs`. **Changed (new; published 7 November 2026).** The last sentence of the bio was revised to "…y la despensa móvil de alimentos que está en planificación".

## Interface text

- [ ] `src/i18n/ui.ts`: every button, label, menu item, form message, error message, footer line and screen-reader-only text. Each entry shows the English (`en:`) next to the Spanish (`es:`). **Changed:** usted throughout, and new strings for the Get Help form. Read the form messages in context by submitting each form empty and then complete, on `/es/contacto/`, `/es/voluntariado/` and `/es/obtener-ayuda/`.
- [ ] `src/i18n/routes.ts`: the Spanish addresses (`acerca-de`, `programas`, `obtener-ayuda`, `voluntariado`, `donar`, `noticias`, `contacto`, `accesibilidad`, `privacidad`). Changing one after launch needs a redirect, so confirm them now.
- [ ] `src/pages/404.astro`: the Spanish half of the "page not found" page (open any wrong address, like `/es/no-existe/`). Checked for tú forms during the switch; it had none.

## Organization text

- [ ] `content/settings.yaml`: `missionEs` (the mission, rewritten so the pantry is planned), `taglineEs` (the tagline, also used for social bios), `unlvStatementEs` (the relationship to UNLV, shown in every footer) and `descriptionEs` (search results and social previews). **Changed.**

## Template examples (never published)

These are drafts used only by the test build, but they show editors what good Spanish entries look like, so they should read well.

- [ ] `content/es/programs/programa-de-ejemplo.md`
- [ ] `content/es/news/noticia-de-ejemplo.md`
- [ ] `content/people/example-person-with-photo.yaml` and `content/people/example-person-without-photo.yaml` (the `roleEs`, `bioEs` and `altEs` fields)
- [ ] `tests/fixtures/settings.template.yaml`: `missionEs`, `taglineEs` and `unlvStatementEs` (fake text for tests). **Changed.**

## Editor screens (optional)

- [ ] `keystatic.config.ts`: the Spanish collection names in the editor menu ("Páginas", "Programas", "Noticias"). The editor itself is in English.

## Adding Spanish later

Whenever a Spanish page, program, news post or person is added or changed, a Spanish speaker should review it before **Hide from the live site** is unticked. Add new files to this list, and uncheck any file that changes.
