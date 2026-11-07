# Content inventory

Taken 6 November 2026, before the rebuild.

## Result

**No existing content was found.** No earlier site, repo, export, page, image, document or URL for Creation and Connoisseur exists in the places searched (listed in `docs/PLAN.md`, section 1). There is nothing to keep, revise, consolidate or remove.

## Inventory table

The table stays here so that anything found later goes through the same process: add a row, recommend, then add a redirect to `docs/REDIRECTS.md` when the URL changes.

| # | Old URL or file | Type | Summary | Recommendation (keep, revise, consolidate, remove) | New destination | Notes |
|---|---|---|---|---|---|---|
| | *none found* | | | | | |

## How to add old material if it turns up

1. Add a row for every page, image, PDF and URL.
2. Choose one recommendation per row:
   - **keep**: move it as is;
   - **revise**: move it and rewrite it;
   - **consolidate**: merge it into another page;
   - **remove**: drop it.
3. For every old URL that served a page, add a line to `docs/REDIRECTS.md` and an entry with `status: 301` to `redirects` in `astro.config.mjs` (see `docs/REDIRECTS.md` for the format and why it isn't `vercel.json`; D23 in `docs/DECISIONS.md`).
4. Move any organization fact found in the old material out of `docs/OPEN_ITEMS.md` and into the site settings in Keystatic.
