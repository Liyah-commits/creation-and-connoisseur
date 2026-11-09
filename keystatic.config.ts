/**
 * Keystatic CMS configuration: the editing screens at /keystatic.
 *
 * Every field has plain-language help text, because the people using this are
 * volunteers, not developers. See docs/EDITOR_GUIDE.md for the editor's view
 * and docs/DECISIONS.md for why the content model looks like this.
 */
import { collection, config, fields, singleton } from '@keystatic/core';

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------
// In development (`pnpm dev`) edits are saved straight to the files in content/.
// In production edits are saved to GitHub as commits, and Vercel redeploys.
// The repository comes from PUBLIC_KEYSTATIC_GITHUB_REPO ("owner/name"). If it
// isn't set, the admin shows a "not configured" repository rather than falling
// back to local mode, which would expose a write API on the live site.
//
// PUBLIC_KEYSTATIC_STORAGE=github forces GitHub mode in development too. It's
// only needed once, to run Keystatic's "create GitHub App" setup locally
// (docs/ADMIN_GUIDE.md).
const githubRepo = (import.meta.env.PUBLIC_KEYSTATIC_GITHUB_REPO ||
  'not-configured/set-PUBLIC_KEYSTATIC_GITHUB_REPO') as `${string}/${string}`;

const useLocalFiles = import.meta.env.DEV && import.meta.env.PUBLIC_KEYSTATIC_STORAGE !== 'github';

const storage = useLocalFiles ? ({ kind: 'local' } as const) : ({ kind: 'github', repo: githubRepo } as const);

// ---------------------------------------------------------------------------
// Shared field builders
// ---------------------------------------------------------------------------

/** The main text of a page or entry. Headings are limited to two levels. */
const bodyField = () =>
  fields.markdoc({
    label: 'Main text',
    description:
      'The main text. Use "Heading 2" for section headings and "Heading 3" for smaller headings inside a section. The page title is already the top heading, so there is no "Heading 1".',
    extension: 'md',
    options: {
      heading: [2, 3],
      image: false,
      table: false,
      code: false,
      codeBlock: false,
      strikethrough: false,
      divider: false,
    },
  });

/**
 * An optional image. Once "Add an image" is ticked, the image and its
 * description are both required, so an image can never be saved without alt
 * text.
 */
const optionalImageField = (folder: string, publicPath: string) =>
  fields.conditional(
    fields.checkbox({
      label: 'Add an image',
      description: 'Tick this to add a photo. You will be asked to describe it for people who cannot see it.',
      defaultValue: false,
    }),
    {
      true: fields.object({
        image: fields.image({
          label: 'Image',
          description: 'A JPG or PNG photo, at least 1200 pixels wide. Only use photos you have permission to use.',
          // Each language has its own folder, so an English and a Spanish entry with the same web address can't overwrite each other's images.
          directory: `content/images/${folder}`,
          publicPath,
          validation: { isRequired: true },
        }),
        alt: fields.text({
          label: 'Image description (alt text)',
          description:
            'Describe what the photo shows in one sentence, as you would to someone on the phone. For example: "Two volunteers packing bags of groceries at a folding table." Do not start with "Image of".',
          validation: { length: { min: 1, max: 250 } },
        }),
      }),
      false: fields.empty(),
    },
  );

/**
 * Extra photos shown under the main text of a program or news post, each with
 * its own required description. The main image above stays the one shown on
 * list cards and when the page is shared.
 */
const galleryField = (folder: string, publicPath: string) =>
  fields.array(
    fields.object({
      image: fields.image({
        label: 'Photo',
        description: 'A JPG, PNG or WebP photo, at least 1200 pixels wide. Only use photos you have permission to use.',
        directory: `content/images/${folder}`,
        publicPath,
        validation: { isRequired: true },
      }),
      alt: fields.text({
        label: 'Photo description (alt text)',
        description: 'Describe what the photo shows in one sentence, as you would to someone on the phone. Do not start with "Image of".',
        validation: { length: { min: 1, max: 250 } },
      }),
    }),
    {
      label: 'More photos',
      description: 'Optional. Up to six more photos, shown under the main text. Each one needs its own description.',
      itemLabel: (props) => props.fields.alt.value || 'New photo',
      validation: { length: { max: 6 } },
    },
  );

/** A photo used in both languages, with a description in each (People, Home and About photos). */
const bilingualPhoto = (directory: string, publicPath: string, imageDescription: string) =>
  fields.object({
    image: fields.image({
      label: 'Photo',
      description: imageDescription,
      directory,
      publicPath,
      validation: { isRequired: true },
    }),
    altEn: fields.text({
      label: 'Photo description (English)',
      description: 'For example: "Volunteers packing bags of groceries at a folding table."',
      validation: { length: { min: 1, max: 250 } },
    }),
    altEs: fields.text({
      label: 'Photo description (Spanish)',
      description: 'The same description, in Spanish.',
      validation: { length: { min: 1, max: 250 } },
    }),
  });

const draftField = () =>
  fields.checkbox({
    label: 'Hide from the live site',
    description:
      'While this is ticked, the entry is saved but does not appear on the public website. Untick it when it is ready to publish.',
    defaultValue: true,
  });

const summaryField = (what: string) =>
  fields.text({
    label: 'Short summary',
    description: `One or two sentences about this ${what}. It appears in the list on the website and in search results. Keep it under 160 characters.`,
    multiline: true,
    validation: { length: { min: 1, max: 160 } },
  });

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

/** The fixed pages (Home, About, Get Help and so on), one collection per language. */
const pagesCollection = (lang: 'en' | 'es') =>
  collection({
    label: lang === 'en' ? 'Pages (English)' : 'Páginas (Spanish pages)',
    path: `content/${lang}/pages/*`,
    slugField: 'internalName',
    format: { contentField: 'body' },
    entryLayout: 'content',
    columns: ['title'],
    schema: {
      internalName: fields.slug({
        name: {
          label: 'Internal name',
          description:
            'Do not change. The website finds this page by its internal name. Changing it, or adding a new page here, will not create a new page on the site.',
        },
        slug: {
          label: 'File name',
          description: 'Do not change. This must match the internal name.',
        },
      }),
      title: fields.text({
        label: 'Page title',
        description: 'The main heading at the top of the page. It also appears in the browser tab and in search results.',
        validation: { length: { min: 1, max: 60 } },
      }),
      metaDescription: fields.text({
        label: 'Search result description',
        description:
          'One or two sentences that describe this page. Search engines show it under the page title. Each page needs a different one. Aim for 70 to 160 characters.',
        multiline: true,
        validation: { length: { min: 20, max: 160 } },
      }),
      intro: fields.text({
        label: 'Introduction',
        description: 'A short opening paragraph shown in larger text under the title. Optional.',
        multiline: true,
      }),
      body: bodyField(),
    },
  });

const programsCollection = (lang: 'en' | 'es') =>
  collection({
    label: lang === 'en' ? 'Programs (English)' : 'Programas (Spanish programs)',
    path: `content/${lang}/programs/*`,
    slugField: 'title',
    format: { contentField: 'body' },
    entryLayout: 'content',
    columns: ['title', 'draft'],
    schema: {
      title: fields.slug({
        name: {
          label: 'Program name',
          description: 'The name of the program. It is the heading on the program page.',
          validation: { length: { min: 1, max: 60 } },
        },
        slug: {
          label: 'Web address',
          description:
            'The last part of the page address, made from the name. Use lowercase words joined by hyphens. Changing it after publishing breaks old links.',
        },
      }),
      draft: draftField(),
      ...(lang === 'es'
        ? {
            englishVersion: fields.relationship({
              label: 'English version',
              description:
                'Pick the English program this page translates. The language switch at the top of the site uses this to move between the two versions.',
              collection: 'programsEn',
            }),
          }
        : {}),
      summary: summaryField('program'),
      schedule: fields.text({
        label: 'When',
        description: 'Days and times, in plain words. For example: "Tuesdays, 11 a.m. to 2 p.m." Leave empty if it does not apply.',
      }),
      location: fields.text({
        label: 'Where',
        description: 'The place, in plain words, with a building and room if there is one. Leave empty if it does not apply.',
      }),
      image: optionalImageField(`programs/${lang}`, `../../images/programs/${lang}/`),
      gallery: galleryField(`programs/${lang}`, `../../images/programs/${lang}/`),
      body: bodyField(),
    },
  });

const newsCollection = (lang: 'en' | 'es') =>
  collection({
    label: lang === 'en' ? 'News posts (English)' : 'Noticias (Spanish news posts)',
    path: `content/${lang}/news/*`,
    slugField: 'title',
    format: { contentField: 'body' },
    entryLayout: 'content',
    columns: ['title', 'date', 'draft'],
    schema: {
      title: fields.slug({
        name: {
          label: 'Headline',
          description: 'The title of the post.',
          validation: { length: { min: 1, max: 80 } },
        },
        slug: {
          label: 'Web address',
          description:
            'The last part of the page address, made from the headline. Use lowercase words joined by hyphens. Changing it after publishing breaks old links.',
        },
      }),
      draft: draftField(),
      ...(lang === 'es'
        ? {
            englishVersion: fields.relationship({
              label: 'English version',
              description:
                'Pick the English post this one translates. The language switch at the top of the site uses this to move between the two versions.',
              collection: 'newsEn',
            }),
          }
        : {}),
      date: fields.date({
        label: 'Date',
        description: 'The date the post is published. Posts are listed newest first.',
        defaultValue: { kind: 'today' },
        validation: { isRequired: true },
      }),
      summary: summaryField('post'),
      image: optionalImageField(`news/${lang}`, `../../images/news/${lang}/`),
      gallery: galleryField(`news/${lang}`, `../../images/news/${lang}/`),
      body: bodyField(),
    },
  });

export default config({
  storage,
  ui: {
    brand: { name: 'Creation and Connoisseur' },
    navigation: {
      English: ['pagesEn', 'programsEn', 'newsEn'],
      Español: ['pagesEs', 'programsEs', 'newsEs'],
      Shared: ['people', 'highlights', 'settings'],
    },
  },
  collections: {
    pagesEn: pagesCollection('en'),
    pagesEs: pagesCollection('es'),
    programsEn: programsCollection('en'),
    programsEs: programsCollection('es'),
    newsEn: newsCollection('en'),
    newsEs: newsCollection('es'),
    people: collection({
      label: 'People',
      path: 'content/people/*',
      slugField: 'name',
      format: { data: 'yaml' },
      columns: ['name', 'order', 'draft'],
      schema: {
        name: fields.slug({
          name: {
            label: 'Name',
            description:
              'The name as the person wants it shown. Student board members are listed by first name only, unless they agree to a full name online.',
            validation: { length: { min: 1, max: 80 } },
          },
          slug: {
            label: 'File name',
            description: 'Made from the name automatically. You do not need to change it.',
          },
        }),
        draft: draftField(),
        group: fields.select({
          label: 'Group',
          description: 'Where the person appears on the About page.',
          options: [
            { label: 'Creation and Connoisseur (first, under "Our people")', value: 'nonprofit' },
            { label: 'UNLV Food Tasting Club board (second group)', value: 'clubBoard' },
          ],
          defaultValue: 'nonprofit',
        }),
        roleEn: fields.text({
          label: 'Role (English)',
          description: 'Their role, in English. For example: "Board member".',
        }),
        roleEs: fields.text({
          label: 'Role (Spanish)',
          description: 'The same role, in Spanish. For example: "Miembro de la junta directiva".',
        }),
        bioEn: fields.text({
          label: 'Short bio (English)',
          description: 'Two or three sentences, in English. Optional.',
          multiline: true,
        }),
        bioEs: fields.text({
          label: 'Short bio (Spanish)',
          description: 'The same bio, in Spanish. Optional.',
          multiline: true,
        }),
        photo: fields.conditional(
          fields.checkbox({
            label: 'Add a photo',
            description: 'Tick this to add a photo. Without one, the site shows the person\'s initials.',
            defaultValue: false,
          }),
          {
            true: fields.object({
              image: fields.image({
                label: 'Photo',
                description: 'A square photo works best, at least 600 pixels wide. Only use a photo the person has agreed to.',
                directory: 'content/images/people',
                publicPath: '../images/people/',
                validation: { isRequired: true },
              }),
              altEn: fields.text({
                label: 'Photo description (English)',
                description: 'For example: "Portrait of Jane Doe smiling outdoors."',
                validation: { length: { min: 1, max: 250 } },
              }),
              altEs: fields.text({
                label: 'Photo description (Spanish)',
                description: 'The same description, in Spanish. For example: "Retrato de Jane Doe sonriendo al aire libre."',
                validation: { length: { min: 1, max: 250 } },
              }),
            }),
            false: fields.empty(),
          },
        ),
        order: fields.integer({
          label: 'Order',
          description: 'People are listed from the lowest number to the highest. Use 10, 20, 30 so it is easy to fit someone in between.',
          defaultValue: 10,
          validation: { isRequired: true },
        }),
      },
    }),
  },
  singletons: {
    highlights: singleton({
      label: 'Photos and stats (Home, About, Volunteer)',
      path: 'content/highlights',
      format: { data: 'yaml' },
      schema: {
        heroImage: fields.conditional(
          fields.checkbox({
            label: 'Show a photo at the top of the Home page',
            description: 'Tick this to add the main Home page photo. It loads first, so use a landscape photo.',
            defaultValue: false,
          }),
          {
            true: bilingualPhoto(
              'content/images/highlights',
              './images/highlights/',
              'A landscape JPG, PNG or WebP photo, at least 1600 pixels wide. Only use photos you have permission to use.',
            ),
            false: fields.empty(),
          },
        ),
        stats: fields.array(
          fields.object({
            value: fields.text({
              label: 'Number or word (English)',
              description:
                'The figure exactly as it should appear, for example "1,000+" or "Hundreds". Only publish a figure you can point to a source for.',
              validation: { length: { min: 1, max: 12 } },
            }),
            valueEs: fields.text({
              label: 'Number or word (Spanish)',
              description: 'Leave empty when it is the same in Spanish, like "100+". Fill it in when it is a word, like "Cientos".',
              validation: { length: { max: 12 } },
            }),
            labelEn: fields.text({
              label: 'What it counts (English)',
              description: 'Plain words that follow the number, for example "people fed".',
              validation: { length: { min: 1, max: 80 } },
            }),
            labelEs: fields.text({
              label: 'What it counts (Spanish)',
              description: 'The same words, in Spanish.',
              validation: { length: { min: 1, max: 80 } },
            }),
          }),
          {
            label: 'Home page stats',
            description: 'Up to four figures, shown in a strip under the Home page photo. Leave empty to hide the strip.',
            itemLabel: (props) => `${props.fields.value.value} ${props.fields.labelEn.value}`.trim() || 'New stat',
            validation: { length: { max: 4 } },
          },
        ),
        volunteerPhoto: fields.conditional(
          fields.checkbox({
            label: 'Show a volunteering photo',
            description:
              'Tick this to add a photo of volunteers at work. It appears at the top of the Volunteer page and in the Volunteer card on the Home page. Never use a photo that shows the face of someone receiving food.',
            defaultValue: false,
          }),
          {
            true: bilingualPhoto(
              'content/images/highlights',
              './images/highlights/',
              'A JPG, PNG or WebP photo, at least 900 pixels wide. It is shown at most 900 pixels wide. Only use photos you have permission to use.',
            ),
            false: fields.empty(),
          },
        ),
        aboutPhotos: fields.array(
          bilingualPhoto(
            'content/images/highlights',
            './images/highlights/',
            'A JPG, PNG or WebP photo, at least 1200 pixels wide. Only use photos you have permission to use.',
          ),
          {
            label: 'Club life photos (About page)',
            description: 'Optional. Up to six photos, shown on the About page under "Club life".',
            itemLabel: (props) => props.fields.altEn.value || 'New photo',
            validation: { length: { max: 6 } },
          },
        ),
      },
    }),
    settings: singleton({
      label: 'Site settings',
      path: 'content/settings',
      format: { data: 'yaml' },
      schema: {
        legalName: fields.text({
          label: 'Legal name',
          description: 'The organization\'s exact legal name, as registered with the IRS. Leave empty until confirmed.',
        }),
        ein: fields.text({
          label: 'EIN (tax ID)',
          description: 'The nine-digit Employer Identification Number, written like 12-3456789. It appears in the footer and helps donors. Leave empty until confirmed.',
          validation: { length: { max: 10 } },
        }),
        email: fields.text({
          label: 'Public email',
          description: 'The email address the public can use. It appears in the footer and on the Contact page.',
        }),
        phone: fields.text({
          label: 'Public phone',
          description: 'The phone number the public can use, written like (702) 555-0123. Leave empty if there isn\'t one.',
        }),
        mailingAddress: fields.text({
          label: 'Mailing address',
          description: 'The full mailing address, one line per line of the address.',
          multiline: true,
        }),
        donationUrl: fields.url({
          label: 'Donation link',
          description:
            'The full web address of the donation page (for example, on a giving platform). Once it is set, the Donate page button becomes a working link.',
        }),
        socialLinks: fields.array(
          fields.object({
            label: fields.text({
              label: 'Name',
              description: 'The name of the site, for example "Instagram".',
              validation: { length: { min: 1 } },
            }),
            url: fields.url({
              label: 'Link',
              description: 'The full web address of the profile.',
              validation: { isRequired: true },
            }),
          }),
          {
            label: 'Social media links',
            description:
              'Links shown in the footer and on the Contact page. Instagram, TikTok and Discord links get their icon automatically. Leave empty to hide the section.',
            itemLabel: (props) => props.fields.label.value || 'New link',
          },
        ),
        missionEn: fields.text({
          label: 'Mission statement (English)',
          description: 'The official mission statement, word for word. It appears on the About page. Leave empty until it is approved.',
          multiline: true,
        }),
        missionEs: fields.text({
          label: 'Mission statement (Spanish)',
          description: 'The approved Spanish translation of the mission statement.',
          multiline: true,
        }),
        taglineEn: fields.text({
          label: 'Tagline (English)',
          description:
            'One short line, under 100 characters, about what the organization does today. It appears under the name in the footer and in the home page title in search results. Use the same words for social media bios.',
          validation: { length: { max: 100 } },
        }),
        taglineEs: fields.text({
          label: 'Tagline (Spanish)',
          description: 'The same line, in Spanish.',
          validation: { length: { max: 100 } },
        }),
        unlvStatementEn: fields.text({
          label: 'Relationship to UNLV (English)',
          description:
            'The statement about how the organization relates to the university. It appears in the footer of every page, in place of the general nonprofit line. Use only wording confirmed with UNLV Student Involvement.',
          multiline: true,
        }),
        unlvStatementEs: fields.text({
          label: 'Relationship to UNLV (Spanish)',
          description: 'The same statement, in Spanish.',
          multiline: true,
        }),
        descriptionEn: fields.text({
          label: 'Short description (English)',
          description: 'One sentence about the organization. It is used in search results and when the site is shared on social media.',
          multiline: true,
          validation: { length: { min: 1, max: 200 } },
        }),
        descriptionEs: fields.text({
          label: 'Short description (Spanish)',
          description: 'The same sentence, in Spanish.',
          multiline: true,
          validation: { length: { min: 1, max: 200 } },
        }),
        foundingYear: fields.integer({
          label: 'Year founded',
          description: 'Optional. The year the organization was founded. It is only used in information for search engines.',
        }),
      },
    }),
  },
});
