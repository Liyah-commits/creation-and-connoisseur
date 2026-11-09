// @ts-check
import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';
import { satteri } from '@astrojs/markdown-satteri';
import externalLinkNote from './src/lib/external-link-note.ts';

/**
 * The public site URL, used for canonical links, hreflang, the sitemap and
 * Open Graph. Resolved in this order, never guessed (see DECISIONS.md):
 *   1. SITE_URL (set this once the production domain is known)
 *   2. https:// + VERCEL_PROJECT_PRODUCTION_URL (set by Vercel on every deploy)
 *   3. http://localhost:4321 (local development and test builds)
 */
function resolveSite() {
  const explicit = process.env.SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, '');
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return 'http://localhost:4321';
}

/**
 * Keystatic's admin calls /api/keystatic/... and /keystatic/... without a
 * trailing slash. With trailingSlash: 'always' the dev server answers those
 * with 404, which breaks local editing. This dev-only Vite middleware adds the
 * slash for Keystatic paths before Astro sees the request. In production the
 * Vercel adapter already redirects slashless paths (308, which keeps the method
 * and query string). See DECISIONS.md.
 */
function keystaticDevTrailingSlash() {
  return {
    name: 'keystatic-dev-trailing-slash',
    enforce: /** @type {const} */ ('post'),
    apply: /** @type {const} */ ('serve'),
    /** @param {{ middlewares: { stack: Array<{ route: string; handle: Function }> } }} server */
    configureServer(server) {
      /**
       * @param {import('node:http').IncomingMessage} req
       * @param {import('node:http').ServerResponse} _res
       * @param {() => void} next
       */
      const addSlash = (req, _res, next) => {
        if (req.url && /^\/(api\/)?keystatic(\/|\?|$)/.test(req.url)) {
          const [path = '', query] = req.url.split('?');
          if (!path.endsWith('/')) req.url = `${path}/${query === undefined ? '' : `?${query}`}`;
        }
        next();
      };
      // Astro puts its own trailing-slash check at the front of the stack in a
      // post hook; this post hook runs after it, so this runs first.
      return () => {
        server.middlewares.stack.unshift({ route: '', handle: addSlash });
      };
    },
  };
}

export default defineConfig({
  site: resolveSite(),
  trailingSlash: 'always',
  output: 'static',
  // 301s for renamed pages (docs/REDIRECTS.md, D23). The volunteering program
  // was renamed on 9 November 2026 because its old name claimed a biweekly
  // schedule the record doesn't support (D48).
  redirects: {
    '/programs/biweekly-volunteering': { status: 301, destination: '/programs/volunteer-days/' },
    '/es/programas/voluntariado-quincenal': { status: 301, destination: '/es/programas/jornadas-de-voluntariado/' },
  },
  adapter: vercel(),
  integrations: [react(), keystatic()],
  // Page text: Astro's default Markdown processor (Sätteri, same defaults) plus one plugin that
  // gives links to other sites a screen-reader note in the page's language (D61).
  markdown: { processor: satteri({ hastPlugins: [externalLinkNote] }) },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: false },
  },
  env: {
    schema: {
      FORMSPREE_FORM_ID: envField.string({ context: 'server', access: 'public', optional: true }),
      SHOW_DRAFTS: envField.boolean({ context: 'server', access: 'public', default: false }),
    },
  },
  vite: {
    plugins: [keystaticDevTrailingSlash(), tailwindcss()],
  },
});
