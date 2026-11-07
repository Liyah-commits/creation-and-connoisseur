/**
 * Broken-link check on the built site, using linkinator.
 *
 * 1. Internal links (strict): starts from every page in the sitemap, follows
 *    every same-site link, checks #fragments, and treats any redirect as a
 *    failure, so a link written without its trailing slash is caught.
 * 2. External links: each one is requested once. A failure is reported as a
 *    warning, because outside sites can be briefly down or block automated
 *    requests; set STRICT_EXTERNAL_LINKS=1 to make them fail the run.
 *
 * Writes reports/<build>/links.json. Run through scripts/with-server.mjs
 * (`pnpm test:links` does this).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { check, LinkState } from 'linkinator';
import { BASE_URL, sitemapUrls } from './site-urls.mjs';

const base = new URL(BASE_URL).origin;
const isInternal = (link) => new URL(link, base).origin === base;
const external = new Map();

const internal = await check({
  path: sitemapUrls(),
  recurse: true,
  checkFragments: true,
  redirects: 'error',
  concurrency: 20,
  timeout: 15000,
  linksToSkip: async (link) => {
    if (!/^https?:/i.test(link)) return true;
    if (isInternal(link)) return false;
    if (!external.has(link)) external.set(link, null);
    return true;
  },
});

const internalChecked = internal.links.filter((l) => l.state !== LinkState.SKIPPED);
const internalBroken = internal.links.filter((l) => l.state === LinkState.BROKEN);

async function probe(url) {
  const attempt = async (method) => {
    const response = await fetch(url, { method, redirect: 'follow', signal: AbortSignal.timeout(15000), headers: { 'User-Agent': 'Mozilla/5.0 (link check; Creation and Connoisseur website)' } });
    return response.status;
  };
  try {
    let status = await attempt('HEAD');
    if (status === 405 || status === 403 || status === 404) status = await attempt('GET');
    return { url, status, ok: status < 400 };
  } catch (error) {
    return { url, status: 0, ok: false, error: String(error?.cause?.code ?? error?.message ?? error) };
  }
}

const externalResults = await Promise.all([...external.keys()].map(probe));
const externalBroken = externalResults.filter((r) => !r.ok);

const report = {
  date: new Date().toISOString(),
  base,
  internal: { checked: internalChecked.length, broken: internalBroken.map(({ url, status, parent }) => ({ url, status, parent })) },
  external: { checked: externalResults.length, broken: externalBroken, results: externalResults },
};
const dir = `reports/${process.env.BUILD_NAME ?? 'local'}`;
mkdirSync(dir, { recursive: true });
writeFileSync(`${dir}/links.json`, JSON.stringify(report, null, 2));

console.log(`Internal links checked: ${internalChecked.length}, broken: ${internalBroken.length}`);
for (const link of internalBroken) console.log(`  BROKEN ${link.status ?? ''} ${link.url}  (on ${link.parent})`);
console.log(`External links checked: ${externalResults.length}, failed: ${externalBroken.length}`);
for (const link of externalResults) console.log(`  ${link.ok ? 'ok ' : 'FAIL'} ${link.status} ${link.url}${link.error ? ` (${link.error})` : ''}`);

const strictExternal = process.env.STRICT_EXTERNAL_LINKS === '1';
if (internalBroken.length || (strictExternal && externalBroken.length)) process.exit(1);
if (externalBroken.length) console.warn('External link failures are warnings. Set STRICT_EXTERNAL_LINKS=1 to fail on them.');
