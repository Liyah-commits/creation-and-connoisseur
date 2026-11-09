/**
 * Reading content: the one place pages get entries from, so the draft rule and
 * the missing-page guard apply everywhere.
 */
import type { ImageMetadata } from 'astro';
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

/** Site settings. The template test build uses the fake values in tests/fixtures/settings.template.yaml instead. */
export async function getSettings() {
  const entry = SHOW_DRAFTS ? await getEntry('settingsTemplate', 'settings.template') : await getEntry('settings', 'settings');
  if (!entry) throw new Error('Missing content/settings.yaml. Restore it from git or save Site settings in Keystatic.');
  return entry.data;
}

export type Settings = Awaited<ReturnType<typeof getSettings>>;

/** The shared photos and stats ("Photos and stats" in Keystatic). Empty if the file has never been saved. */
export async function getHighlights() {
  const entry = await getEntry('highlights', 'highlights');
  if (entry) return entry.data;
  const off = { discriminant: false as const };
  return {
    heroImage: off,
    stats: [],
    headerPhotos: { about: off, programs: off, news: off, getHelp: off, donate: off, contact: off, volunteer: off },
    homeCardPhotos: { getHelp: off, volunteer: off, donate: off },
    homeFallbackPhotos: [],
    aboutPhotos: [],
  } satisfies CollectionEntry<'highlights'>['data'];
}

export type Highlights = Awaited<ReturnType<typeof getHighlights>>;
type BilingualPhoto = { image: ImageMetadata; altEn: string; altEs: string };
type OptionalPhoto = { discriminant: false } | { discriminant: true; value: BilingualPhoto } | undefined;

/** A photo with its alt text in one language, as the image components take it. */
export interface Photo {
  image: ImageMetadata;
  alt: string;
}

/** One language's version of a bilingual photo. */
export function inLang(photo: BilingualPhoto, lang: Lang): Photo {
  return { image: photo.image, alt: lang === 'en' ? photo.altEn : photo.altEs };
}

/** An optional bilingual photo in one language, or null when it's switched off. */
export function optionalInLang(photo: OptionalPhoto, lang: Lang): Photo | null {
  return photo?.discriminant ? inLang(photo.value, lang) : null;
}

export type HeaderPhotoKey = 'about' | 'programs' | 'news' | 'getHelp' | 'donate' | 'contact' | 'volunteer';

/** The photo for a page's header (D58), or null: pages without one show their heading across the full width. */
export async function getHeaderPhoto(lang: Lang, key: RouteKey): Promise<Photo | null> {
  const photos = (await getHighlights()).headerPhotos as Partial<Record<HeaderPhotoKey, OptionalPhoto>>;
  return key in photos ? optionalInLang(photos[key as HeaderPhotoKey], lang) : null;
}

export async function getPeople() {
  const people = await getCollection('people', isPublished);
  return people.sort((a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name));
}

/** True when a Markdown body has visible content. */
export function hasBody(entry: { body?: string | undefined }): boolean {
  return Boolean(entry.body?.trim());
}
