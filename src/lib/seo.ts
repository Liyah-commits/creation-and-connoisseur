/**
 * Search and sharing metadata: absolute URLs, page titles and the
 * Organization / NGO structured data.
 */
import type { Lang } from '../i18n/routes';
import { routes } from '../i18n/routes';
import type { Settings } from './content';

export const SITE_NAME = 'Creation and Connoisseur';

export function absoluteUrl(path: string, site: URL | undefined): string {
  if (!site) throw new Error('`site` is not set in astro.config.mjs');
  return new URL(path, site).href;
}

/** "Page title | Creation and Connoisseur", or just the name on the home page. */
export function documentTitle(title: string, isHome: boolean): string {
  if (isHome || title === SITE_NAME) return SITE_NAME;
  return `${title} | ${SITE_NAME}`;
}

/**
 * Organization and NGO structured data (schema.org). Only facts that have been
 * supplied are included: EIN, email, founding year and social profiles appear
 * once they are entered in Site settings.
 */
export function organizationJsonLd(settings: Settings, lang: Lang, site: URL | undefined) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'NGO'],
    '@id': absoluteUrl('/#organization', site),
    name: SITE_NAME,
    url: absoluteUrl(routes.home[lang], site),
    logo: absoluteUrl('/og-image.png', site),
    description: lang === 'en' ? settings.descriptionEn : settings.descriptionEs,
    nonprofitStatus: 'Nonprofit501c3',
  };
  if (settings.legalName) data.legalName = settings.legalName;
  if (settings.ein) data.taxID = settings.ein;
  if (settings.email) data.email = settings.email;
  if (settings.phone) data.telephone = settings.phone;
  if (settings.foundingYear) data.foundingDate = String(settings.foundingYear);
  if (settings.socialLinks.length) data.sameAs = settings.socialLinks.map((link) => link.url);
  return data;
}

/** Serialize JSON for a <script type="application/ld+json"> block without allowing "</script>" to break out. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
