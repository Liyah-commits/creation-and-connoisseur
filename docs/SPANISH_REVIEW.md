# Spanish review

Every file that contains Spanish the public will read. All of it was drafted for this rebuild (not machine-translated) and needs review by a Spanish-speaking team member before launch. Tick each box only after reading the whole file on the built site, not just in the editor.

**Reviewer:** _______________________  **Date signed off:** _______________

## Before you start

- **Register:** neutral US Latin American Spanish, using **tú** throughout ("Envíanos un mensaje", "Si te preocupa…"). Confirm this is right for UNLV students, or say if **usted** is preferred (decision D25; `docs/OPEN_ITEMS.md`, item 25).
- **Gender-neutral phrasing** was used where Spanish would otherwise force a gender: "Haz voluntariado" (not "Hazte voluntario"), "Pertenece a Aryah Certain, quien también la dirige" for "owned and run by Aryah Certain", "las personas que editan el sitio". Confirm these read naturally.
- **The organization's name stays in English** ("Creation and Connoisseur"), as a proper noun.
- **Facts:** the Spanish must say no more than the English. The only organization facts on the site are the name, the 501(c)(3) status, the focus on food insecurity at UNLV, and that Aryah Certain owns and runs it.
- **How to see it:** run `pnpm build:templates && pnpm serve` and open `http://localhost:4321/es/`, or use a Vercel preview address. Spanish pages are under `/es/`.

### Key terms to confirm

| English | Spanish used |
|---|---|
| food insecurity | inseguridad alimentaria |
| 501(c)(3) nonprofit | organización sin fines de lucro 501(c)(3) |
| food support | apoyo con alimentos |
| Get help | Obtener ayuda |
| Volunteer (page) / volunteering | Voluntariado / hacer voluntariado |
| About (us) | Quiénes somos |
| Donate | Donar |
| (required) / (optional) | (obligatorio) / (opcional) |
| Email address | Correo electrónico |
| Accessibility statement | Declaración de accesibilidad |
| Privacy policy | Política de privacidad |
| Skip to main content | Saltar al contenido principal |
| Donation link coming soon | Enlace para donar próximamente |

## Pages (`content/es/pages/`)

Each file holds the page title, the search result description, the introduction and the main text.

- [ ] `content/es/pages/home.md`: Inicio (`/es/`)
- [ ] `content/es/pages/about.md`: Quiénes somos (`/es/acerca-de/`)
- [ ] `content/es/pages/programs.md`: Programas (`/es/programas/`)
- [ ] `content/es/pages/getHelp.md`: Obtener ayuda (`/es/obtener-ayuda/`). Check especially for plain, friendly language.
- [ ] `content/es/pages/volunteer.md`: Voluntariado (`/es/voluntariado/`)
- [ ] `content/es/pages/donate.md`: Donar (`/es/donar/`)
- [ ] `content/es/pages/news.md`: Noticias (`/es/noticias/`)
- [ ] `content/es/pages/contact.md`: Contáctanos (`/es/contacto/`)
- [ ] `content/es/pages/accessibility.md`: Declaración de accesibilidad (`/es/accesibilidad/`)
- [ ] `content/es/pages/privacy.md`: Política de privacidad (`/es/privacidad/`). Needs legal review too (`docs/OPEN_ITEMS.md`, item 18).

## Interface text

- [ ] `src/i18n/ui.ts`: every button, label, menu item, form message, error message, footer line and screen-reader-only text. Each entry shows the English (`en:`) next to the Spanish (`es:`). Read the form messages in context by submitting the forms empty and then complete, on `/es/contacto/` and `/es/voluntariado/`.
- [ ] `src/i18n/routes.ts`: the Spanish addresses (`acerca-de`, `programas`, `obtener-ayuda`, `voluntariado`, `donar`, `noticias`, `contacto`, `accesibilidad`, `privacidad`). Changing one after launch needs a redirect, so confirm them now.
- [ ] `src/pages/404.astro`: the Spanish half of the "page not found" page (open any wrong address, like `/es/no-existe/`).

## Organization text

- [ ] `content/settings.yaml`: `descriptionEs`, the one-sentence description used in search results and social media previews. When the mission is supplied, `missionEs` must be reviewed here too.

## Template examples (never published)

These are drafts used only by the test build, but they show editors what good Spanish entries look like, so they should read well.

- [ ] `content/es/programs/programa-de-ejemplo.md`
- [ ] `content/es/news/noticia-de-ejemplo.md`
- [ ] `content/people/example-person-with-photo.yaml` and `content/people/example-person-without-photo.yaml` (the `roleEs`, `bioEs` and `altEs` fields)
- [ ] `tests/fixtures/settings.template.yaml`: `missionEs` (fake text for tests)

## Editor screens (optional)

- [ ] `keystatic.config.ts`: the Spanish collection names in the editor menu ("Páginas", "Programas", "Noticias"). The editor itself is in English.

## Adding Spanish later

Whenever a Spanish page, program, news post or person is added or changed, a Spanish speaker should review it before **Hide from the live site** is unticked. Add new files to this list.
