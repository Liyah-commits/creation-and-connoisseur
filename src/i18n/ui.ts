/**
 * Interface strings: every piece of text that is part of the site's design
 * rather than its content (buttons, labels, error messages, landmarks).
 *
 * `satisfies` makes the type checker (`pnpm check`) fail if any key is
 * missing its English or Spanish text. Spanish uses neutral US Latin American
 * Spanish in the "tú" register (see docs/SPANISH_REVIEW.md).
 */
import { routes, type Lang, type RouteKey } from './routes';

export const ui = {
  // Site
  'site.homeTitleSuffix': {
    en: 'Nonprofit focused on food insecurity at UNLV',
    es: 'Organización sin fines de lucro enfocada en la inseguridad alimentaria en UNLV',
  },

  // Header and navigation
  'skip.toMain': { en: 'Skip to main content', es: 'Saltar al contenido principal' },
  'nav.label': { en: 'Main', es: 'Principal' },
  'nav.menu': { en: 'Menu', es: 'Menú' },
  'nav.home': { en: 'Home', es: 'Inicio' },
  'nav.about': { en: 'About', es: 'Acerca de' },
  'nav.programs': { en: 'Programs', es: 'Programas' },
  'nav.getHelp': { en: 'Get help', es: 'Obtener ayuda' },
  'nav.volunteer': { en: 'Volunteer', es: 'Voluntariado' },
  'nav.donate': { en: 'Donate', es: 'Donar' },
  'nav.news': { en: 'News', es: 'Noticias' },
  'nav.contact': { en: 'Contact', es: 'Contacto' },
  'nav.accessibility': { en: 'Accessibility statement', es: 'Declaración de accesibilidad' },
  'nav.privacy': { en: 'Privacy policy', es: 'Política de privacidad' },
  'lang.label': { en: 'Language', es: 'Idioma' },
  'lang.switchTo': { en: 'Español', es: 'English' },
  'lang.switchHint': { en: 'Ver esta página en español', es: 'View this page in English' },

  // Footer
  'footer.label': { en: 'Site information', es: 'Información del sitio' },
  'footer.nonprofit': {
    en: 'Creation and Connoisseur is a 501(c)(3) nonprofit organization.',
    es: 'Creation and Connoisseur es una organización sin fines de lucro 501(c)(3).',
  },
  'footer.ein': { en: 'EIN', es: 'EIN (número de identificación fiscal)' },
  'footer.contactHeading': { en: 'Contact', es: 'Contacto' },
  'footer.contactForm': { en: 'Send us a message', es: 'Envíanos un mensaje' },
  'footer.socialHeading': { en: 'Follow us', es: 'Síguenos' },
  'footer.siteHeading': { en: 'About this site', es: 'Sobre este sitio' },
  'footer.copyright': { en: 'All rights reserved.', es: 'Todos los derechos reservados.' },

  // Contact details
  'contact.email': { en: 'Email', es: 'Correo electrónico' },
  'contact.phone': { en: 'Phone', es: 'Teléfono' },
  'contact.address': { en: 'Mailing address', es: 'Dirección postal' },
  'contact.detailsHeading': { en: 'Other ways to reach us', es: 'Otras formas de comunicarte con nosotros' },

  // Home
  'home.actionsHeading': { en: 'How you can take part', es: 'Cómo puedes participar' },
  'home.getHelpTitle': { en: 'Get help', es: 'Obtener ayuda' },
  'home.getHelpText': { en: 'Find out how to get food support.', es: 'Descubre cómo obtener apoyo con alimentos.' },
  'home.volunteerTitle': { en: 'Volunteer', es: 'Haz voluntariado' },
  'home.volunteerText': { en: 'Let us know you would like to give your time.', es: 'Cuéntanos que te gustaría donar tu tiempo.' },
  'home.donateTitle': { en: 'Donate', es: 'Donar' },
  'home.donateText': { en: 'Support the work against food insecurity at UNLV.', es: 'Apoya el trabajo contra la inseguridad alimentaria en UNLV.' },
  'home.programsHeading': { en: 'Programs', es: 'Programas' },
  'home.newsHeading': { en: 'Latest news', es: 'Noticias recientes' },
  'home.allPrograms': { en: 'See all programs', es: 'Ver todos los programas' },
  'home.allNews': { en: 'See all news', es: 'Ver todas las noticias' },

  // About
  'about.missionHeading': { en: 'Our mission', es: 'Nuestra misión' },
  'about.storyHeading': { en: 'Our story', es: 'Nuestra historia' },
  'about.peopleHeading': { en: 'Our people', es: 'Nuestro equipo' },

  // Programs and news
  'programs.empty': { en: 'No programs are listed yet. Please check back soon.', es: 'Todavía no hay programas publicados. Vuelve a visitarnos pronto.' },
  'programs.when': { en: 'When', es: 'Cuándo' },
  'programs.where': { en: 'Where', es: 'Dónde' },
  'programs.back': { en: 'All programs', es: 'Todos los programas' },
  'news.empty': { en: 'There are no news posts yet. Please check back soon.', es: 'Todavía no hay noticias publicadas. Vuelve a visitarnos pronto.' },
  'news.back': { en: 'All news', es: 'Todas las noticias' },
  'news.published': { en: 'Published', es: 'Publicado el' },
  'draft.badge': { en: 'Draft', es: 'Borrador' },
  'draft.notice': {
    en: 'Draft: this entry is hidden on the live site. It appears here only in the template test build.',
    es: 'Borrador: esta entrada está oculta en el sitio público. Solo aparece aquí en la versión de prueba de plantillas.',
  },

  // Donate
  'donate.button': { en: 'Donate online', es: 'Dona en línea' },
  'donate.comingSoon': { en: 'Donation link coming soon', es: 'Enlace para donar próximamente' },
  'donate.comingSoonNote': {
    en: 'Online donations are not available yet. This button will work once the donation link is ready.',
    es: 'Todavía no se pueden hacer donaciones en línea. Este botón funcionará cuando el enlace para donar esté listo.',
  },
  'donate.legalName': { en: 'Legal name', es: 'Nombre legal' },
  'donate.leavesSite': { en: '(goes to an external site)', es: '(te lleva a un sitio externo)' },

  // Forms
  'form.required': { en: '(required)', es: '(obligatorio)' },
  'form.optional': { en: '(optional)', es: '(opcional)' },
  'form.name': { en: 'Your name', es: 'Tu nombre' },
  'form.email': { en: 'Email address', es: 'Correo electrónico' },
  'form.phone': { en: 'Phone number', es: 'Número de teléfono' },
  'form.message': { en: 'Message', es: 'Mensaje' },
  'form.interests': { en: 'How would you like to help?', es: '¿Cómo te gustaría ayudar?' },
  'form.interestsHint': {
    en: 'Tell us what you enjoy doing and any skills you would like to share.',
    es: 'Cuéntanos qué te gusta hacer y qué habilidades te gustaría compartir.',
  },
  'form.availability': { en: 'When are you usually free?', es: '¿Cuándo sueles tener tiempo libre?' },
  'form.availabilityHint': {
    en: 'For example: weekday afternoons, or Saturday mornings.',
    es: 'Por ejemplo: entre semana por la tarde, o los sábados por la mañana.',
  },
  'form.emailHint': { en: 'For example: name@example.com', es: 'Por ejemplo: nombre@ejemplo.com' },
  'form.submitContact': { en: 'Send message', es: 'Enviar mensaje' },
  'form.submitVolunteer': { en: 'Send', es: 'Enviar' },
  'form.sending': { en: 'Sending…', es: 'Enviando…' },
  'form.requiredNote': {
    en: 'Fields marked (required) must be filled in.',
    es: 'Los campos marcados como (obligatorio) se deben completar.',
  },
  'form.notConnected': {
    en: 'This form is not connected yet, so messages sent with it will not reach anyone. Please check back soon.',
    es: 'Este formulario todavía no está conectado, así que los mensajes que envíes no le llegarán a nadie. Vuelve a visitarnos pronto.',
  },
  'form.notConnectedSubmit': {
    en: 'Your answers look complete, but nothing was sent because this form is not connected yet.',
    es: 'Tus respuestas están completas, pero no se envió nada porque este formulario todavía no está conectado.',
  },
  'form.errorSummary': {
    en: 'Please fix the highlighted fields and try again.',
    es: 'Corrige los campos señalados e inténtalo de nuevo.',
  },
  'form.errorPrefix': { en: 'Error:', es: 'Error:' },
  'form.errorNameMissing': { en: 'Enter your name.', es: 'Escribe tu nombre.' },
  'form.errorEmailMissing': { en: 'Enter your email address.', es: 'Escribe tu correo electrónico.' },
  'form.errorEmailInvalid': {
    en: 'Enter an email address in the format name@example.com.',
    es: 'Escribe un correo electrónico con el formato nombre@ejemplo.com.',
  },
  'form.errorMessageMissing': { en: 'Enter your message.', es: 'Escribe tu mensaje.' },
  'form.errorInterestsMissing': {
    en: 'Tell us how you would like to help.',
    es: 'Cuéntanos cómo te gustaría ayudar.',
  },
  'form.successContact': {
    en: 'Thank you. Your message has been sent.',
    es: 'Gracias. Tu mensaje se envió.',
  },
  'form.successVolunteer': {
    en: 'Thank you. Your details have been sent.',
    es: 'Gracias. Tus datos se enviaron.',
  },
  'form.failure': {
    en: 'Sorry, your message could not be sent. Please try again in a few minutes.',
    es: 'Lo sentimos, no se pudo enviar tu mensaje. Inténtalo de nuevo en unos minutos.',
  },
  'form.privacy': {
    en: 'We only use what you send us to reply to you.',
    es: 'Solo usamos lo que nos envías para responderte.',
  },
  'form.privacyLink': { en: 'Read our privacy policy', es: 'Lee nuestra política de privacidad' },
  'form.subjectContact': {
    en: 'Contact form: Creation and Connoisseur website',
    es: 'Formulario de contacto (español): sitio web de Creation and Connoisseur',
  },
  'form.subjectVolunteer': {
    en: 'Volunteer form: Creation and Connoisseur website',
    es: 'Formulario de voluntariado (español): sitio web de Creation and Connoisseur',
  },
  'form.honeypot': { en: 'Leave this field empty', es: 'Deja este campo vacío' },
} as const satisfies Record<string, Record<Lang, string>>;

export type UIKey = keyof typeof ui;

export function t(lang: Lang, key: UIKey): string {
  return ui[key][lang];
}

/** Navigation label for a route, from the dictionary. */
export function navLabel(lang: Lang, key: RouteKey): string {
  return ui[`nav.${key}` as UIKey][lang];
}

// Every route must have a navigation label. This line fails type checking if one is added without it.
export const _everyRouteHasALabel: Record<`nav.${keyof typeof routes}`, unknown> = ui;

export function formatDate(lang: Lang, date: Date): string {
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'es-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
