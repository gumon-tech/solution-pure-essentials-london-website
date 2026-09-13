# Q5 part 3 report: image pipeline (AVIF/WebP/JPEG) and typed image map

Row: Q5 part 3, a deterministic sharp script with fixed sizes and budgets, proven by file sizes.
Model: sonnet-5.

## Baseline: committed at 97dfa14

The 18-slot version of this work (13 original slots + `story-laser-hair` + 4 real room photos,
with the Lead's own re-run and the `lift`->`move` alt fix) is committed and pushed to `origin/main`
at `97dfa14`. This worktree's `git log --oneline -2` / `git status` at the start of this round of
work showed a clean tree at `97dfa14`, matching `origin/main` exactly. Everything below is on top
of that baseline, uncommitted (per the row: "do not commit, do not push — the Lead commits").

## What changed on top of 97dfa14

1. **6 category header slots added** (`cat-laser-skin`, `cat-skin`, `cat-skinboosters`,
   `cat-carboxy`, `cat-waxing-ladies`, `cat-waxing-men`), all ratio 4:5, all `ai: true`, sourced
   from `generated-2026-09-13/`, matching `docs/design/imagery-guideline.md` section 10's new
   "Category header images" table read from `origin/main` (see below). `cat-skin` crops the right
   12% (removes the therapist's chin, per the guideline table); `cat-carboxy` keeps the top 72%
   (removes the practitioner's black trousers, per the table) — both confirmed by looking at the
   cropped output, see item 6. Total slots: 24.
2. **Alt text re-screened for outcome verbs.** The Lead's message banned lift, tighten, smooth,
   firm, contour, slim, improve, reduce, remove in alt text. Scanned all 24 alts programmatically
   (case-insensitive substring match on all 9 roots): 1 hit in my own first draft —
   `cat-waxing-ladies` used "smoothing"; changed to "pressing... against". Re-scanned: 0 hits
   across all 24. `face-card`'s earlier "lift" (from the 97dfa14 baseline) was already "move" in
   both `images-src/manifest.json` and `lib/images.ts` at 97dfa14 — the Lead's fix was already in
   the tree this round started from, so no further change was needed there.
3. **`images-src/manifest.json`'s `crop` field extended** with 2 new shapes, both implemented in
   `scripts/build-images.mjs`:
   - `{ rightPct, ratio }`: remove `rightPct`% off the right (stays left-anchored), then restore
     `ratio` by trimming the bottom only (stays top-anchored). Used by `cat-skin` (12%).
   - `{ topKeepPct, ratio }`: keep only the top `topKeepPct`% of the height (stays top-anchored,
     drops the bottom), then restore `ratio` by trimming both sides equally. Used by `cat-carboxy`
     (72%).
   The original `{ topPct, ratio }` shape (home-hero) is unchanged.
4. **Native/source-width output added when a (possibly cropped) source's own width falls strictly
   between two standard steps** (480/800/1200/1600), so no resolution is wasted below the next
   step up: e.g. `home-hero` (cropped to 1170 px wide) now also gets `home-hero-1170.*`, in
   addition to 480 and 800. This widened output is budgeted the same way as any other: >800 px
   uses the 200 kB budget, <=800 px uses the 90 kB budget (`cat-carboxy`'s extra output at 663 px
   uses the 90 kB budget; `home-hero`'s at 1170 px, `cat-skin`'s at 817 px, and `room-trolley`'s at
   980 px use the 200 kB budget). Included in `lib/images.ts`'s `srcset` for every affected slot.
   Affected slots and their extra width: `home-hero` 1170, `face-card`/`body-card`/`laser-card`/
   `wellness-card`/`step-1-message`/`step-2-consultation`/`step-3-treatment`/`step-4-aftercare`/
   `cat-laser-skin`/`cat-skinboosters`/`cat-waxing-ladies`/`cat-waxing-men`/`room-analyser`/
   `room-couch` 922 (all these 4:5 sources are 928x1152, 6 px off true 4:5, so the ratio-matching
   crop trims to 922 wide even with no manifest `crop` field), `contact-welcome`/`story-hifu`/
   `story-facials`/`story-body-contouring`/`story-laser-hair` 1264 (1264x848 sources are 848x848
   off true 3:2 by a few px, same effect), `room-trolley` 980 (`room-02.jpg` is exactly 980x1225,
   4:5 exact, but 980 is not a standard step), `cat-skin` 817, `cat-carboxy` 663. Not affected:
   `room-warm` (`room-07.jpg` is exactly 1200x1500, 1200 already a standard step, no gap).
5. **Bug found and fixed while implementing addition 4**: the `fallback` field was hard-coded as
   `` `/img/gen/${slot}-800.jpg` ``. Every slot before this round had a native/cropped width
   >=800, so an `-800` file always existed — but `cat-carboxy`'s native width is only 663, so no
   `cat-carboxy-800.jpg` is ever generated, and the old hard-coded fallback pointed at a
   non-existent file. Fixed: fallback now picks the largest emitted width that is <=800 (still 800
   for every slot except `cat-carboxy`, which now correctly falls back to
   `cat-carboxy-663.jpg`). Verified after the fix: every one of the 24 `fallback` paths and all
   228 `srcset` URLs in `lib/images.ts` resolve to a file that exists in `public/img/gen`
   (`fs.existsSync` check on every URL extracted from the file, see item 5 below).

## Guideline confirmation (read only, not merged)

`docs/design/imagery-guideline.md` section 10 at `origin/main` (fetched fresh this round) has a
new "### Category header images (Lead check 2026-09-13)" table listing exactly these 6 slots,
sources and crops, matching what the Lead's message specified and what is now in
`images-src/manifest.json`. Read with `git show origin/main:docs/design/imagery-guideline.md`;
`docs/design/**` was not touched or merged into this worktree (it is on the "do not touch" list).

## Images viewed (Read tool, full size, before writing alt text)

All 6 new sources were opened before writing alt text: `cat-laser-skin-a.jpg`, `cat-skin-a.jpg`,
`cat-skinboosters-b.jpg`, `cat-carboxy-a.jpg`, `cat-waxing-ladies-b.jpg`, `cat-waxing-men-a.jpg`
(all in `generated-2026-09-13/`). The 18 slots from the 97dfa14 baseline were not re-viewed this
round (already viewed and alt-written in the prior round); `face-card`'s alt was already "move"
(not "lift") in the tree this round started from, so no re-view was needed for that fix.

## Acceptance

### 1. `node scripts/build-images.mjs`

```
node scripts/build-images.mjs > /tmp/pweb-q5c-5.log 2>&1; echo REAL_EXIT=$?
REAL_EXIT=0
```

No "Budget problems" section printed (0 outputs needed a quality step-down across all 228 files).
Excerpt of the printed table — `home-hero` and `cat-carboxy` (the smallest native-width slot):

```
slot                   width  ext  bytes
home-hero              480    avif  9987
home-hero              480    webp  16750
home-hero              480    jpg   20562
home-hero              800    avif  23689
home-hero              800    webp  38658
home-hero              800    jpg   49355
home-hero              1170   avif  48112
home-hero              1170   webp  70112
home-hero              1170   jpg   107033
...
cat-carboxy            480    avif  11787
cat-carboxy            480    webp  15178
cat-carboxy            480    jpg   25319
cat-carboxy            663    avif  22246
cat-carboxy            663    webp  25316
cat-carboxy            663    jpg   48322
```

Full 228-row table is in this task's terminal transcript.

### 2. `du -ch public/img/gen | tail -1` and file count

```
du -ch public/img/gen | tail -1
9.5M    total

find public/img/gen -type f | wc -l
     228
```

228 = the 24 slots' widths x 3 formats, where each slot's width count is 2 (`cat-carboxy`, whose
native width 663 is below 800, so only 480 and 663 are emitted) or 3 (14 slots capped at
480/800/native, where native is 817-1170) or 4 (5 slots at 480/800/1200/native-1264:
`contact-welcome`, `story-hifu`, `story-facials`, `story-body-contouring`, `story-laser-hair`) or
3 exactly at a standard step with no native extra (`room-warm`, 480/800/1200). Arithmetic:
9 slots x 9 (480/800/922 each x3 formats) + 4 room-ish slots x 9 (`room-warm` 480/800/1200,
`room-trolley`/`room-analyser`/`room-couch` 480/800/native) + 5 slots x 9 (`cat-laser-skin`,
`cat-skin`, `cat-skinboosters`, `cat-waxing-ladies`, `cat-waxing-men`) + 5 slots x 12
(480/800/1200/1264) + `cat-carboxy` x 6 (480/663) = 81 + 36 + 45 + 60 + 6 = 228.

### 3. Every 1200-or-wider (or, for a native width, >800 px) output <= 200 kB; every narrower <= 90 kB

```
node -e '
const fs = require("fs"); const path = require("path");
const dir = "public/img/gen"; let bad = [];
for (const f of fs.readdirSync(dir)) {
  const m = f.match(/-(\d+)\.(avif|webp|jpg)$/); if (!m) continue;
  const width = Number(m[1]); const size = fs.statSync(path.join(dir, f)).size;
  const budget = width > 800 ? 200*1024 : 90*1024;
  if (size > budget) bad.push({f, size, budget, width});
}
console.log(bad.length === 0 ? "PASS: all within budget" : JSON.stringify(bad, null, 2));
'
PASS: all within budget
```

### 4. `npm run build` and `npm run lint`

```
npm run build > /tmp/pweb-q5c-build5.log 2>&1; echo BUILD_EXIT=$?
BUILD_EXIT=0

npm run lint > /tmp/pweb-q5c-lint5.log 2>&1; echo LINT_EXIT=$?
LINT_EXIT=0
```

(`lint` printed nothing beyond the npm banner — 0 errors, 0 warnings, under `--max-warnings=0`.
`build` also shows a `/treatments` route now, from another executor's work already merged into
`origin/main` at `03c89f0`/`5b2dc4e` — not touched by this row.)

### 5. `lib/images.ts` alt lines, all 24 slots, and referential integrity

```
home-hero:              Woman lying back, eyes closed, as a therapist's hands apply cream to her cheek
face-card:              Close view of a relaxed face as fingertips move along the cheekbone
body-card:              Hands pressing along a client's lower back while lying face down under a towel
laser-card:             Seated woman in eyewear and a robe, therapist holding a device to her arm
wellness-card:          Hands pressing across a client's shoulders while lying face down, warm light
step-1-message:         Hands holding a phone with an unreadable screen, resting on a soft cushion
step-2-consultation:    Two women smiling in conversation, one holding a notebook and pen
step-3-treatment:       Therapist placing a warm stone along a client's back, face out of frame
step-4-aftercare:       Woman in a robe smiling while holding a cup of tea
contact-welcome:        Two women smiling across a curved wooden reception desk
story-hifu:             Woman lying back, eyes closed, as a handheld device is held to her jaw
story-facials:          Therapist brushing a cream mask onto a relaxed, smiling woman's cheek
story-body-contouring:  Two women looking at a tablet together, its screen not readable
story-laser-hair:       A therapist in gloves moves a handheld device along a client's lower leg
room-warm:              A treatment room at Pure Essentials London with a wood-slat wall and couch
room-trolley:           A treatment room at Pure Essentials London with a trolley of products
room-analyser:          A treatment room at Pure Essentials London with white cabinetry and a couch
room-couch:             A treatment room at Pure Essentials London with rolled towels on the couch
cat-laser-skin:         Woman lying back in eyewear as gloved hands hold a device near her cheek
cat-skin:               Woman lying back, eyes closed, a gloved hand holding a device to her cheek
cat-skinboosters:       Two women seated, one holding a hand mirror, the other writing in a notebook
cat-carboxy:            Two smiling women looking together at pages in an open book
cat-waxing-ladies:      Gloved hands pressing a wax strip against a client's lower leg
cat-waxing-men:         Gloved hands applying a wax strip along a man's bare back
```

Programmatic checks run:
- Word count 6-14 for all 24: pass.
- No banned outcome verb (lift/tighten/smooth/firm/contour/slim/improve/reduce/remove,
  case-insensitive substring) in any of the 24: pass (after the `cat-waxing-ladies` fix above).
- `ai` flags: 20 `true` (14 original AI slots + 6 new category slots), 4 `false` (the 4 real room
  photos) — `m.filter(e=>e.ai===true).length` / `===false` on the parsed manifest: 20 / 4.
- Every `fallback` path in `lib/images.ts` resolves to an existing file under `public/`: 24/24.
- Every `srcset` URL in `lib/images.ts` resolves to an existing file under `public/`: 228/228
  distinct URL references found in the file, all exist (checked with `fs.existsSync`).

### 6. Crop checks: `cat-skin` and `cat-carboxy` after cropping (also home-hero, unaffected by this round)

`cat-skin-817.jpg` (817x1021, the slot's largest output) opened with the Read tool: the
therapist's chin, visible at the top-right edge of the uncropped `cat-skin-a.jpg`, is fully
cropped away — only the therapist's shoulder/sleeve remains at the right edge, no face or chin.

`cat-carboxy-663.jpg` (663x829, the slot's largest output) opened with the Read tool: no black or
dark trousers remain. The crop (top 72% kept, then centred side-trim to 4:5) cuts off well above
where the practitioner's black trousers were visible in the source (`cat-carboxy-a.jpg`), leaving
only the 2 women from about the waist/hands up, in front of the arch.

`home-hero-800.jpg` (unaffected by this round's changes) was already confirmed clear of the
chin/face in the prior round's report; `home-hero-1170.jpg` (the new native-width output) shows
the same crop at higher resolution, same conclusion.

## Mismatches with the brief

None new this round beyond what the prior round already reported (home-hero has no 1600 px
output, for the same post-crop-width reason; `docs/design/imagery-guideline.md` in this worktree
is read via `git show`, not merged, per the "do not touch `docs/design/**`" rule; `room-trolley`'s
real, un-edited source shows readable product-brand text, flagged for PEL). 1 new item to flag:

1. **`room-trolley`'s brand-visible source is now also the direct source for a category-adjacent
   feature** (nothing new touches it this round, just re-flagging since it is still in the
   manifest as-is): no action taken by this executor, per the "sources are read-only, no edit
   instruction given" reasoning from the prior round.

## Partial completion

None outstanding. All 24 slots built, budgeted, typed, and verified against `npm run build` /
`npm run lint`; the fallback bug (item 5 above) was found and fixed before this report, not left
for the Lead to discover.

## Files changed (on top of 97dfa14; nothing committed, per the row)

- `images-src/manifest.json`: +6 entries (24 total), `cat-waxing-ladies` alt corrected to drop a
  banned verb.
- `scripts/build-images.mjs`: +`rightPct`/`topKeepPct` crop shapes, +native-width output logic,
  +fallback-width fix, `budgetFor()` generalised to bucket any non-standard width by `>800`/`<=800`
  instead of exact-match on the 4 standard widths.
- `lib/images.ts`: regenerated, 24 `IMAGES` entries, `ImageSlot` type has 24 members.
- `public/img/gen/*`: 228 files total, 9.5M (`du -ch`); 102 new files beyond the 126 from 97dfa14
  (6 new slots x up to 9 files each, plus the native-width extras for the pre-existing slots that
  needed one).
- `docs/plans/Q5-image-pipeline-report.md`: this file, rewritten for the 24-slot state.

No OneDrive file was written to. No source image was committed into the repo. `git status
--porcelain` shows `images-src/manifest.json`, `lib/images.ts`, `scripts/build-images.mjs` modified
and only new files under `public/img/gen/` untracked — nothing under `data/`, `docs/research/`,
`docs/design/`, `docs/plans/QUEUE.md`, `HANDOFF.md`, `app/`, `components/`, other `lib/` files,
`.github/`, or `public/logo/` was touched. `package.json`/`package-lock.json` are unchanged this
round (already committed at 97dfa14).
