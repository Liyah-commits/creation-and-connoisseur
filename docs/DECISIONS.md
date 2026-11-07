# Decisions

A running record of every choice made in the rebuild and why. Newest entries go at the bottom of their section. "Ruled" means Aryah decided; everything else was decided during the build under the brief's instruction to work autonomously.

## Phase 0: discovery and stack

**D1. Node 24 LTS instead of Node 20.** Ruled by Aryah, 6 November 2026.
- **Why:** The brief fixed Node 20, but Node 20 reached end of life on 30 April 2026 and Vercel stopped building Node 20 projects on 1 October 2026 (Vercel changelog, "Node.js 20 is being deprecated"). The current releases of Astro, `@astrojs/react`, `@axe-core/playwright`, pa11y-ci, Lighthouse CI and linkinator all require Node 22 or newer.
- **Effect:** Keeping Node 20 meant an unsupported runtime, a toolchain pinned a year back, and a deploy Vercel would refuse. Node 24 is supported until April 2028.
- **Where it applies:** `.nvmrc`, `package.json` `engines`, and the CI workflow all say 24. Every other stack choice stays as briefed.

**D2. The repo stays local; no GitHub push or Vercel deploy from the build session.** Ruled by Aryah, 6 November 2026.
- **Why:** Creating a remote and deploying are outward-facing.
- **Effect:** Commits are made locally in `~/Documents/creation-and-connoisseur`. `docs/ADMIN_GUIDE.md` has the exact commands to create the repo, connect Vercel and set the environment variables.

**D3. The site is built in its own folder, not inside the repo where the work began.**
- **Why:** The session started in an unrelated repo. A sibling folder keeps the two projects' histories, CI and dependencies separate.

**D4. Blank scaffold, no redirects.**
- **Why:** Discovery found no prior site (`docs/PLAN.md`, section 1).
- **Effect:** `docs/CONTENT_INVENTORY.md` and `docs/REDIRECTS.md` record the empty result and the process for anything found later. `vercel.json` has an empty `redirects` list.

**D5. Only the four facts in the brief are stated on the site.**
- **The four facts:** the name; 501(c)(3) status; the focus on food insecurity at UNLV; that it is owned and run by Aryah Certain.
- **Everything else:** goes to `docs/OPEN_ITEMS.md` and renders as nothing. An empty field hides its whole section (heading included) rather than leaving a blank heading or placeholder text.

**D6. Current major versions.**
- **Versions:** Astro 7, `@astrojs/vercel` 11, `@keystatic/core` 0.6 with `@keystatic/astro` 6, Tailwind CSS 4, Playwright 1.65, `@axe-core/playwright` 4.14, pa11y-ci 5, Lighthouse CI 0.16, linkinator 8, TypeScript 5.9 (the newest major `@astrojs/check` supports), pnpm 10.
- **Why:** Each is the current release that runs on Node 24.
- **How they're pinned:** exact versions, through the lockfile.

**D7. pnpm holds back any package version published less than 7 days ago (`minimumReleaseAge`).**
- **Why:** This guards against a compromised release being pulled in before the ecosystem notices it. It's cheap supply-chain hygiene, and it's the kind of control public-sector reviewers ask about.

**D8. Build from a Claude Code session started in this folder.** Ruled by Aryah, 6 November 2026.
- **Why:** The discovery session started inside another, unrelated project, whose project-level commit hook blocked git commits in every repo touched from that session. The hook belongs to that project, so it was neither edited nor worked around.
- **Effect:** From Phase 1 on, the build runs from `~/Documents/creation-and-connoisseur`, where per-phase commits work. `docs/HANDOFF.md` carries the planned Phase 1 design across, and Phase 0's commit is made first in the new session.
