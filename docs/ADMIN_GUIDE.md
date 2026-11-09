# Admin guide

For the person who looks after the website: Aryah, or whoever takes over. It covers the first deploy, users, environment variables, deploys, backups and rolling back. Editors who only change content need `docs/EDITOR_GUIDE.md` instead.

Written 6 November 2026. Where a step depends on a third-party screen (GitHub, Vercel, Formspree), the wording of that screen may have changed since.

## 1. What's where

| Path | What it is |
|---|---|
| `content/` | All site content: Markdown and YAML files written by Keystatic. `content/settings.yaml` holds the organization facts. |
| `content/images/` | Uploaded images, one folder per collection and language. |
| `src/i18n/routes.ts` | Every page and its English and Spanish address. |
| `src/i18n/ui.ts` | Every interface string (buttons, labels, errors) in both languages. |
| `src/views/`, `src/components/`, `src/layouts/` | Templates. |
| `keystatic.config.ts` | The editing screens at `/keystatic`. |
| `astro.config.mjs` | Site settings: address, languages, redirects, environment variables. |
| `tests/`, `scripts/`, `.pa11yci.cjs`, `lighthouserc.cjs` | Automated tests. |
| `.github/workflows/ci.yml` | Runs every test on every pull request and every push to `main`. |
| `docs/` | Plan, decisions, open items, guides, test report. |

## 2. Run it on your computer

1. Install Node 24 with nvm: `nvm install 24`, then `nvm use` in the project folder (it reads `.nvmrc`).
2. Turn on pnpm: `corepack enable pnpm`. The exact version comes from `package.json`.
3. Install everything:

   ```sh
   pnpm install
   pnpm exec playwright install chromium
   ```

4. Start the site: `pnpm dev`. It runs at `http://127.0.0.1:4321`.
5. Edit content at `http://127.0.0.1:4321/keystatic`. On your computer, Keystatic saves straight to the files in `content/`. Commit them with git as usual.

## 3. Run the tests

```sh
pnpm test:all
```

This takes about four minutes. It runs the type check, then the whole suite twice: on the production build (real content only) and on the template build (adds the labeled draft examples and fake settings, so every template is tested). It must pass before any change goes live. CI runs the same thing.

| Command | Checks |
|---|---|
| `pnpm check` | Types, including that every interface string has English and Spanish |
| `pnpm test:contrast` | Every color pair against WCAG contrast ratios |
| `pnpm test:e2e` | axe on every page at two widths and in form states, plus keyboard, structure, language-switch, form and content tests (Playwright) |
| `pnpm test:pa11y` | pa11y-ci with axe and HTML_CodeSniffer on every page |
| `pnpm test:links` | Broken links (linkinator) |
| `pnpm test:lhci` | Lighthouse on every page: accessibility, performance and best practices at least 95, SEO 100 |

The suite runs against the current build in `.vercel/output/static`. `pnpm test:production` and `pnpm test:templates` build first. Reports go to `reports/production/` and `reports/templates/` (not committed).

## 4. First deploy

Nothing has been pushed or deployed yet (ruling D2). Do these steps once, in order.

### 4.1 Create the GitHub repository

With the GitHub CLI, from the project folder:

```sh
gh repo create Liyah-commits/creation-and-connoisseur --private --source . --remote origin --push
```

Use `--public` instead of `--private` if you want the code visible as a portfolio piece. Content commits from Keystatic are then public too.

### 4.2 Connect Vercel

1. Go to `https://vercel.com/new` and import the repository.
2. Vercel detects Astro. Keep the defaults: build command `pnpm build`, output handled by the adapter.
3. Vercel reads the Node version from `package.json` (`engines`: Node 24).
4. Add the environment variable `ENABLE_EXPERIMENTAL_COREPACK=1`, so Vercel uses the exact pnpm version in `package.json`.
5. Deploy. The site is live at the `*.vercel.app` address Vercel shows.

### 4.3 Set the environment variables

In Vercel: Project > Settings > Environment Variables. See section 6 for the full list. For the first deploy you need only `ENABLE_EXPERIMENTAL_COREPACK`. Add the others as each service is set up, then redeploy (Deployments > the latest > Redeploy).

### 4.4 Set up editing (Keystatic GitHub App)

Editors sign in with GitHub, and Keystatic saves their changes as commits. This needs a GitHub App, which Keystatic creates for you.

1. In the project folder, create a file named `.env` containing:

   ```sh
   PUBLIC_KEYSTATIC_STORAGE=github
   PUBLIC_KEYSTATIC_GITHUB_REPO=Liyah-commits/creation-and-connoisseur
   ```

2. Run `pnpm dev` and open `http://127.0.0.1:4321/keystatic`. Choose **Log in with GitHub**. You'll land on **Keystatic Setup**.
3. Under **Deployed App URL**, enter the live address (for example `https://creation-and-connoisseur.vercel.app`, or the real domain). Leave **GitHub organization** blank unless the repo belongs to an organization. Choose **Create GitHub App**, and confirm on GitHub.
4. GitHub sends you back, and Keystatic writes `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` and `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` into `.env`.
5. On GitHub, install the new app on the repository: GitHub > Settings > Developer settings > GitHub Apps > the app > Install App > choose only this repository.
6. Check the app's callback URL (GitHub App settings > Callback URL). It must be `https://<live address>/api/keystatic/github/oauth/callback`. Add a second one for `http://127.0.0.1:4321/api/keystatic/github/oauth/callback` if you want to test GitHub mode locally.
7. Copy these five values from `.env` into Vercel's environment variables: `PUBLIC_KEYSTATIC_GITHUB_REPO`, `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`, `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET` and `KEYSTATIC_SECRET`. Don't copy `PUBLIC_KEYSTATIC_STORAGE`, which is only for this local step.
8. Delete `.env` from your computer, or remove the `PUBLIC_KEYSTATIC_STORAGE` line, so `pnpm dev` goes back to saving local files. `.env` is git-ignored; never commit it.
9. Redeploy on Vercel, open `https://<live address>/keystatic` and sign in with GitHub. You should see the dashboard.

### 4.5 Connect the forms (Formspree)

**Status (9 November 2026):** steps 1 to 4 are done. The form exists, and `FORMSPREE_FORM_ID` is set in Vercel for Production and Preview (D59). Steps 5 and 6 are still to do.

1. Create a free account at `https://formspree.io` with the email address that should receive messages.
2. Create one form. The Contact, Volunteer and Get Help forms all use it; the subject line says which form, and which language, each message came from. Get Help requests arrive with the subject "Get Help request", and the site promises a reply within two business days.
3. Copy the form ID: the part after `/f/` in the endpoint (`https://formspree.io/f/abcdwxyz` gives `abcdwxyz`).
4. Add `FORMSPREE_FORM_ID` in Vercel and redeploy. The "not connected yet" notice disappears from all three forms.
5. Send a test message from each form, in each language, and confirm it arrives.
6. Optional, in Formspree's form settings: restrict submissions to your domain.
7. Update the privacy policy if anything about how messages are handled changes (`docs/OPEN_ITEMS.md`, item 18).

### 4.6 Add the domain

1. In Vercel: Project > Settings > Domains > add the domain, and follow the DNS instructions.
2. Set `SITE_URL` to `https://<domain>` (no trailing slash) and redeploy. Canonical links, hreflang, the sitemap and social sharing now use the domain.
3. Update the GitHub App's callback URL and homepage to the domain (section 4.4, step 6).

### 4.7 Turn on branch checks (recommended)

On GitHub: Settings > Branches > add a rule for `main` that requires the CI checks to pass before merging a pull request. Don't require pull requests for every change, because Keystatic commits straight to `main`. A failing content commit still won't stop the site, because Vercel won't publish a build that fails.

## 5. Users

| Who | Access they need | How to add | How to remove |
|---|---|---|---|
| Content editors | A GitHub account with **Write** access to the repo | GitHub > repo > Settings > Collaborators > Add people > Write. Send them `docs/EDITOR_GUIDE.md`. | Remove them from Collaborators. Their sign-in stops working at once. |
| Site admins | Write or Admin on GitHub, plus membership of the Vercel project | GitHub as above; Vercel > Team Settings > Members | Remove from both |
| Form inbox | The Formspree account (and the inbox it emails) | Formspree > Settings | Formspree > Settings |

Keystatic has no user list of its own: anyone with write access to the repository can edit in `/keystatic`, and only they can.

## 6. Environment variables

Set in Vercel (Project > Settings > Environment Variables) for Production and Preview. Locally, put them in `.env` (git-ignored); `.env.example` lists them all.

| Variable | Needed | What it does |
|---|---|---|
| `SITE_URL` | Once the domain is known | The public address, like `https://example.org`. Until set, Vercel's production address is used. Never guessed. |
| `FORMSPREE_FORM_ID` | To make the forms send | The Formspree form ID, shared by the Contact, Volunteer and Get Help forms. Empty: the forms show a "not connected yet" notice. |
| `PUBLIC_KEYSTATIC_GITHUB_REPO` | For editing in production | `owner/name` of the repository |
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | For editing in production | Written by Keystatic setup (section 4.4) |
| `KEYSTATIC_GITHUB_CLIENT_ID` | For editing in production | Written by Keystatic setup. Secret. |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | For editing in production | Written by Keystatic setup. Secret. |
| `KEYSTATIC_SECRET` | For editing in production | Written by Keystatic setup. Secret. |
| `ENABLE_EXPERIMENTAL_COREPACK` | Recommended | `1`: Vercel uses the exact pnpm version in `package.json` |
| `SHOW_DRAFTS` | Never in production | `true` includes drafts. Used only by the template test build. |
| `PUBLIC_KEYSTATIC_STORAGE` | Never in production | `github` forces GitHub mode locally, for the one-time setup |

Keep a copy of the secrets in a password manager. They can be regenerated from the GitHub App settings if lost.

## 7. Deploys

- **Every push to `main` deploys to production**, including each Save in Keystatic, which is a commit. The site updates about one to two minutes later.
- **Pull requests** get a Vercel preview address, and CI runs the full test suite on them.
- **A build that fails isn't published.** The previous version stays live. The most likely cause is a required page entry deleted in Keystatic: the build log names the file to restore (`Missing required page: content/...`).
- Build warnings saying a collection "does not exist or is empty" are expected while there are no published programs, news posts or people.

## 8. Backups

- **Content and code:** everything, including images, is in the git repository, and every change is a commit with its author and time. GitHub is the primary copy. For an independent backup, keep a mirror on another machine and refresh it monthly:

  ```sh
  git clone --mirror https://github.com/Liyah-commits/creation-and-connoisseur.git
  cd creation-and-connoisseur.git && git remote update
  ```

- **Form messages:** they're emailed to the inbox and stored by Formspree. Export them from Formspree (Submissions > Export) on whatever schedule the privacy policy promises.
- **Settings and secrets:** keep the environment variables in a password manager (section 6).

## 9. Rolling back

Pick the smallest tool that fixes the problem.

1. **Undo one content change.** In Keystatic, open the entry, put the old text back and save. To see what changed, open the file's history on GitHub (repo > `content/...` > History).
2. **Put the previous version of the whole site back, at once.** In Vercel: Deployments > find the last good deployment > the menu (⋯) > **Instant Rollback** (or **Promote to Production**). This takes effect in seconds and changes no code. Later pushes deploy normally again, so fix the cause too.
3. **Reverse a commit in git.** This keeps the history:

   ```sh
   git revert <commit-sha>
   git push
   ```

   Find the commit with `git log --oneline` or on GitHub. Prefer `revert` over `reset` on `main`, since others' work and Keystatic's commits are on it.

## 10. Maintenance

- **Updating dependencies:** `pnpm outdated`, then `pnpm update`, then `pnpm test:all`, and commit the lockfile. pnpm won't install a version published less than seven days ago (`minimumReleaseAge` in `pnpm-workspace.yaml`, decision D7). `@lhci/cli` 0.16 and Playwright 1.65 can be adopted after 12 November 2026 (D22).
- **Adding a redirect** (if old URLs ever surface): `docs/REDIRECTS.md`.
- **Adding a page:** add the key and both addresses to `src/i18n/routes.ts`; add `nav.<key>` to `src/i18n/ui.ts`; create the two thin page files in `src/pages/` and `src/pages/es/`; create `content/en/pages/<key>.md` and `content/es/pages/<key>.md`; add the Spanish file to `docs/SPANISH_REVIEW.md`; run `pnpm test:all`. The type check and the missing-page guard fail until every part exists.
- **Share image and icons:** `pnpm images` regenerates the favicon, touch icon and share image from the logo mark (`scripts/make-images.mjs`, D55). Run it again after changing the palette, the mark or the Home hero line.
- **Accessibility statement:** update the review date in both languages whenever the site is retested.
