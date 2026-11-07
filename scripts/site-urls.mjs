/**
 * The list of pages to test, read from the built sitemap so that every page in
 * both languages is covered and a new page can't be missed.
 * Used by Playwright, pa11y-ci and Lighthouse CI.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const BASE_URL = process.env.TEST_BASE_URL ?? 'http://localhost:4321';

/** Root-relative paths of every page in the sitemap, e.g. ["/", "/es/", "/about/", ...]. */
export function sitemapPaths() {
  const file = resolve('.vercel/output/static/sitemap.xml');
  let xml;
  try {
    xml = readFileSync(file, 'utf8');
  } catch {
    throw new Error(`No sitemap at ${file}. Run a build first (pnpm build:test or pnpm build:templates).`);
  }
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
  if (paths.length === 0) throw new Error('The sitemap has no <loc> entries.');
  return [...new Set(paths)];
}

export function sitemapUrls() {
  return sitemapPaths().map((path) => new URL(path, BASE_URL).href);
}

// `node scripts/site-urls.mjs` prints the list.
if (import.meta.url === `file://${process.argv[1]}`) {
  for (const url of sitemapUrls()) console.log(url);
}
