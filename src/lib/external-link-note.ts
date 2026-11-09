/**
 * A Sätteri hast plugin for page text written in Keystatic (D61). Every link
 * to another site gets the same screen-reader-only note the Donate button
 * uses, "(goes to an external site)" / "(lo lleva a un sitio externo)", in the
 * page's language, so people know a link leaves the site before following it.
 *
 * It runs at build time, so editors write an ordinary link and never see or
 * type HTML (Keystatic's editor would show raw HTML as text). Links within the
 * site are root-relative ("/donate/") and email links start with "mailto:",
 * so only absolute http(s) links are marked. The language comes from the
 * content file's folder (content/en/... or content/es/...).
 */
import type { satteri } from '@astrojs/markdown-satteri';
import { ui } from '../i18n/ui';

/** One entry of Sätteri's `hastPlugins` option (the `satteri` package's own types aren't a direct dependency). */
type HastPluginEntry = NonNullable<NonNullable<Parameters<typeof satteri>[0]>['hastPlugins']>[number];

const externalLinkNote: HastPluginEntry = (factory) => {
  const lang = /\/content\/es\//.test(factory.fileURL?.pathname ?? '') ? 'es' : 'en';
  const note = ` ${ui['donate.leavesSite'][lang]}`;
  return {
    name: 'external-link-note',
    element: {
      filter: ['a'],
      visit(node, ctx) {
        const href = node.properties?.href;
        if (typeof href !== 'string' || !/^https?:\/\//i.test(href)) return;
        ctx.appendChild(node, { type: 'element', tagName: 'span', properties: { className: ['sr-only'] }, children: [{ type: 'text', value: note }] });
      },
    },
  };
};

export default externalLinkNote;
