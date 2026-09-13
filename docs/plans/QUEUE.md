# PWEB project queue: the Pure Essentials London website

Opened 2026-09-13 by room PWEB. This is the project queue; it travels with the repo. Workspace
and resource tickets go to the workspace cabinet (`~/dev/.gumon-queue/PWEB/`), not here.

Rules (from charter 5.5.1 and ACAD's practice, read 2026-09-13):

- A row on `origin/main` is the lock. Whoever's name is in the owner column does the row. A chat
  message is a bell; this file is the truth. Before acting on a chat instruction, read the row.
- Rows enter `queued` only after the owner decides the structure (docs/research/00-direction.md
  section 7). Until then every row is `planning`.
- One row, one executor, one worktree, one brief from `docs/plans/EXECUTOR-BRIEF.md`. The
  executor line on the row names the model and the reason (charter 5.5.2).
- Done means the Lead re-ran the row's verify commands on main and pasted the raw output on the
  row or in the merge commit. Definition of done: `docs/plans/DEFINITION-OF-DONE.md`.
- Every row is 1 line in the table. No blank lines inside the table. Pipes inside a cell are
  escaped as `\|`.

## Rows

| Q | Phase | Title | Files touched | Acceptance (numbered, measurable) | Executor | Status | Owner | Verified |
|---|---|---|---|---|---|---|---|---|
| Q1 | 0 scaffold | Copy TTD config and Pages workflow, add .nojekyll, first green build | package.json, next.config.mjs, tailwind.config.ts, postcss.config.mjs, tsconfig.json, eslint.config.mjs, .github/workflows/nextjs.yml, public/.nojekyll, app/layout.tsx, app/page.tsx (placeholder) | 1 `npm run build` exit 0 and out/index.html exists; 2 `npm run lint` 0 warnings; 3 no file from TTD's app, components, public copied (diff of file lists) | sonnet-5 - config wiring across 7 files, checked by build | planning | PWEB | |
| Q2 | 0 scaffold | Design tokens and fonts | tailwind.config.ts, app/globals.css, app/layout.tsx (next/font Cormorant Garamond and Jost) | 1 the 9 tokens of 00-direction 2.2 exist as Tailwind colours; 2 fonts self-hosted: build output has no fonts.googleapis request (grep out/); 3 tabular-nums utility present | haiku-4.5 - spec is a table of hex values and 2 font names | planning | PWEB | |
| Q3 | 0 scaffold | Layout shell: header with recoloured logo and WhatsApp button, footer with legal block placeholders, mobile sticky bar | components/Header.tsx, Footer.tsx, StickyBar.tsx, lib/site.ts | 1 renders on every page; 2 footer shows registered name, number, office from lib/site.ts (values from PEL, placeholders until then); 3 sticky bar only under md; 4 WhatsApp links use wa.me/447767496803 with Ref SITE-HOME | sonnet-5 - several components, accessibility of nav, checked by build and lint | planning | PWEB | |
| Q4 | 0 scaffold | Data layer: types, groups map, families map, JSON schema, validate script in CI | lib/services.ts, lib/groups.ts, lib/families.ts, data/services.schema.json, scripts/validate-services.mjs, workflow step | 1 `node scripts/validate-services.mjs` exit 0 on the current file; 2 exit 1 on a file with a duplicate slug and on invalid JSON (2 fixtures); 3 live count 115 printed; 4 every priced row maps to exactly 1 family or to none, listed | sonnet-5 - schema and mapping logic with fixtures | planning | PWEB | |
| Q5 | 0 scaffold | Image pipeline and the 4 usable photos graded, resized, AVIF and WebP | scripts/images.mjs, images-src/, public/img/ | 1 every output under 300 kB and 1920 px or less; 2 hero 768 variant under 120 kB; 3 no certificate wall, no Valmont room in images-src (file list) | haiku-4.5 - mechanical sharp script with fixed sizes | planning | PWEB | |
| Q6 | 0 scaffold | Logo: SVG trace of the mark and wordmark, recoloured oak and espresso | public/logo/*.svg, components/Logo.tsx | 1 SVG under 20 kB; 2 visually matches the raster at 300 px (Lead compares); 3 no new shapes added | sonnet-5 - tracing needs judgement about curves; Lead checks by eye | planning | PWEB | |
| Q7 | 1 preview | Home page per 00-direction 3.2 | app/page.tsx, components/Hero.tsx, GroupCards.tsx, HowItWorks.tsx, ClinicFacts.tsx | 1 every section present in order; 2 no claim not in services.json or the facts list; 3 Lighthouse mobile LCP under 2.5 s on the built page | sonnet-5 - page assembly from spec | planning | PWEB | |
| Q8 | 1 preview | /treatments/ with the 11 categories, chips, per-row WhatsApp with name and Ref | app/treatments/page.tsx, components/PriceList.tsx | 1 91 priced rows and 24 quote rows rendered, 0 held or review names (gate 2); 2 every row has a wa.me link with the slug upper-cased as Ref (count equals 115); 3 prices equal price_gbp (gate 4) | sonnet-5 - data-driven page with counts to prove | planning | PWEB | |
| Q9 | 1 preview | /contact/ | app/contact/page.tsx, components/Hours.tsx, MapOnClick.tsx | 1 hours incl. bank holiday match the live site read of 2026-09-13; 2 map iframe not in the HTML until clicked; 3 email, WhatsApp, Treatwell link present | haiku-4.5 - static content from a fixed list | planning | PWEB | |
| Q10 | 1 preview | First deploy, custom domain pel.gumon.io, enforce HTTPS | Pages settings (Lead does this, irreversible-facing) | 1 `curl -sI https://pel.gumon.io/` HTTP 200; 2 certificate valid; 3 /treatments/ and /contact/ 200 | Lead - production-facing, charter 5.5.1 item 5 | planning | PWEB | |
| Q11 | 1 preview | External verify of the preview against Definition of Done gates 1 to 8 | none (measurement) | 1 raw output of every gate pasted on this row | Lead re-runs; an executor may run first as an independent reader | planning | PWEB | |
| Q12 | 2 after | Family pages, 24, from the cms rows | app/treatments/[family]/page.tsx, content/families/*.md | 1 24 pages built; 2 each lists its priced rows; 3 breadcrumbs and Service JSON-LD valid (Rich Results test) | sonnet-5 build, opus-5 for the copy of each family page (customer-facing, wrong is silent) | planning | PWEB and PEL | |
| Q13 | 2 after | /prices/ accordion by the 11 categories | app/prices/page.tsx | 1 same counts as Q8; 2 accordion keyboard-operable | sonnet-5 | planning | PWEB | |
| Q14 | 2 after | /about/ skeleton without claims | app/about/page.tsx | 1 no years, no doctors, no names until PEL confirms | opus-5 - copy | planning | PWEB and PEL | |
| Q15 | 2 after | /privacy/ and /terms/ under standing order A7 | app/privacy/page.tsx, app/terms/page.tsx | 1 Article 13 items present (checklist in research 02 section 4); 2 WhatsApp and Meta, GitHub host, health data note present | opus-5 - legal wording, true to what the site does | planning | PWEB, PEL reviews | |
| Q16 | 2 after | Consent banner, Consent Mode v2 defaults denied, equal Accept and Reject | components/Consent.tsx | 1 no cookie and no localStorage key before a choice (cookieStore.getAll and localStorage keys both empty); 2 Reject as prominent as Accept; 3 reopen link in footer | sonnet-5 | planning | PWEB | |
| Q17 | 2 after | Google tag behind consent | components/Analytics.tsx | 1 gtag script absent from HTML and network until Accept; 2 measured with ?gclid=TEST path too (TTD lesson) | sonnet-5 | planning | PWEB, PEL holds the tag id | |
| Q18 | 2 after | JSON-LD, sitemap, robots, Search Console check | app/sitemap.ts, app/robots.ts, components/StructuredData.tsx | 1 Rich Results test passes for LocalBusiness and BreadcrumbList; 2 sitemap lists every built page and none of the held rows | sonnet-5 | planning | PWEB | |
| Q19 | 2 after | Photo brief to the clinic through PEL | docs/photo-brief.md | 1 sent by PEL; 2 photos arrive on OneDrive | PEL | planning | PEL | |
| Q20 | 2 after | Editing guide for the clinic: README with the schema, 2 example rows, and prompts | README.md | 1 a person with no git knowledge can change 1 price following it (PEL test) | opus-5 - plain-English guide read by the client | planning | PWEB, PEL tests | |
| Q21 | 2 after | Lighthouse and performance gates 9 and 10 | none (measurement) | 1 raw scores pasted | Lead | planning | PWEB | |
| Q22 | 3 launch | Clinic domain switch at Namecheap (owner's order only) | none in repo; Pages settings | 1 owner's written order; 2 HTTP 200 on the clinic's domain; 3 Wix stays reachable until the owner says | Lead with the owner | planning | owner | |
