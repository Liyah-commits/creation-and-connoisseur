/**
 * The route table: every fixed page and its address in each language.
 *
 * Spanish pages have Spanish addresses (/es/acerca-de/, not /es/about/). The
 * language switch, hreflang links, the sitemap and the navigation all read
 * from this one table, so a page can't be linked in one place and missed in
 * another.
 */
export const languages = { en: 'English', es: 'Español' } as const;
export type Lang = keyof typeof languages;
export const langs = Object.keys(languages) as Lang[];
export const defaultLang: Lang = 'en';

/** BCP 47 tags for <html lang> and hreflang; Open Graph locales. */
export const htmlLang: Record<Lang, string> = { en: 'en', es: 'es' };
export const ogLocale: Record<Lang, string> = { en: 'en_US', es: 'es_US' };

export const routes = {
  home: { en: '/', es: '/es/' },
  about: { en: '/about/', es: '/es/acerca-de/' },
  programs: { en: '/programs/', es: '/es/programas/' },
  getHelp: { en: '/get-help/', es: '/es/obtener-ayuda/' },
  volunteer: { en: '/volunteer/', es: '/es/voluntariado/' },
  donate: { en: '/donate/', es: '/es/donar/' },
  news: { en: '/news/', es: '/es/noticias/' },
  contact: { en: '/contact/', es: '/es/contacto/' },
  accessibility: { en: '/accessibility/', es: '/es/accesibilidad/' },
  privacy: { en: '/privacy/', es: '/es/privacidad/' },
} as const satisfies Record<string, Record<Lang, `/${string}`>>;

export type RouteKey = keyof typeof routes;
export const routeKeys = Object.keys(routes) as RouteKey[];

/** Each language's addresses for one page: what the language switch and hreflang need. */
export type Alternates = Record<Lang, string>;

export function pathFor(key: RouteKey, lang: Lang): string {
  return routes[key][lang];
}

export function alternatesFor(key: RouteKey): Alternates {
  return { ...routes[key] };
}

/** The address of a program or news entry. */
export function entryPath(section: 'programs' | 'news', lang: Lang, slug: string): string {
  return `${routes[section][lang]}${slug}/`;
}

export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'es' : 'en';
}
