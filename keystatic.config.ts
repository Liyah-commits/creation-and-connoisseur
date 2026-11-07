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
      Shared: ['people', 'settings'],
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
            description: 'Full name, as the person wants it shown.',
            validation: { length: { min: 1, max: 80 } },
          },
          slug: {
            label: 'File name',
            description: 'Made from the name automatically. You do not need to change it.',
          },
        }),
        draft: draftField(),
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
            description: 'Links shown in the footer. Leave empty to hide the section.',
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
