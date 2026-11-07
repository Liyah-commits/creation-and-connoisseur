# Creation and Connoisseur website

The bilingual (English and Spanish) website for Creation and Connoisseur, a 501(c)(3) nonprofit focused on food insecurity at UNLV.

Built with Astro, Tailwind CSS and Keystatic, and deployed to Vercel. It's built to WCAG 2.1 AA and tested automatically on every change.

## Start

You need Node 24 (`nvm use`) and pnpm through Corepack (`corepack enable pnpm`).

```sh
pnpm install
pnpm exec playwright install chromium   # one browser for all the tests
pnpm dev                                # http://127.0.0.1:4321, editor at /keystatic
```

## Test

```sh
pnpm test:all   # type check, then the full suite on the production and template builds
```

| Command | What it does |
|---|---|
| `pnpm check` | TypeScript and Astro type check, including the bilingual string dictionary |
| `pnpm build:test` | Production build for testing (real content only) |
| `pnpm build:templates` | Template build: adds the labeled draft examples |
| `pnpm test` | Contrast, axe and behavior tests, pa11y-ci, broken links and Lighthouse CI, against the current build |
| `pnpm serve` | Serve the current build at http://localhost:4321 |

## Documents

- `docs/EDITOR_GUIDE.md`: for volunteers updating content
- `docs/ADMIN_GUIDE.md`: deploys, users, environment variables, backups, rollback
- `docs/ACCESSIBILITY_TEST_REPORT.md`: WCAG 2.1 AA results and the manual test plan
- `docs/SPANISH_REVIEW.md`: every Spanish file, for review before launch
- `docs/OPEN_ITEMS.md`: facts and assets still needed
- `docs/DECISIONS.md`: every decision and why
- `docs/PLAN.md`, `docs/BRIEF.md`: the plan and the original brief
- `docs/REDIRECTS.md`, `docs/CONTENT_INVENTORY.md`: migration records
