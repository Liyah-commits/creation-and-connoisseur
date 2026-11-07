/**
 * Search and sharing metadata: absolute URLs, page titles and the
 * Organization / NGO structured data.
 */
import type { Lang } from '../i18n/routes';
import { t } from '../i18n/ui';
import { routes } from '../i18n/routes';
import type { Settings } from './content';

export const SITE_NAME = 'Creation and Connoisseur';

export function absoluteUrl(path: string, site: URL | undefined): string {
  if (!site) throw new Error('`site` is not set in astro.config.mjs');
  return new URL(path, site).href;
}

/**
 * "Page title | Creation and Connoisseur". The home page gets
 * "Creation and Connoisseur | <tagline>" (from Site settings, or a fallback
 * description) in its own language, so
 * the English and Spanish home pages don't share a title. Program and news
 * pages add their section ("… | Programs | …", "… | Programas | …"), so an
 * entry whose name is the same in both languages still gets a unique title.
 */
export function documentTitle(title: string, isHome: boolean, lang: Lang, section?: string, tagline?: string): string {
  if (isHome) return `${SITE_NAME} | ${tagline?.replace(/\.$/, '') || t(lang, 'site.homeTitleSuffix')}`;
  if (section) return `${title} | ${section} | ${SITE_NAME}`;
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
  const tagline = lang === 'en' ? settings.taglineEn : settings.taglineEs;
  if (tagline) data.slogan = tagline;
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
