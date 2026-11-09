/**
 * Astro content collections. They read the same files Keystatic writes
 * (keystatic.config.ts), so the two schemas must stay in step.
 */
import { defineCollection, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

type ImageFn = SchemaContext['image'];

/**
 * Entry IDs are the file names exactly as Keystatic writes them (Astro would
 * otherwise lowercase them), so page keys like "getHelp" and the slugs stored
 * in "English version" relationship fields match.
 */
const fileId = ({ entry }: { entry: string }) => entry.replace(/\.(md|yaml)$/, '');
const files = (pattern: string, base: string) => glob({ pattern, base, generateId: fileId });

/** Keystatic's "Add an image" conditional field: off, or an image plus alt text. */
const optionalImage = (image: ImageFn) =>
  z
    .discriminatedUnion('discriminant', [
      z.object({ discriminant: z.literal(false) }),
      z.object({
        discriminant: z.literal(true),
        value: z.object({ image: image(), alt: z.string().trim().min(1) }),
      }),
    ])
    .default({ discriminant: false });

/** Keystatic's "More photos" list: each photo with its alt text. Missing means none. */
const gallery = (image: ImageFn) => z.array(z.object({ image: image(), alt: z.string().trim().min(1) })).default([]);

/** A photo used in both languages, with alt text in each (Home and About photos). */
const bilingualPhoto = (image: ImageFn) =>
  z.object({ image: image(), altEn: z.string().trim().min(1), altEs: z.string().trim().min(1) });

/** Keystatic writes empty text fields as "" and empty optional fields as null. */
const optionalText = z
  .string()
  .nullish()
  .transform((value) => value?.trim() || '');

const pages = (lang: 'en' | 'es') =>
  defineCollection({
    loader: files('*.md', `./content/${lang}/pages`),
    schema: z.object({
      internalName: z.string(),
      title: z.string().trim().min(1),
      metaDescription: z.string().trim().min(1),
      intro: optionalText,
    }),
  });

const programSchema = ({ image }: SchemaContext) =>
  z.object({
    title: z.string().trim().min(1),
    draft: z.boolean().default(false),
    englishVersion: z.string().nullish(),
    summary: z.string().trim().min(1),
    schedule: optionalText,
    location: optionalText,
    image: optionalImage(image),
    gallery: gallery(image),
  });

const newsSchema = ({ image }: SchemaContext) =>
  z.object({
    title: z.string().trim().min(1),
    draft: z.boolean().default(false),
    englishVersion: z.string().nullish(),
    date: z.coerce.date(),
    summary: z.string().trim().min(1),
    image: optionalImage(image),
    gallery: gallery(image),
  });

const people = defineCollection({
  loader: files('*.yaml', './content/people'),
  schema: ({ image }) =>
    z.object({
      name: z.string().trim().min(1),
      draft: z.boolean().default(false),
      /** Which group on the About page: the nonprofit's people first, then the club board. */
      group: z.enum(['nonprofit', 'clubBoard']).default('nonprofit'),
      roleEn: optionalText,
      roleEs: optionalText,
      bioEn: optionalText,
      bioEs: optionalText,
      photo: z
        .discriminatedUnion('discriminant', [
          z.object({ discriminant: z.literal(false) }),
          z.object({
            discriminant: z.literal(true),
            value: z.object({
              image: image(),
              altEn: z.string().trim().min(1),
              altEs: z.string().trim().min(1),
            }),
          }),
        ])
        .default({ discriminant: false }),
      order: z.number().int().default(10),
    }),
});

const settingsSchema = z.object({
    legalName: optionalText,
    ein: optionalText,
    email: optionalText,
    phone: optionalText,
    mailingAddress: optionalText,
    donationUrl: optionalText,
    socialLinks: z
      .array(z.object({ label: z.string().trim().min(1), url: z.url() }))
      .nullish()
      .transform((links) => links ?? []),
    missionEn: optionalText,
    missionEs: optionalText,
    taglineEn: optionalText,
    taglineEs: optionalText,
    unlvStatementEn: optionalText,
    unlvStatementEs: optionalText,
    descriptionEn: z.string().trim().min(1),
    descriptionEs: z.string().trim().min(1),
    foundingYear: z.number().int().nullish(),
});

const settings = defineCollection({ loader: files('settings.yaml', './content'), schema: settingsSchema });

/** Home page photo and stats, and the About page's club life photos (Keystatic singleton "highlights"). */
const highlights = defineCollection({
  loader: files('highlights.yaml', './content'),
  schema: ({ image }) =>
    z.object({
      heroImage: z
        .discriminatedUnion('discriminant', [
          z.object({ discriminant: z.literal(false) }),
          z.object({ discriminant: z.literal(true), value: bilingualPhoto(image) }),
        ])
        .default({ discriminant: false }),
      stats: z
        .array(
          z.object({
            value: z.string().trim().min(1),
            /** Spanish wording of the value when it differs ("Cientos" for "Hundreds"); empty means the same as English. */
            valueEs: optionalText,
            labelEn: z.string().trim().min(1),
            labelEs: z.string().trim().min(1),
          }),
        )
        .max(4)
        .default([]),
      aboutPhotos: z.array(bilingualPhoto(image)).default([]),
    }),
});

/**
 * Obviously fake settings used only by the template test build (SHOW_DRAFTS=true),
 * so the footer contact details, EIN line, social links, mission and working
 * Donate link are tested before the real values exist. Never used in production.
 */
const settingsTemplate = defineCollection({ loader: files('settings.template.yaml', './tests/fixtures'), schema: settingsSchema });

export const collections = {
  pagesEn: pages('en'),
  pagesEs: pages('es'),
  programsEn: defineCollection({ loader: files('*.md', './content/en/programs'), schema: programSchema }),
  programsEs: defineCollection({ loader: files('*.md', './content/es/programs'), schema: programSchema }),
  newsEn: defineCollection({ loader: files('*.md', './content/en/news'), schema: newsSchema }),
  newsEs: defineCollection({ loader: files('*.md', './content/es/news'), schema: newsSchema }),
  people,
  highlights,
  settings,
  settingsTemplate,
};
