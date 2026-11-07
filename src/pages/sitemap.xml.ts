/**
 * sitemap.xml with hreflang alternates, built from the route table.
 * (@astrojs/sitemap can't pair pages whose Spanish address differs from the
 * English one, such as /about/ and /es/acerca-de/.)
 */
import type { APIRoute } from 'astro';
import { langs, routeKeys, routes, type Alternates, type Lang } from '../i18n/routes';
import { entryAlternates, getNews, getPrograms, hasTranslation, type Section } from '../lib/content';
import { absoluteUrl } from '../lib/seo';

type SitemapEntry = { loc: string; alternates: Alternates | null };

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async ({ site }) => {
  const entries: SitemapEntry[] = [];

  for (const key of routeKeys) {
    for (const lang of langs) entries.push({ loc: routes[key][lang], alternates: { ...routes[key] } });
  }

  for (const section of ['programs', 'news'] as Section[]) {
    for (const lang of langs as Lang[]) {
      const list = section === 'programs' ? await getPrograms(lang) : await getNews(lang);
      for (const entry of list) {
        const alternates = await entryAlternates(section, lang, entry);
        entries.push({ loc: alternates[lang], alternates: hasTranslation(section, lang, alternates) ? alternates : null });
      }
    }
  }

  const body = entries
    .map(({ loc, alternates }) => {
      const links = alternates
        ? [
            ...langs.map((code) => `    <xhtml:link rel="alternate" hreflang="${code}" href="${escapeXml(absoluteUrl(alternates[code], site))}"/>`),
            `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(absoluteUrl(alternates.en, site))}"/>`,
          ].join('\n')
        : '';
      return `  <url>\n    <loc>${escapeXml(absoluteUrl(loc, site))}</loc>${links ? `\n${links}` : ''}\n  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
