# Redirect map

## Result

**No old site exists, so there are no old URLs to redirect.** See `docs/CONTENT_INVENTORY.md` and `docs/PLAN.md`, section 1.

`vercel.json` contains an empty `redirects` list, so adding a redirect is a one-line change once an old URL surfaces.

## Map

| Old URL | New URL | Status | Reason |
|---|---|---|---|
| *none* | | | |

## How to add a redirect

Add the row above, then the matching entry in `vercel.json`:

```json
{
  "redirects": [
    { "source": "/old-page", "destination": "/about/", "statusCode": 301 }
  ]
}
```

- Use `statusCode: 301` rather than `permanent: true`. Vercel's `permanent: true` sends 308.
- Redirect the Spanish equivalent too if the old site had one.
- After deploying, check each old URL returns 301 with `curl -sI https://<domain>/old-page`.
