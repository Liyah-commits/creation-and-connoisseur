/**
 * Reading content: the one place pages get entries from, so the draft rule and
 * the missing-page guard apply everywhere.
 */
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { SHOW_DRAFTS } from 'astro:env/server';
import { entryPath, otherLang, routeKeys, routes, type Alternates, type Lang, type RouteKey } from '../i18n/routes';

export type PageEntry = CollectionEntry<'pagesEn'> | CollectionEntry<'pagesEs'>;
export type ProgramEntry = CollectionEntry<'programsEn'> | CollectionEntry<'programsEs'>;
export type NewsEntry = CollectionEntry<'newsEn'> | CollectionEntry<'newsEs'>;
export type Section = 'programs' | 'news';

const pageCollection = { en: 'pagesEn', es: 'pagesEs' } as const;
const sectionCollection = {
  programs: { en: 'programsEn', es: 'programsEs' },
  news: { en: 'newsEn', es: 'newsEs' },
} as const;

/**
 * A fixed page's editable content. Fails the build, loudly, if the entry is
 * missing, because a missing entry would otherwise ship an empty page.
 */
export async function getPage(lang: Lang, key: RouteKey): Promise<PageEntry> {
  const entry = await getEntry(pageCollection[lang], key);
  if (!entry) {
    throw new Error(
      `Missing required page: content/${lang}/pages/${key}.md\n` +
        `Every page in src/i18n/routes.ts needs an entry in both languages. ` +
        `Restore the file (git checkout content/${lang}/pages/${key}.md) or recreate it in Keystatic with the internal name "${key}".`,
    );
  }
  return entry;
}

/** Fails the build if any route lacks its page entry in either language. */
export async function assertAllPagesExist(): Promise<void> {
  for (const lang of ['en', 'es'] as const) {
    for (const key of routeKeys) await getPage(lang, key);
  }
}

/** Drafts are excluded from the production build. SHOW_DRAFTS=true (the template test build) includes them. */
export function isPublished(entry: { data: { draft: boolean } }): boolean {
  return SHOW_DRAFTS || !entry.data.draft;
}

export async function getPrograms(lang: Lang): Promise<ProgramEntry[]> {
  const entries = (await getCollection(sectionCollection.programs[lang], isPublished)) as ProgramEntry[];
  return entries.sort((a, b) => a.data.title.localeCompare(b.data.title, lang));
}

export async function getNews(lang: Lang): Promise<NewsEntry[]> {
  const entries = (await getCollection(sectionCollection.news[lang], isPublished)) as NewsEntry[];
  return entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/**
 * The language-switch targets for a program or news entry. A Spanish entry
 * names its English version; if an entry has no published counterpart, the
 * switch goes to the other language's list page instead.
 */
export async function entryAlternates(section: Section, lang: Lang, entry: ProgramEntry | NewsEntry): Promise<Alternates> {
  const alternates: Alternates = { ...routes[section], [lang]: entryPath(section, lang, entry.id) };

  if (lang === 'es') {
    const englishId = entry.data.englishVersion;
    if (englishId) {
      const english = await getEntry(sectionCollection[section].en, englishId);
      if (english && isPublished(english)) alternates.en = entryPath(section, 'en', english.id);
    }
  } else {
    const spanish = (await getCollection(sectionCollection[section].es, isPublished)).find(
      (candidate) => candidate.data.englishVersion === entry.id,
    );
    if (spanish) alternates.es = entryPath(section, 'es', spanish.id);
  }
  return alternates;
}

/** True when the entry has a published translation, rather than falling back to the other language's list page. */
export function hasTranslation(section: Section, lang: Lang, alternates: Alternates): boolean {
  return alternates[otherLang(lang)] !== routes[section][otherLang(lang)];
}

export async function getSettings() {
  const entry = await getEntry('settings', 'settings');
  if (!entry) throw new Error('Missing content/settings.yaml. Restore it from git or save Site settings in Keystatic.');
  return entry.data;
}

export type Settings = Awaited<ReturnType<typeof getSettings>>;

export async function getPeople() {
  const people = await getCollection('people');
  return people.sort((a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name));
}

/** True when a Markdown body has visible content. */
export function hasBody(entry: { body?: string | undefined }): boolean {
  return Boolean(entry.body?.trim());
}
