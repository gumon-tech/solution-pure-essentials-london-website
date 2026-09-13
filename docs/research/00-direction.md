# Website direction for Pure Essentials London: findings, proposed structure, decisions to take

Written 2026-09-13 by room PWEB (Lead). Sources: the 3 raw research reports in this folder
(01 design patterns, 02 UK compliance, 03 SEO and static stack), the lead repo's brief
(`solution-pure-essentials-london/docs/pel-website-move-brief.md` sections 1 to 6), the desk file
of 2026-09-13, `data/services.json` (176 rows, 115 live), the 4 reference images and 9 venue
photos on OneDrive, the real logo files, the TTD shop site (measured in the browser 2026-09-13),
and the live Wix site. Nothing here is a ruling; the owner decides in section 7 and PEL owns
content and compliance wording.

## 1. Findings that change the plan (measured, not assumed)

| # | Finding | Measured how | Consequence |
|---|---|---|---|
| 1 | The 115 live rows are 2 kinds: 91 priced bookable rows (source booking) and 24 treatment pages without a price (source cms). | `python3` count over `data/services.json`, 2026-09-13 | The 24 cms rows are the natural "storytelling" pages (one per treatment family); the 91 priced rows are the price list. The site needs both kinds, not one grid. |
| 2 | 6 live names are duplicated with different prices (3D Lipo, Collagen, Emsculpt, Full Face, Men's Waxing Full Leg, Therapeutic Lymphatic Drainage Massage). | same count | A price list cannot show 2 rows called Full Face at GBP 300 and GBP 450 without a qualifier. PEL must add a distinguishing word before the preview; PWEB renders duration next to the name meanwhile. |
| 3 | Of the 9 venue photos, 1 is warm (wood slats, gold plaster, brass sconces); 5 are white-and-grey treatment rooms; 2 are the certificate wall (readable names); 1 shows a Valmont brand room that may not be the clinic's. | viewed each file 2026-09-13 | The brief's cream and sand palette cannot come from the photos. The palette must be carried by the interface, and photos need warm colour grading and small crops. A short photo brief for the clinic is needed for the pages after Monday. |
| 4 | The real logo is a geometric diamond mark over thin geometric capitals "PURE ESSENTIALS" with "LONDON" small, black on white, 629 x 289 raster, no vector. A second older mark (leaf shape, navy) exists as the OG image. | PEL answer 2026-09-13, files on OneDrive `logo/` | Typography should echo the wordmark: thin geometric capitals for labels and navigation. The mark can be recoloured to the palette (client's words); it cannot be redrawn. A vector trace is a small executor job. |
| 5 | Live site hours: Monday to Saturday 10:00 AM to 8 PM, Sunday 11:00 AM to 8 PM, Bank Holiday 11:00 AM to 8 PM. | `curl` of /contact 2026-09-13 | Matches research 01; Bank Holiday line is new and goes on /contact. |
| 6 | Treatwell venue page returns HTTP 403 from this machine (geo-block). | `curl` 2026-09-13 | The 4.8 from 1,212 figure is NOT MEASURED today; it must be re-read (browser, UK view) and dated before it goes on the site. |
| 7 | The client used no tone adjective. Their words: palette "similar to these images", "move away from the white and grey", likes the TTD site's design, "user-friendly and easy to maintain". No approved tagline; "30 years" and "doctors" are unevidenced and banned until confirmed. | PEL answer 2026-09-13 | Copy leads with facts we hold: King's Cross, hours, the treatment list, prices, consultation first. |
| 8 | The TTD services page pattern the client liked: category chips, cards per service, one row per duration with price and a WhatsApp icon, prefilled message per price. | browser 2026-09-13 | Same interaction, different visual language (TTD is deep green and gold; ours is cream and oak). |
| 9 | Monday 2026-09-14 is a progress showing, not a hard deadline (owner verbatim in the desk file). | desk file, section after round 4 | Research first is compatible with the owner's promise. Whatever is ready is shown. |

## 2. Design direction

### 2.1 What the site should feel like, in the client's own terms

Warm indirect light, arches, plaster, boucle, light wood (the 4 references), with the clinic's own
geometric mark. Not white and grey. Professional and controlled: no urgency, no offers, no
pop-ups, no medicine names (research 02 sections 1.1 and 1.4).

### 2.2 Palette (tokens, WCAG contrast computed in research 01)

| Token | Hex | Use |
|---|---|---|
| cream | #F7F2EA | page ground |
| linen | #F3EDE3 | alternate sections |
| sand | #EDE4D6 | cards, price rows, arch fills |
| beige | #E3D6C3 | hairlines, borders |
| espresso | #2B2420 | headings and body text (13.7:1 on cream) |
| cocoa | #4A3F35 | secondary text (9.2:1) |
| walnut | #6B5A4A | captions, meta (5.9:1) |
| oak | #8A6A4E | primary button fill, the logo recolour (white on oak 4.9:1) |
| wood | #A67B5B | decorative rules and icons only, never text |

Rule: text is cocoa or darker; wood and sand are surfaces. The WhatsApp button keeps its own
recognisable green only as the icon, on an oak or espresso button, so the palette stays intact.

### 2.3 Typography

Recommended pairing: Cormorant Garamond (display, 500 and 600, one italic word per heading at
most) with Jost (body, navigation, prices, labels; 400 and 500; uppercase labels with 0.08 em
tracking). Jost's geometric capitals echo the logo wordmark; Cormorant brings the warmth the
references have and the logo lacks. Both are Google Fonts, self-hosted at build time through
next/font (research 03 section 4), so no request goes to Google and no layout shift. Tabular
figures for every price column.

Alternative if the owner prefers the logo's voice alone: Jost display in thin weight with Manrope
body (all sans, quieter, closer to the Wix site's current feel). Not recommended: it drifts back
toward the white-and-grey look the client asked to leave.

### 2.4 Layout devices

Arched image masks on hero and category images (border-radius 999px 999px 0 0), generous space,
asymmetric editorial grid (max width 1280 px, no 3 equal columns as a habit), one sticky CTA:
WhatsApp on a bottom bar on mobile, a top-right button on desktop. Motion limited to a 200 to
400 ms fade and 8 to 16 px rise on scroll, honoured by prefers-reduced-motion. No parallax, no
autoplay video, no cursor effects.

### 2.5 Images

- Hero on Monday: the warm wood room, cropped to the sconce and slatted wall, warm graded. It is
  the only real photo that matches the brief.
- White rooms: warm grade (+8 to +12 warmth, slight lift of shadows), use small in a row of 3
  arches on /contact and in category cards, never full-bleed.
- Certificate wall: not published until blurred (already ruled).
- The Valmont room: origin unknown; not published until the clinic confirms it is theirs.
- Photo brief for the clinic (after Monday, through PEL): 12 to 20 photos of people being made
  beautiful (hands on a face during a facial, a client at reception, a therapist preparing a
  room), warm light, no needle in frame, no faces of real clients without written permission,
  portrait and landscape of each.
- Pipeline: source in `images-src/`, sharp at build to AVIF and WebP at 480, 768, 1080, 1440,
  1920; hero under 200 kB, cards under 60 kB; width and height on every img; hero with
  fetchpriority high and never lazy.

## 3. Proposed structure

### 3.1 Two options for the owner

**Option A, recommended: 4 groups over 11 categories over 24 families over 91 prices.**

```
nav        Face · Body · Laser and hair removal · Wellness · Prices · Contact   (+ WhatsApp button)
/                      home
/treatments/           every group and category, the full price list, chips to jump
/treatments/<family>/  1 page per treatment family (24 cms rows): what it is, who it suits,
                       how long, what it costs (its priced rows), aftercare, related families, CTA
/prices/               the same 91 rows in one long accordion by the 11 categories, for people
                       who arrive from an ad or from Google with a price question
/contact/              address, hours incl. bank holidays, WhatsApp, Treatwell link, map, email
/about/                the clinic, the team (names and qualifications only when PEL confirms),
                       hygiene and consultation-first policy
/privacy/  /terms/     legal pages (research 02 sections 3 and 4)
```

Group mapping of the 11 categories (code, not a change to the JSON):

| Group | Categories |
|---|---|
| Face | hifu, skin (microneedling, radio frequency, peels), skinboosters, facials, carboxy (face rows) |
| Body | body (contouring), carboxy (body rows) |
| Laser and hair removal | laser (skin treatments, tattoo removal), hair |
| Wellness | massage, waxing-ladies, waxing-men |

Why: research 01 (4 to 6 top-level groups everywhere in the premium set; per-family pages for SEO
and conversion; accordion price list for 100 or more rows), research 03 (3-tier local SEO
architecture; 1 page per family, not per price line), and finding 1 (the data already contains
the 24 families).

**Option B: PEL's 11 categories flat, no family pages.** Nav of 11 items or a single Services
page with 11 sections. Faster to build, weaker for search (one page carries everything), and the
24 cms rows have nowhere to go except as headings. Good enough for Monday, not for the site.

Recommendation: build Option A's skeleton from day 1, ship Monday with home, /treatments/ and
/contact/ live, family pages following.

### 3.2 Monday preview scope (3 pages, real content)

| Page | Sections in order |
|---|---|
| / | 1 header with logo (recoloured) and WhatsApp button; 2 hero: 1 line of positioning from facts we hold, warm room photo in an arch, 2 buttons (WhatsApp, See treatments); 3 the 4 groups as arched cards with 1 line each and a "from GBP" figure; 4 how it works (message, consultation, treatment, aftercare) in 4 steps; 5 the clinic: King's Cross, hours, 66 trading hours a week, consultation first; 6 proof strip with facts only (Treatwell rating dated when re-measured; years only when confirmed); 7 final CTA; 8 footer with legal block |
| /treatments/ | 1 header; 2 intro line; 3 chips for the 11 categories; 4 per category: title, 1 line, then rows (name, duration, price, WhatsApp link with the name and Ref prefilled); rows without a price show "Ask for a quote" with the same link; held and review rows never render; 5 note on prices (VAT included, consultation first, adults 18 and over for aesthetic treatments); 6 footer |
| /contact/ | 1 address and postcode; 2 hours table incl. bank holidays; 3 WhatsApp primary, email, Treatwell secondary; 4 map embed loaded on click (no cookie before consent); 5 how to find us; 6 3 warm-graded room photos in arches; 7 footer |

### 3.3 Data model: keep the file flat, put structure in code

`data/services.json` stays as PEL built it (the clinic edits it; keys stay). The site adds:

- `lib/groups.ts`: the category-to-group map and the display order.
- `lib/families.ts`: which cms row is the family page for which priced rows (a slug list per
  family), so a family page can list its prices without a new key in the JSON.
- `data/services.schema.json` and a CI validate step so a broken edit fails the build and the
  live site stays up (research 03 section 6). The previous deployment survives a bad commit.
- Later, if the clinic finds JSON hard: a CSV export and import script, or Pages CMS over the
  same file. Not for Monday.

### 3.4 Compliance items that shape the structure (from research 02)

| Item | Where on the site | Who supplies |
|---|---|---|
| Registered company name, number, registered office, place of registration | footer on every page | PEL reads Companies House (business profile says Pure Essentials (London) Ltd; number not in our files) |
| Email address, VAT status | footer, /contact/ | PEL asks the clinic |
| Prices include VAT; no hidden fees; "from" only where attainable | /treatments/, /prices/ note | PWEB wording, PEL confirms |
| Adults 18 and over for aesthetic treatments | note on /treatments/ and family pages | PWEB wording |
| No medicine name, no anti-wrinkle wording, no per-area toxin prices; held rows absent | build-time grep gate (Definition of Done gate 3) | PWEB gate, PEL owns the list of terms |
| No urgency, offers, countdowns; no testimonials or before-and-after | design rule | PWEB |
| Privacy notice (Article 13 items, WhatsApp and Meta, GitHub as host, health data note) | /privacy/ | PWEB drafts under A7, PEL reviews |
| Consent banner with equal Accept and Reject before any Google tag; Consent Mode v2 defaults denied | layout, after Monday, before the tag | PWEB |
| Treatwell rating shown only when re-measured and dated | home proof strip | PEL measures |
| Practitioner names and registrations | /about/, after PEL confirms | PEL and the clinic |

### 3.5 Technical decisions (from research 03 and the TTD site)

Copy from the TTD repo: package.json, next.config.mjs (basePath empty, trailingSlash true,
images unoptimized), tailwind, postcss, tsconfig, eslint, and the Pages workflow. Add
public/.nojekyll, app/sitemap.ts and app/robots.ts reading the same JSON, metadataBase, JSON-LD
with HealthAndBeautyBusiness plus MedicalBusiness, BreadcrumbList on inner pages, Service and
Offer nodes on family pages (no price rich result expected). Custom domain set in Pages settings
to pel.gumon.io after the first deploy. Fonts through next/font. No third-party script before
consent; the WhatsApp link stays a plain anchor.

## 4. Queue plan (rows go into docs/plans/QUEUE.md once the owner decides section 7)

Phase 0, scaffold (day 1): Q1 copy TTD config and workflow, Q2 tokens and fonts, Q3 layout shell
with header, footer legal block, sticky bar, Q4 data layer (types, groups, families, schema,
validate script), Q5 image pipeline and the 4 usable photos graded and resized, Q6 logo
recolour and SVG trace.

Phase 1, Monday preview: Q7 home, Q8 /treatments/ with the 11 categories and per-row WhatsApp,
Q9 /contact/, Q10 first deploy to pel.gumon.io, custom domain and HTTPS, Q11 external verify
(curl of every page, Definition of Done gates 1 to 8).

Phase 2, after Monday: Q12 family pages (24), Q13 /prices/, Q14 /about/ skeleton, Q15
/privacy/ and /terms/, Q16 consent banner and Consent Mode v2, Q17 Google tag behind consent,
Q18 JSON-LD and sitemap check in Search Console, Q19 photo brief to the clinic through PEL, Q20
editing guide for the clinic (README with prompts and the schema), Q21 Lighthouse pass and the
performance gates, Q22 the clinic's domain switch (owner's order only).

Executor model per row is written on the row (charter 5.5.2). Rows in the same phase that touch
different files run in parallel; the shell (Q3) and tokens (Q2) come before every page.

## 5. What PWEB needs from PEL before the preview

1. A distinguishing word for the 6 duplicated names (finding 2).
2. Company registration details for the footer (registered name, number, office).
3. The Treatwell figure re-measured and dated, or the instruction to omit it on Monday.
4. Confirmation whether the Valmont room photo is the clinic's.
5. Whether "free consultation" is still offered (it is on the old site).

### 5.1 Answers from PEL, 2026-09-13 (full text in the lead repo brief, section 7)

1. Duplicate names: 3D Lipo, Collagen and Emsculpt are not duplicates; one row is the cms page
   (no price) and the other the bookable row. Merge them: copy from cms, price and duration from
   booking. Full Face GBP 450 (1 hr 45 min) and GBP 300 (1 hr 30 min) are HIFU on 2 platforms
   (7D and 3D) but which is which is unconfirmed: show "HIFU full face" with the duration and
   flag. Lymphatic drainage GBP 45 (30 min) and GBP 80 (1 hr) differ by duration only. Men's
   full leg GBP 35 and GBP 40 cannot be resolved from our sources: show the duration and flag.
2. Footer: Companies House read 2026-09-13: PURE ESSENTIALS (LONDON) LTD, number 09500632,
   private limited, active, incorporated 2015-03-20, registered office 129 Station Road,
   London NW4 4NJ. Usable on the preview; confirm with the clinic before the domain switch.
   VAT unknown: omit until the clinic gives a number.
3. Treatwell 4.8 from 1,212: 403 from PEL's machine too, NOT MEASURED. PEL's ruling: no
   score and no review count on Monday. Decision 5 in section 7 is closed by this.
4. The Valmont room: F sent it in the venue set, so it is the clinic's room with a product
   brand sign. Usable; do not make the sign the hero, crop or pick another angle.
5. Free consultation: the live homepage still says it today. Usable.

Hours as measured from /contact are confirmed. Photo brief (Q19): PEL drafts and sends through
the owner after Monday; PWEB sends a shot list when ready.

## 6. What is deliberately not in the preview

Family pages, /about/, legal pages, the consent banner and the Google tag, Chinese, the domain
switch, any team or credential claim, any review quote, any offer.

## 7. Decisions for the owner

| # | Decision | Recommended | Alternative |
|---|---|---|---|
| 1 | Structure | Option A: 4 groups, 11 categories, 24 family pages, 91 prices | Option B: 11 categories flat |
| 2 | Typography | Cormorant Garamond display with Jost body | Jost with Manrope, all sans |
| 3 | Hero image on Monday | the warm wood room, graded | a text-only hero on cream with the arch as a shape until the photo shoot |
| 4 | Rows without a price (24 cms rows) on /treatments/ | show as "Ask for a quote" rows with the WhatsApp link, so nothing live is hidden | hide until the family pages exist |
| 5 | Treatwell rating on Monday | CLOSED by PEL 2026-09-13: omitted, the figure could not be re-measured | - |
| 6 | Editing tool for the clinic | JSON in the GitHub editor with the CI guard and a prompt guide (as promised); revisit CSV or Pages CMS after the first edit session | Pages CMS from day 1 |
