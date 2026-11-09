# Redirect map

## Result

**No old site exists, so there are no old URLs to redirect.** See `docs/CONTENT_INVENTORY.md` and `docs/PLAN.md`, section 1.

Pages renamed on this site after it went live are redirected too. They're listed in the map below.

## Map

| Old URL | New URL | Status | Reason |
|---|---|---|---|
| `/programs/biweekly-volunteering/` | `/programs/volunteer-days/` | 301 | Program renamed 9 November 2026: the old name claimed a biweekly schedule (D48) |
| `/es/programas/voluntariado-quincenal/` | `/es/programas/jornadas-de-voluntariado/` | 301 | Spanish version of the same rename (D48) |

## How to add a redirect

1. Add the row above.
2. Add the matching entry to `redirects` in `astro.config.mjs`:

   ```js
   export default defineConfig({
     // ...
     redirects: {
       '/old-page': { status: 301, destination: '/about/' },
     },
   });
   ```

3. Redirect the Spanish equivalent too if the old site had one.
4. Build (`pnpm build`) and confirm the redirect is in `.vercel/output/config.json` as a route with `"status": 301` and the right `Location`.
5. After deploying, check each old URL with `curl -sI https://<domain>/old-page/`. The response must be `301` with `location: /about/`.

### Why `astro.config.mjs` and not `vercel.json`

The brief named `vercel.json`. The Vercel adapter, though, writes the site's routing itself (Vercel's Build Output API, `.vercel/output/config.json`). Redirects in `astro.config.mjs` are compiled into that file as 301 routes. That was checked on 6 November 2026 with a test entry, and it can be checked again on every build. Whether Vercel also applies a `vercel.json` `redirects` list on top of an adapter's output could not be confirmed from Vercel's documentation, so the site doesn't depend on it. See D23 in `docs/DECISIONS.md`.

### Trailing slashes

The site uses addresses that end in `/` (`trailingSlash: 'always'`). The adapter matches redirect sources with the slash added, so a request for `/old-page` first gets Vercel's trailing-slash redirect (308) to `/old-page/`, then the 301. Search engines follow the two steps and pass the 301 on. When adding a redirect, test both `/old-page` and `/old-page/`.
