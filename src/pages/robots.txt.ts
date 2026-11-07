import type { APIRoute } from 'astro';
import { absoluteUrl } from '../lib/seo';

/** robots.txt: everything public is crawlable; the CMS admin and its API are not. */
export const GET: APIRoute = ({ site }) =>
  new Response(
    ['User-agent: *', 'Allow: /', 'Disallow: /keystatic/', 'Disallow: /api/', '', `Sitemap: ${absoluteUrl('/sitemap.xml', site)}`, ''].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
