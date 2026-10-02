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
python3 -B -c "import json;d=json.load(open('$HOME/dev/solution-pure-essentials-london/data/pel-new-site-services.json'));print(len(d['services']),sum(s['status']=='live' for s in d['services']))"   # 188 111 (lead repo, 2026-09-27)
ls "$HOME/Library/CloudStorage/OneDrive-GumonTechnology 2/10-Work/PEL-Pure-Essentials-London/2026-09-11-client-photos/venue-real-9" | wc -l   # 9
```

## กระดานเป้าหมาย

Measured 2026-09-27 after main e1c9e54 (Lead, second resume). Standing order A8: re-measure every time.

**Update 2026-09-28 (KPEL on komphet-air, owner's direct request):** Q43 and Q44 live, main 0a8a2eb, deploy success.
Q43: the clinic said the site looked too AI; every room and reception image is now the clinic's own photo, the
Japanese Head Spa section has 4 videos, the 2 held names are published on the owner's ruling, page titles are Title
Case. Q44: calm motion for buttons, links, price rows and images, and a drawn arch ornament. Specs:
docs/plans/Q43-real-photos-and-titles.md, docs/plans/Q44-motion-and-ornament.md. Still generated: the people
images on treatment story and family pages (the clinic has no treatment photos). Not yet seen by anyone:
motion and video autoplay on a real iPhone. OneDrive on air is "OneDrive-GumonTechnology" (no " 2");
scripts/build-images.mjs accepts both.

**Update 2026-09-29 (KPEL on komphet-air, owner's direct request):** Q45 live, main f53d078, deploy run 36595758926
success, read from outside. F's WhatsApp changes of 29 Sep: HIFU rows, LED mask and Skymedic removed, Swedish 1 hr,
waxing prices and (Hot Wax), capitalised treatment names on every page (8f86178), "155 ... Road" out of sentences
(postal addresses kept by Lead judgement, owner delegated). Spec docs/plans/Q45-client-feedback-2026-09-29.md. Open: ask F whether the full postal
address should change too (Lead kept it). Swedish 1 hr and back waxing without duration: owner confirmed. Q41 was rebased onto 0a8a2eb locally
on air (conflicts resolved: Title Case headings, price-row class, row description kept), build 0; NOT pushed and now
behind Q45; rebase again before review. Data now 205 rows / 122 live.

**Update 2026-10-02 (PWEB on komphet-mac):** Q46 live, main 5f459c1, deploy run 37024245297 success, read from
outside. F's WhatsApp (passed on by the owner): "Ladies' Waxing - Eyebrows" £15 and "Eyebrow Threading" £15 added to
Waxing, Ladies (no duration, shown without one); the mask brand name removed from the Anti-Aging Facial (0 on every
sitemap page). Spec docs/plans/Q46-client-feedback-eyebrows-and-mask.md. Closed as shown: owner 2026-10-03, not taken back to F. Q41 rebased onto 5f459c1 and pushed (origin
q41-story-layout 50abd40, force-with-lease over 3025a65), build and all checks 0; ready for PEL or WS review. Owner
2026-10-02: pushing is the Lead room's call, no need to ask the owner. Data now 207 rows / 124 live.

**Update 2026-10-03 (PWEB on komphet-mac, room closed by the owner):** F checked Q46 on the live site and
replied "every things looks good" (WhatsApp, 2026-10-03 00:23). The owner decided Q46 is not taken back to F; other
open items for F (Q45 full postal address, Q14 about page) stay open. Next call with F: Tuesday 4pm (agreed in the
WhatsApp group, time zone not stated). The owner will present 1) the plan to move the website to the new site (website
only) and 2) a small Google Ads pilot, to test and start collecting data. Prep that the pilot needs: Q16 consent banner
then Q17 Google tag (tag ID from PEL), and Q22 domain switch (owner's order). No PEL ticket filed for Q46: the queue
clone ~/dev/.gumon-queue/PWEB does not exist on komphet-mac; the next room should create it (bin/queue-clone PWEB)
and report Q46 and the Q41 push to PEL.

**Last reached:** Q42 live. The clinic's WhatsApp feedback of 18 and 21 Sep (K and F) is applied and the
owner's Title Case order (2026-09-26) is site-wide; deploy run 36223681076 success; live /treatments/ 200
with Japanese Head Spa, read from outside and seen in a browser. Spec and the item-by-item map:
docs/plans/Q42-client-feedback-2026-09-18-21.md. Queue: docs/plans/QUEUE.md, 42 rows.

| # | Goal | State | Holder / waiting on |
|---|---|---|---|
| 1 | Q1 to Q12, Q15, Q18, Q20, Q21, Q23 to Q39 build and fixes | DONE and live | - |
| 2 | Q42 client feedback + Title Case | DONE and live | - |
| 3 | Q42 held: "Anti-Wrinkle Injections", "IV (Intravenous) Drips" | DONE and live (Q43): owner ruled 2026-09-27 to publish as the clinic asked, after being told the POM advertising risk | - |
| 4 | Q42 media: K's venue photos, F's 4 head spa videos | DONE and live (Q43): real photos on every room and reception slot, 4 videos under Japanese Head Spa; owner 2026-09-28: no stills cut from video as page images | - |
| 5 | Page title tags sentence case | DONE and live (Q43): all <title> Title Case, check-title-case now reads <title> and og:title | - |
| 6 | PEL review of story sentences rewritten in Q42 (facials, HIFU, body, microneedling) | OPEN | PEL |
| 7 | Q41 story re-layout | Branch q41-story-layout 50abd40, rebased onto Q46 and pushed 2026-10-02, all checks 0; NOT merged | PEL or WS review of before and after (A6: owner no longer the gate) |
| 8 | Q40 re-verify | open; round 1 PASS 28 of 28 | Q20 and Safari need the owner's session |
| 9 | Q13 /prices/ | queued, likely obsolete after Q36 | PEL |
| 10 | Q14 about page | queued | clinic answers |
| 11 | Q16 consent + Q17 Google tag | hold | tag ID from PEL |
| 12 | Q22 clinic domain switch | queued | owner's order only |

**Done: 2 of 12 goal rows fully, 36 of 42 queue rows done.** Next unblocked PWEB work: row 5, then rebase Q41 onto main.

Resume notes: HANDOFF sections above "กระดานเป้าหมาย" were written 2026-09-13 and are background only.
Data now: lead repo file 188 rows / 111 live (PEL, not updated with Q42); this repo data/services.json 197 rows /
118 live after Q42, so the two files now differ on purpose; tell PEL. PEL is reached by ticket in
~/dev/.gumon-queue/PWEB/machines/komphet-mac/queue/PEL/. About 30 stale executor worktrees under .claude/worktrees
can be removed. The owner's WhatsApp is in Chrome "Browser 1" (select_browser), not the Business account.

Lessons recorded this session (docs/plans/INCIDENTS.md and memory): quote a check only after reading its exit code,
and capture the exit code explicitly because shell errexit did not gate a heredoc check here; one polite fetch script
for the clinic's site; render checks need an assertion independent of the renderer; resumed executors write into the
Lead's current directory; never pull or copy from the PEL lead repo's working tree, read origin/main; stop local
servers by the PID captured at launch, never by matching a name pattern.

## Verify additions after the first resume

```bash
/bin/ls docs/plans docs/research                        # LEAD EXECUTOR-BRIEF DEFINITION-OF-DONE QUEUE; 00 01 02 03
git log --oneline | head -3
grep -c '^| Q[0-9]' docs/plans/QUEUE.md                   # 42
```
Note: `ls` is aliased to eza on this machine and prints nothing inside the agent's shell; use /bin/ls.
