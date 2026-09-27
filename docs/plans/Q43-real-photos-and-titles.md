# Q43: the clinic's real photos in place of generated ones, head spa videos, Title Case page titles

Written 2026-09-27 on komphet-air (room KPEL, at the owner's direct request in chat).
Built on branch `q43-real-photos`, merged to main on the owner's order of 2026-09-27
("ขึ้นเว็บจริงเลย").

## What the owner passed on (2026-09-27)

1. The clinic says the pictures look too AI and wants the clinic's real photos used on the site.
2. The Title Case order also covers titles, not only headings and buttons: "Book online" becomes
   "Book Online" on buttons *and* titles.
3. The photos and videos from the WhatsApp group are now on this machine (items B3 and B4 of Q42).

## Why the site reads as AI (measured, not guessed)

Before this row, 41 of the 45 image slots were generated. Every one was prompted with a room that
the clinic does not have: plaster arches, cove light, boucle, oak (imagery-guideline.md section 6).
The clinic's real rooms are white cabinets, pale wood floors, a marble splashback and a gold head
spa room. A visitor who knows the clinic sees a different building. The 4 slots that were real
(`room-*`) used the 2026-09-11 phone photos, 2 of them re-edited through Gemini.

## Sources (OneDrive, not in git; outputs in public/ are committed)

```
10-Work/PEL-Pure-Essentials-London/2026-09-18-client-photos/
  venue-real-5/      reception, room-headspa-gold, room-white-couch, room-facial-mirror, room-devices
                     (K, 18 Sep 23:23 to 23:24; the 6th photo in the chat is a byte-identical duplicate)
  head-spa-videos-4/ head-spa-1..4.mp4 (F, 21 Sep 13:37; 25, 23, 14 and 39 s, 576x1024)
  head-spa-stills/   halo-waterfall, scalp-wash, shampoo (frames from videos 2, 1, 3)
  head-spa-menu.jpg  F's menu card, already transcribed into services.json by Q42
```

Video 4 is **not used**: it shows the client's face (eye mask, nose and mouth visible). Use it
only after the clinic confirms that person agreed to be on the website.

## What changed

Slot sources repointed (every page that places the slot changes with it):

| Slot | Was | Now |
|---|---|---|
| room-warm | 2026-09-11 wood-slat room | head spa gold room (18 Sep) |
| room-analyser | Gemini-edited white room | facial room with skin analysis mirror |
| room-trolley | 2026-09-11 white room | white room with rolled towels |
| room-couch | Gemini-edited white room | device room, crop kept left on the laser platform (focusX 0.18) |
| contact-welcome | generated: 2 women at a wooden reception desk that does not exist | device room, 3:2 |

New slots: `real-reception` (3:4, the Pure Essentials reception with the sign), `headspa-halo`,
`headspa-wash`, `headspa-shampoo` (stills from the videos).

Placements:

| Page | Place | Was | Now |
|---|---|---|---|
| / | hero | generated facial | real reception |
| / | 4 group cards | generated people | facial room, white room, device room, head spa (real client) |
| / | The Clinic | room-trolley | gold head spa room |
| / | Ready When You Are | generated reception | head spa wash (real client) |
| /contact/ | hero | generated reception | real reception |
| /treatments/ | hero | generated consultation | device room |
| /treatments/ | Japanese Head Spa | generated shoulders picture | head spa still + 3 videos |
| /our-clinic-kings-cross/ | hero, where-it-is, wellness | generated | reception, head spa x2 |
| /your-visit/, /first-visit-guide/ | contact-welcome | generated reception | real reception |
| 4 story pages (facials, HIFU, body contouring, laser hair removal) | contact-welcome at the call to action | generated | device room |

Still generated: the people images on the treatment story pages and family pages, the 4 How
It Works steps, and category headers on /treatments/. There are 5 real room photos and 3 usable
video frames, not enough for every treatment page without repeating, and the clinic has no photos of
treatments in progress except the head spa.

Head spa videos (components/HeadSpaVideos.tsx): muted, no audio track in the files (`-an`),
`preload="none"`, play only while on screen (IntersectionObserver, threshold 0.4), pause off
screen. Reduced motion: poster and controls, nothing moves by itself. 432 px wide H.264, 3 files,
3.1 MB together, fetched only when the visitor reaches the section.

Titles: 3 page titles and the redirect stub title were sentence case ("Treatments and prices",
"Privacy notice", "Website terms", "Page moved"). Fixed, and scripts/check-title-case.mjs now also
reads `<title>` and `og:title`, so CI fails if one comes back. Against the build before the fix,
the extended check reported exactly those strings.

scripts/build-images.mjs: `crop.focusX` for off-centre side trims; a source path falls back
between the two OneDrive mount names ("OneDrive-GumonTechnology 2" on mac, without " 2" on air).
Re-running the script re-encodes every AVIF with small byte differences on this machine; only the
changed slots' files are committed.

## Checks (2026-09-27, komphet-air, exit codes read)

validate-services 0, next build 0, build-redirect-stubs 0, check-redirect-stubs 0,
check-title-case 0 (177 strings, 0 not Title Case, 166 html files), check-family-pages 0,
check-story-pages 0, check-legal-pages 0, check-structured-data 0, lint 0, tsc 0.
Q42's 32 names and prices re-read from the built /treatments/ text: all present; Eberlin,
Etherea, "Anti-Wrinkle Injections", "Intravenous", "Golden Micro" absent.
Browser at 1440 and 390: hero, cards, contact, our clinic, head spa section seen; no horizontal
scroll at 390. Videos played in view and paused off screen at 1440. At 390 the in-app browser
pane was hidden and did not render, so autoplay at phone width is **not yet seen**; check on a
phone after deploy.

## Open for the owner

1. Merge and deploy (this branch), after looking at the before and after.
2. Anti-Wrinkle Injections and IV Drips: still held (Q42 B1, B2). The owner told F in the chat
   that they will be updated; that wording is still not publishable in the UK. See the report.
3. Video 4 consent.
4. If the clinic wants less AI on the treatment pages too: a short photo session of real
   treatments (hands, devices, no faces needed) is the only way to replace them without
   repeating the same 5 rooms.

## Owner's rulings, 2026-09-27 (after reading the report above)

```
deploy          "ขึ้นเว็บจริงเลย"          merge to main and deploy
held items      "ทำตามลูกค้าแจ้งนะครับ"      publish as the clinic asked
video 4         "ใส่ได้ ลูกค้ายินยอมแล้ว"    the client in the video has consented
```

- New live rows in `skinboosters`, the same shape as PRP (no price, "Ask for a quote",
  consultation first): `anti_wrinkle_injections` "Anti-Wrinkle Injections" and
  `iv_intravenous_drips` "IV (Intravenous) Drips". They render on /treatments/ only. The older
  held IV, vitamin and B12 rows from the Wix menu stay held; the clinic did not ask for them.
- The owner was told before ruling that UK law bars advertising prescription-only medicines
  to the public and that the ASA treats "anti-wrinkle injections" as naming one (lead repo
  pel-pom-review-en.html section 7). The ruling is the owner's and the clinic's risk decision.
- check-family-pages and check-story-pages no longer ban the word "anti-wrinkle"; botox,
  botulinum and lidocaine stay banned, and no page names a medicine.
- Video 4 added (caption "Scalp Massage", poster slot `headspa-massage`); the grid is 2 by 2 on a
  phone and 4 across from 640 px. 4 files, 5.2 MB together, none fetched until the visitor
  reaches the section.
