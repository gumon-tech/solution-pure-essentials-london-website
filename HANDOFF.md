# PWEB handoff: build the new Pure Essentials London website

Written 2026-09-13 by PEL, the line lead. Copy this file into the website repo as `HANDOFF.md` on
the first commit. Everything PWEB needs is in this file or linked from it; nothing has to be
recovered from anyone's memory.

## Who you are

```
room code     PWEB
repo          gumon-tech/solution-pure-essentials-london-website   (public, created by the owner)
folder        ~/dev/solution-pure-essentials-london-website
machine       komphet-mac
reports to    PEL (this file's author), never straight to WS
lead repo     ~/dev/solution-pure-essentials-london   (rulings, data, brief; read-only for you)
queue clone   ~/dev/.gumon-queue/PWEB   (bin/queue-clone PWEB if it does not exist)
model         Fable 5.1 (the owner opened the room on it 2026-09-13; PEL accepted, supersedes the Sonnet 5 line)
lore          off. Do not run lore capture in this repo.
```

Standing orders: `~/dev/gumon-workspace/docs/standing-orders/ALL.md`. No client names in git
(Q-PEL-003): the two clinic contacts are F and K in every file you write. No numbers from any
account in tickets to WS (Q-PEL-004). Do not touch the Wix site or the 2016 site.

## What to build, and by when

The owner promised the clinic a preview by Monday 2026-09-14, evening London time, and the owner
chose the scope on the desk (`docs/plans/DESK-2026-09-13-website-move.md`, round 4):

```
Monday preview   3 pages, real content, live at https://pel.gumon.io
                   /            home
                   /services    every live service with its price, grouped
                   /contact     address, hours, WhatsApp, Treatwell link, map
after Monday     one page per category, storytelling pages for SEO, privacy page,
                 consent banner then the Google tag, then the clinic's domain
```

## Stack: copy the TTD shop site, do not reinvent

Measured 2026-09-13 in `~/dev/solutions-taitamd-shop-website` (the owner allows PEL and TTD rooms
to read each other's work, ruling of 2026-09-13; client data stays out):

```
Next.js 15, React 19, Tailwind, static export to out/
deploy           .github/workflows/nextjs.yml  on push to main, GitHub Pages, build_type workflow
custom domain    set in the repo's Pages settings (gh api repos/<repo>/pages shows "cname"),
                 NOT a CNAME file in public/. basePath and assetPrefix stay empty when a custom
                 domain is used (next.config.mjs reads NEXT_PUBLIC_REPO_NAME; leave it unset).
```

Start by copying that repo's `package.json`, `next.config.mjs`, `tailwind.config.ts`,
`postcss.config.mjs`, `tsconfig.json`, `eslint.config.mjs` and `.github/workflows/nextjs.yml`.
Do not copy its pages, components, images or copy: that is another client's site.

DNS is already done: `pel.gumon.io` is a CNAME to `gumon-tech.github.io` (DNS only). After the
first deploy, set the custom domain in Pages settings to `pel.gumon.io` and enforce HTTPS; the
certificate takes a few minutes.

## Content: one data file, nothing invented

```
data/services.json   copy from lead repo data/pel-new-site-services.json  (176 rows)
                     show status == "live" only (115 rows). "held" and "review" rows are not
                     rendered anywhere, not in a menu, not in a sitemap, not in a search index.
                     This file is what the clinic will edit later in the GitHub web editor, so
                     keep it flat and keep the keys.
```

Rules that are not negotiable, each comes from a ruling in the lead repo:

1. No service, price or claim that is not in `services.json`. Standing rule 6.
2. Nothing from the held rows, in any wording. Q-PEL-023 stands until the clinic answers.
3. No medicine name anywhere, and no euphemism for one ("anti-wrinkle injections" is banned by
   name in `docs/pel-pom-review-en.html` section 7). Fillers, HIFU, PRP, devices are fine.
4. No before-and-after images. No testimonials in the preview.
5. Images: a person coming to be made beautiful, not empty rooms (owner's brief 2026-09-05).
   No needle in any image. Real venue photos are allowed and wanted.

Public facts, all from the current site or Treatwell (`research/01-business-profile.md`):

```
name       Pure Essentials London
address    155 King's Cross Road, London WC1X 9BN
hours      Mon to Sat 10:00 to 20:00, Sun 11:00 to 20:00   (re-check on the live site before publishing)
email      info@pureessentialslondon.com
instagram  @pureessentialslondon
whatsapp   https://wa.me/447767496803   (the clinic's business number, already on the live site)
treatwell  https://www.treatwell.co.uk/place/pure-essentials/
```

Every booking CTA opens WhatsApp with the treatment named, the same shape as the live site:

```
https://wa.me/447767496803?text=<urlencoded>
"Hi Pure Essentials, I'd like to ask about <service name>.\n\nRef: <SLUG>"
```
Use the row's `slug` upper-cased as the Ref, and `Ref: SITE-HOME` / `SITE-CONTACT` for page-level
buttons. Treatwell is the secondary route: one link on /contact and in the footer, not per service.

## Design brief from the client (Friday 2026-09-11, via the owner)

- Palette from 4 reference images: cream, beige, sand, light wood, warm indirect light, soft
  arches, boucle textures. Move away from the old site's white and grey.
- Logo: recolour to match. The only copy PEL has is a 120 px PNG from Wix
  (`efcedf_c3740da9dba941c2a3a83ada341e76f9~mv2.png`); ask PEL for the original before spending
  time on it. For the preview, a text wordmark in the palette is acceptable.
- Photos: `OneDrive-GumonTechnology 2/10-Work/PEL-Pure-Essentials-London/2026-09-11-client-photos/`
  on this machine. `venue-real-9/` are the clinic's rooms; `reference-ai-4/` are mood references,
  not to be published. Do not publish the certificate-wall photo (readable names) unless blurred.
  Resize to 1600 px wide max, WebP, under 300 kB each, before committing.
- The clinic liked the design of the TTD shop site. Same level of finish, not the same design.

## How to work

- Commit prefix `[PWEB]`. Small commits, push to main; the workflow deploys.
- Verify from outside after every deploy: `curl -sI https://pel.gumon.io/ | head -1` and read the
  page text; a build that succeeds is not a page that serves.
- Report to PEL by ticket in `~/dev/.gumon-queue/PWEB/machines/komphet-mac/queue/PEL/` with
  `Q-PWEB-nnn`, push with `bin/queue-push`, then message the `[PEL]` session. Measurements, not
  conclusions; PEL concludes.
- Anything about content, prices, compliance wording or the client goes to PEL, not to the owner.
- End every turn with: ทำได้เลย N · รอ: who/what.

## Verify (run before trusting this file)

```bash
cat ~/dev/gumon-workspace/.machine-id                      # komphet-mac
gh repo view gumon-tech/solution-pure-essentials-london-website --json visibility,url
dig +short CNAME pel.gumon.io                              # gumon-tech.github.io.
python3 -B -c "import json;d=json.load(open('$HOME/dev/solution-pure-essentials-london/data/pel-new-site-services.json'));print(len(d['services']),sum(s['status']=='live' for s in d['services']))"   # 176 115
ls "$HOME/Library/CloudStorage/OneDrive-GumonTechnology 2/10-Work/PEL-Pure-Essentials-London/2026-09-11-client-photos/venue-real-9" | wc -l   # 9
```

## กระดานเป้าหมาย

Measured 2026-09-13T05:3xZ by PWEB (main at 1009f7d). Standing order A8: re-measure every time.

**Last reached:** owner approved all decisions (docs/plans/DECISIONS-2026-09-13.md, daf5599) with 3 new
rules: image-led and people-led, Gemini allowed and client photos editable, many storytelling pages.
Queue is live (27 rows). Pages enabled with build_type workflow; first deploys running.

| # | Goal | State | Holder / waiting on |
|---|---|---|---|
| 1 | Resume, research, direction, owner decisions | DONE | - |
| 2 | Lead and Executor applied (LEAD, EXECUTOR-BRIEF, DEFINITION-OF-DONE, QUEUE) | DONE | - |
| 3 | Phase 0 scaffold Q1 Q2 Q4 Q6 | DONE, Lead re-run on each (79ca98b, 7f44e82, 4fc2fe3, 1009f7d) | - |
| 4 | Q3 layout shell | RUNNING | executor |
| 5 | Q23 imagery guideline | REVIEW, written b87c4d7, section 9 waits | SHOP and WS answers |
| 6 | Q24 generated image set (13 shots x 2) | RUNNING; home hero passed Lead check | executor, then Lead by eye |
| 7 | Q5 client photos edited warm | RUNNING (part 1) | executor |
| 8 | Copy for home, contact, 4 story pages | RUNNING | executor (opus) |
| 9 | Monday preview Q7 to Q11 at pel.gumon.io | OPEN; Pages on, custom domain after first green deploy | PWEB |
| 10 | Storytelling pages Q25 to Q27 | OPEN (set 1 copy running) | PWEB and PEL |
| 11 | Phase 2 pages, legal, consent, tag, SEO | OPEN | PWEB |
| 12 | Clinic domain switch Q22 | OPEN, owner's order only | owner |

**Done: 3 of 12.**

## Verify additions after the first resume

```bash
/bin/ls docs/plans docs/research                        # LEAD EXECUTOR-BRIEF DEFINITION-OF-DONE QUEUE; 00 01 02 03
git log --oneline | head -3
grep -c '^| Q[0-9]' docs/plans/QUEUE.md                   # 22
```
Note: `ls` is aliased to eza on this machine and prints nothing inside the agent's shell; use /bin/ls.
