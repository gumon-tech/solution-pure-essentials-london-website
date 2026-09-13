# 04 Old site gap analysis

Written 2026-09-13 by a PWEB executor. It answers the owner's question: what the new site at
https://pel.gumon.io/ is missing, or has in addition, compared with the clinic's current site at
https://www.pureessentialslondon.com/. It lists findings only. Nothing here is a ruling. PEL and
the owner decide.

People are written as roles, never names. The clinic owner is F where needed. No medicine names
are proposed as copy. Where the old site names a product brand, this file says so neutrally.

## 1. Method

| Item | Value |
|---|---|
| Date | 2026-09-13, 09:21 to 09:25 UTC |
| Tool | `node scripts/fetch-client-page.mjs <url> <outfile>`: 1 request at a time, a lock, at least 3 s between requests |
| Requests to the old site | 30 (8 sitemap files, 22 ordinary pages) |
| HTTP status | 30 of 30 returned 200. 0 returned 429. 0 returned 5xx. |
| Where the count comes from | The script's log, `$TMPDIR/pweb-client-fetch/fetch-log.tsv`, has 30 lines, all status 200. The log did not exist before this run. |
| Pages not fetched | 142 `/service-page/` pages, 12 `/product-page/` pages, 34 dynamic CMS pages, 4 consent-form pages |
| Reused, not re-fetched | PEL lead repo at `origin/main`: `data/pel-old-site-urls-2026-09-13.txt` (214 URLs), `data/pel-website-service-inventory.tsv` (176 rows), `docs/pel-website-structure.md`, `docs/pel-service-catalogue.md`, `docs/pel-preflight-page-classification.txt`, `docs/pel-website-move-brief.md` section 6, `docs/pel-site-copy-v1.md` |
| New site | `curl` of https://pel.gumon.io/ (sitemap, home, contact, treatments) and the files in this worktree: `app/`, `components/`, `content/`, `lib/site.ts`, `data/services.json` |

Checks run:

- My sitemap pull (214 URLs) against PEL's `data/pel-old-site-urls-2026-09-13.txt`: `diff` printed nothing, so the lists are identical.
- The 142 `/service-page/` slugs against `data/services.json` rows with `source: booking`: all 142 slugs matched a row, and every booking row matched a slug (script `cmp-booking.js` in the executor scratchpad). The Wix Bookings list and the new data file therefore hold the same set of services.
- PEL's update arrived after the 30 requests were already made. None of the 30 was a service or product page. No further fetches were made after the update.

Limits:

- Wix renders forms, maps and some widgets in the browser. The server HTML shows that a component exists, not what it contains. For the contact form I rely on PEL's browser count in `docs/pel-preflight-page-classification.txt`.
- Service-page prices were not re-read. Bookings prices and `/pricing` prices differ on the old site by design (`docs/pel-website-structure.md`, "Prices in Bookings and prices in the /pricing tables are different numbers"). Section 4.2 compares the `/pricing` page with `data/services.json`.

## 2. Old site page inventory

214 URLs in the sitemap (https://www.pureessentialslondon.com/sitemap.xml plus its 7 child sitemaps):

| Shape | Count | What it is |
|---|---|---|
| `/service-page/<slug>` | 142 | Wix Bookings service pages, 1 per bookable service |
| `/product-page/<slug>` | 12 | Wix Stores products (the shop) |
| `/aesthetics-1/<slug>` | 12 | CMS treatment description pages (face) |
| `/injections/<slug>` | 9 | CMS treatment description pages (injectables) |
| `/aesthetics-body/<slug>` | 8 | CMS treatment description pages (body) |
| `/facials-1/<slug>` | 5 | CMS treatment description pages (facials) |
| Ordinary pages | 26 | listed below |

Ordinary pages, what each holds, and the SEO fields read from the HTML:

| Old URL | `<title>` | Meta description | H1 | Content |
|---|---|---|---|---|
| `/` | pure essentials london \| Waxing \| 155 King's Cross Road, London WC1X 9BN, UK | "Welcome to Pure Essentials London. We offer a wide range of beauty services..." | PURE ESSENTIALS LONDON CLINIC; REJUVENATE YOUR SKIN | Hero, partner logos, clinic, treatments, doctors, free consultation, why choose us, mission, 1 review, footer with 2 phone numbers |
| `/about` | ABOUT US \| pureessentialslondon | none | EXPLORE YOUR BEAUTY | Clinic description, qualification claims, team of 7 with bios, 3 selling points |
| `/contact` | CONTACT \| pureessentialsLondon | "Contact for Booking or Inquires" | none | Hours table, Google Map component, contact form (4 fields and Send, per PEL preflight) |
| `/offers` | OUR REVIEWS \| pureessentialslondon | none | none | 12 customer reviews with first names, WhatsApp link |
| `/pricing` | PRICING \| pureessentialslondon | none | none | Full price menu, 4 sections, "(all prices are subject to change)" |
| `/services` | SERVICES \| pureessentialslondon | none | Exclusive Services | 6 group tiles with "From" prices, built by PEL |
| `/book-online` | BOOK ONLINE \| pureessentialslondon | none | Our Services | Wix Bookings list, 18 filter categories, "Discounts on PRP and selected treatments will be applied after your booking." |
| `/shop` | SHOP \| pureessentialslondon | "Access our range of products for your beauty treatment and more" | none | 12 skincare products, prices GBP 49.14 to GBP 98.00 |
| `/mens` | MENS \| pureessentialslondon | "Discover tailored beauty treatments designed specifically for men..." | Exclusive Services | 8 treatment blurbs for men; waxing "no intimate waxing" |
| `/aesthetics` | AESTHETICS \| pureessentialslondon | none | AESTHETICS | Intro paragraph, links to Face and Body |
| `/face` | FACE \| pureessentialslondon | none | none | 12 face treatment cards linking to `/aesthetics-1/` |
| `/body` | BODY \| pureessentialslondon | none | none | 8 body treatment cards linking to `/aesthetics-body/` |
| `/injectables` | INJECTABLES \| pureessentialslondon | none | none | 9 injectable cards linking to `/injections/` |
| `/facials` | FACIALS \| pureessentialslondon | none | none | Facial cards linking to `/facials-1/` |
| `/beauty` | BEAUTY \| pureessentialslondon | none | none | Links to massage, waxing, slimming |
| `/massage` | MASSAGE \| pureessentialslondon | none | none | Shiatsu, Thai, Swedish, Foot descriptions |
| `/waxing` | WAXING \| pureessentialslondon | "Enjoy a full selection of face and body waxing treatments by our experts" | none | Waxing benefits, wax system brand, hot and strip wax |
| `/slimming` | SLIMMING \| pureessentialslondon | none | none | 3D lipo technologies (cavitation, cryolipolysis, radio frequency, roller) |
| `/cleansing` | CLEANSING \| pureessentialslondon | none | "Book your FREE consultation now!" | Detox body wrap, spa peel |
| `/eyes-ears` | EYES &amp; EARS \| pureessentialslondon | none | "Book your FREE consultation now!" | Lash extensions, brow and lash tint, ear candle |
| `/consent-form` | not fetched | | | Clinical consent form, 113 fields (PEL preflight) |
| `/consent-form-1` | not fetched | | | No form (PEL preflight) |
| `/aesthetics-consent-form` | not fetched | | | Clinical consent form, 27 fields (PEL preflight) |
| `/ipl-laser-consent-form` | not fetched | | | Clinical consent form, 94 fields (PEL preflight) |
| `/terms-of-use` | Terms of use \| pureessentialslondon | none | none | 7 numbered sections, England and Wales law |
| `/privacy-policy` | Privacy Policy \| pureessentialslondon | none | none | Wix template privacy text |

Old header menu, in order (read on `/`): HOME, MENS, CONSENT FORM, IPL LASER, BEAUTY, INJECTABLES,
ABOUT US, OUR REVIEWS, SHOP, AESTHETICS, FACE, BODY, SERVICES, MORE.

Old footer (every fetched page): "155 Kings Cross Road, London, WC1X 9BN", a landline, a mobile
number, Terms Of Use, Privacy Policy, "Website Built By Aim Digital Marketing" linking to
http://www.aimdigitalmarketing.co.uk, and a floating "Book on WhatsApp" button.

## 3. Missing on the new site

Ranked by what breaks if the domain switches without it.

### 3.1 Must fix before the domain switch

| # | Finding | Old source | New site today |
|---|---|---|---|
| M1 | No redirect plan for 214 old URLs. Old paths answer 404 on the new host (measured: https://pel.gumon.io/about 404, /pricing 404). GitHub Pages cannot send server 301 redirects, so each important old path needs a static stub page (meta refresh plus canonical) or a deliberate 404. | https://www.pureessentialslondon.com/sitemap.xml | `app/` has no stubs; `/404.html` exists (200) |
| M2 | Phone numbers. Every old page shows a landline "Tel: 0207 278 5812" and a mobile "Mob: 0771 688 8585". The old LocalBusiness schema carries the landline ("telephone":"+ 442072785812"). Neither number is on the new site, and the mobile differs from the WhatsApp number (447767496803). A customer or Google listing that uses the landline loses it. Ask whether either number is still answered. | https://www.pureessentialslondon.com/ (footer and JSON-LD), /contact | `lib/site.ts` has no phone; `grep` of app, components, content found none |
| M3 | Opening days conflict. The old `/contact` hours table lists Monday, Tuesday, Wednesday, Friday, Saturday, Sunday and Bank Holiday. Thursday is absent from the page text (checked in the raw HTML: the string "Thursday" does not occur). The new site says "Monday to Saturday 10:00 to 20:00". Either Thursday was dropped by an editing slip on Wix, or the clinic is closed on Thursday. Must be confirmed before publishing hours as a fact. | https://www.pureessentialslondon.com/contact | `lib/site.ts` hours, content/contact.md, footer, JSON-LD `openingHoursSpecification` |
| M4 | Services on the old site that are not in `data/services.json` at all: lash extensions, brow and lash tint, ear candle (`/eyes-ears`); detox body wrap and spa peel (`/cleansing`); shiatsu massage (GBP 38 / 70), head massage (GBP 38), eyebrow shaping and eyebrow cleaning (GBP 10), tummy line wax (GBP 8), men's full back wax, 3 named facials (a signature facial by a product brand, a second brand facial, a radiance facial, 75 to 90 min) and the full-body laser hair removal 1-year package (GBP 1,500) (`/pricing`). Before the switch, confirm with the clinic which are still offered, so the new price list is not silently shorter. Some may be retired on purpose (the Bookings list has none of them). | /eyes-ears, /cleansing, /pricing | Not in `data/services.json` (0 matches for shiatsu, head massage, lash, body wrap on https://pel.gumon.io/treatments/) |
| M5 | Prices that differ between the old `/pricing` page and `data/services.json` (live rows). A customer comparing the two sites will see different numbers for the same treatment. Section 4.2 lists 15 pairs. PEL's rule is that the bookable row is what a customer pays, but the clinic has not confirmed either set. | /pricing | `data/services.json` |
| M6 | Google Search Console and the Google Business Profile website link. Not a page, but the domain switch changes every indexed URL. Old titles are weak (section 5), so ranking risk is lower than usual, but the old URLs still need to be submitted for removal or redirected. | all | not in scope of this repo; flag for the Lead |

### 3.2 Should add

| # | Finding | Old source | New site today |
|---|---|---|---|
| S1 | Team and qualifications. The old `/about` lists 7 people: 2 with doctor titles and degrees, the CEO (F) with a pharmacy background, 2 aestheticians, 1 massage therapist, 1 social media manager, plus "fully qualified with BABTAC, VTCT and CPD certifications" and "over 15 years of experience". PEL's copy rule already holds these back until evidenced (`docs/pel-website-move-brief.md` section 6, `docs/pel-site-copy-v1.md` "What waits for the clinic"). An about/team page is the main missing trust page. | https://www.pureessentialslondon.com/about | `/our-clinic-kings-cross/` has rooms and address, no people |
| S2 | Reviews. The old `/offers` page ("OUR REVIEWS") shows 12 customer reviews, and the home page shows 1. The new site has no reviews and the Treatwell rating is held (move brief section 7 item 3). The executor brief rule 3 forbids testimonials on the new site, so this needs an owner ruling, not a build. | https://www.pureessentialslondon.com/offers | none |
| S3 | Shop. 12 skincare products for sale, GBP 49.14 to GBP 98.00, with a Wix cart (Wix config strings for gift card and PayPal appear in every page's platform data, but no gift card is visible on any fetched page). The new site has no shop. Owner question: close the shop, list products as "ask in clinic", or keep a Wix store elsewhere. | https://www.pureessentialslondon.com/shop and 12 `/product-page/` URLs | none |
| S4 | Men's page. The old `/mens` page gathers treatments for men and says men's waxing excludes intimate areas. The new site has a men's waxing category in the price list but no men's page, and no "no intimate waxing" note. | https://www.pureessentialslondon.com/mens | `/treatments/#waxing-men` rows only |
| S5 | Partner and accreditation logos on the home page ("PARTNERS" block): images with alt text babtac, cab, Skymedic logo, logoEberlin, logos mesoestetic, treatwell Logo. Accreditation logos (BABTAC, CAB) need evidence of current membership before reuse. | https://www.pureessentialslondon.com/ | none |
| S6 | Contact form. The old `/contact` has a 4-field form with Send (PEL preflight: `fields=4 Send=1`, same on 12 other pages). The new site has WhatsApp, email and Treatwell only. This is a decision already taken (WhatsApp first), but customers who do not use WhatsApp lose a no-app route other than email. | https://www.pureessentialslondon.com/contact | email link and WhatsApp |
| S7 | Slimming and massage method text. `/slimming` explains the 4 technologies inside 3D lipo; `/massage` explains shiatsu, Thai, Swedish and foot massage. The new family pages are shorter. Useful SEO text, but it carries outcome claims ("20-40% of the fat cells in the treated area die", "Superb results guaranteed", "virtually pain free") that must not be copied. | /slimming, /massage, /waxing | `/body-contouring-kings-cross/`, `/massage-kings-cross/`, `/waxing-kings-cross/` |
| S8 | Local schema phone. The new JSON-LD has no `telephone`. Add it once M2 is answered. | https://www.pureessentialslondon.com/ JSON-LD | https://pel.gumon.io/ JSON-LD |

### 3.3 Optional

| # | Finding | Old source |
|---|---|---|
| O1 | Course and package prices: tattoo removal by 4, 6, 8 sessions; skin peel course of 6 + 1 free; hydrofacial 6 + 1 free; radio frequency body courses of 7; 3D lipo course of 8. The new price list holds single sessions only. The "free" and "offer" wording is on PEL's banned list, so courses would need neutral wording. | /pricing |
| O2 | Area definitions for laser and IPL hair removal (small: feet, hands, lip, chin; medium: underarms, bikini line and more; large; extra large). The new price list names the area bands without saying which body parts they cover. | /pricing |
| O3 | Hydrofacial and radio-frequency facial tiers ("Classic 60 min: HydroFacial Classic + LED"; "Luxury 80 min: + RF + Microcurrent + LED + Boosters"). | /pricing |
| O4 | Men's page blurbs on tattoo removal, microneedling, HIFU and Emsculpt. | /mens |
| O5 | "Book Now" filter categories on `/book-online` (18 groups). The new site groups by 11 categories instead. | /book-online |
| O6 | Credit to the site builder in the footer. Not needed on the new site. | every page |

Found on the old site with no action needed, because the new site already has an equivalent: address, email, Instagram link (old `https://www.instagram.com/pureessentialslondon/?hl=en`), Treatwell link (`https://www.treatwell.co.uk/place/pure-essentials/`), WhatsApp link to the same number, free consultation line, a Google Map (old `/contact` has a Wix GoogleMap component inside a consent wrapper; new `/contact/` has a click-to-load map), terms and privacy pages.

Not found on any fetched old page, so not a gap: visible gift vouchers, newsletter sign-up, cancellation or deposit policy, patch test policy, age policy, payment methods, parking or transport directions, awards, FAQ, blog, Facebook, TikTok or YouTube links, company number. The new site has more of these than the old site (section 6).

## 4. Different on the new site (confirm with PEL or the clinic)

### 4.1 Business facts

| Fact | Old site | New site | Source |
|---|---|---|---|
| Hours | Mon, Tue, Wed, Fri, Sat 10:00 AM to 8 PM; Sun 11:00 AM to 8 PM; Bank Holiday 11:00 AM to 8 PM; Thursday not listed | Mon to Sat 10:00 to 20:00, Sun 11:00 to 20:00, Bank Holidays 11:00 to 20:00 | /contact |
| Phone | Tel 0207 278 5812, Mob 0771 688 8585 | none; WhatsApp 447767496803 only | every page footer |
| Address format | "155 Kings Cross Road" (no apostrophe) in the footer; "155 King's Cross Road" in title and schema | "155 King's Cross Road, London WC1X 9BN" | / |
| Experience claims | "30 years of combined experience", "over thirty years of experience", "over 15 years of experience" (3 different figures on 2 pages) | none (held by PEL) | /, /about |
| Doctors | "Our team of experienced Doctors", "licensed doctors", 2 named doctors with degrees | the word "doctor" is banned until evidenced | /, /about |
| Schema type | LocalBusiness, with telephone | HealthAndBeautyBusiness and MedicalBusiness, with hours, company number, Instagram, price range, no telephone | / JSON-LD |
| Company details | none | PURE ESSENTIALS (LONDON) LTD, 09500632, registered office | new footer |

### 4.2 Prices: old `/pricing` against `data/services.json` live rows

The `/pricing` layout mixes columns, so each old figure below was read in its table position. Figures that could not be placed with certainty are marked "unclear".

| Treatment | Old /pricing | services.json live | Note |
|---|---|---|---|
| Microneedling | GBP 180 | Microneedling Face 100; Face + Neck 150 | different |
| Radio frequency (face) | From GBP 65 | 75 (30 min) | different |
| Skin peel by brand (4 variants) | GBP 125 per session (course price 750 / 810; which figure is per variant is unclear) | 135 each (3 variants live, acne variant held) | different or unclear |
| Pico laser pigmentation, rejuvenation | GBP 150 | 150 | same |
| Vascular removal | from 69 | 69 | same |
| IPL pigmentation, acne, rosacea | GBP 99 | 99 (pigmentation, rejuvenation); acne/rosacea held | same |
| Tattoo removal, small area, 1 session | GBP 60 | 69 (15 min) | different |
| Tattoo removal, medium area, 1 session | GBP 80 | 100 | different |
| Tattoo removal, large area, 1 session | GBP 220 | 199 | different |
| HIFU face rows | Full face + chin + neck GBP 800 and GBP 560; Full face GBP 455; Half face GBP 400; Neck GBP 299 | Full face + chin + neck 560; Full face 450 and 300; Half face 280; Neck 299 | half face and full face different; 2 HIFU platforms not labelled on either site |
| HIFU body medium area | GBP 500 | 280 | different |
| HIFU body large area | GBP 600 and GBP 420 | 420 | old shows 2 figures |
| Body contouring device (muscle stimulation) | GBP 495; course of 4 GBP 360 (layout unclear) | 99 (30 min) | different; old figure may be a struck "was" price (PEL research 15 records 495 as the struck price) |
| Laser hair removal small area | GBP 40 | no small-area row live | missing row |
| Laser hair removal medium, large, extra large | GBP 50, 35 and others in a sessions matrix (unclear) | 35, 60, 80 | unclear |
| IPL hair removal small, medium, large, extra large | 25, 45, 70 (extra large price not placed) | 25, 45, 70, 99 | same where readable |
| Carboxy stretch mark, scar and burns | From GBP 70 | 99 (review status, not live) | different |
| Carboxy rejuvenation, collagen production | GBP 130 | 130 | same |
| Skin booster, 1 and 2 sessions (hyaluronic brand) | 250 / 400 | 250 / 400 | same |
| Filler, lip 0.55 ml | GBP 280 (per PEL catalogue section 4) | 350 | different |
| Ladies' wax bikini | GBP 18 | 25 | different |
| Ladies' wax G-string | GBP 30 | 32 | different |
| Ladies' wax crack | GBP 15 | 18 | different |
| Ladies' wax upper lip | GBP 6 | 10 | different (PEL already noted this pair) |
| Strip wax (first figure) | GBP 23 | several rows at 23 | same where readable |
| Men's wax chest | GBP 22 | half chest 22 | name differs |
| Massage lymphatic drainage 30 / 60 min | GBP 40 / 75 | 45 / 80 | different |
| Massage Thai 60 min | GBP 70 (shared line with shiatsu) | 70 | same |

Count of clear differences: 15 (microneedling, radio frequency, 3 tattoo sizes, half face HIFU, full face HIFU, HIFU body medium, muscle stimulation device, lip filler, 4 ladies' wax rows, lymphatic drainage). Command to re-read: `node scripts/fetch-client-page.mjs https://www.pureessentialslondon.com/pricing <out>` and compare the text with `data/services.json`.

### 4.3 Held services the old site still publishes

The old site still sells, with public prices, services that `data/services.json` holds under Q-PEL-023: 59 held and 6 review rows, including PRP procedures, combination packages, a toxin treatment (listed by area, the old page names no toxin brand name on the pages fetched), injectable vitamins, fat-dissolving injections and IV therapy. `/book-online` also says "Discounts on PRP and selected treatments will be applied after your booking." These disappear at the domain switch. That is intended, but the clinic should hear it before the switch, because customers may ask for them.

## 5. SEO items on the old site

- Titles: every inner page uses "<PAGE NAME IN CAPITALS> | pureessentialslondon". The home title is "pure essentials london | Waxing | 155 King's Cross Road, London WC1X 9BN, UK". None name a treatment and a place together.
- Meta descriptions: present on 5 of 22 fetched pages (/, /contact, /mens, /shop, /waxing). 17 have none.
- H1: present on 7 of 22 pages; `/cleansing` and `/eyes-ears` each have 2 H1s, both "Book your FREE consultation now!" and "FREE CONSULTATION. PROFESSIONAL ADVICE.".
- Schema: only the home page has JSON-LD: a LocalBusiness (name, URL, image, address, telephone) and a WebSite. No opening hours, no services, no reviews in schema.
- Open Graph image on /, /about, /contact: https://static.wixstatic.com/media/efcedf_3b7a3dcec5d947209e06a02d21fa0496~mv2.png
- Canonical and robots meta tags: none found in the server HTML of the 22 pages.
- Map: Wix GoogleMap component on `/contact` (component id `comp-mtmr1yz6`), loaded inside a consent wrapper, no embed URL in the server HTML.

The new site is ahead on every one of these items: treatment-and-place titles, a meta description on every page read, an H1 on every page, clinic schema with hours, and a sitemap of 37 URLs. So the switch should not lose ranking from on-page SEO. The risk is the 214 URLs themselves (M1).

## 6. New site extras (not on the old site)

- Company name, number, jurisdiction and registered office in the footer (`lib/site.ts`).
- A privacy notice written for this site (WhatsApp, email, Treatwell, Instagram, health data, rights, complaints) and website terms with prices and bookings sections. The old privacy page is the Wix template text and mentions selling products through Wix.
- "Aesthetic treatments are for adults aged 18 and over" and "The price shown is the price you pay" (`app/treatments/page.tsx`, `content/treatments-intro.md`).
- Nearest station and Underground lines (`content/contact.md`).
- 11 story and family pages: `/hifu-kings-cross/`, `/laser-hair-removal-kings-cross/`, `/facials-kings-cross/`, `/body-contouring-kings-cross/`, `/massage-kings-cross/`, `/waxing-kings-cross/`, `/microneedling-peels-kings-cross/`, `/skin-boosters-kings-cross/`, `/our-clinic-kings-cross/`, `/your-visit/`, `/first-visit-guide/` (the last with an FAQ section).
- Durations on every price row (the old `/pricing` shows few durations).
- A click-to-load map, so no Google request before a tap.
- WhatsApp message prefilled with the treatment name and a reference code.
- New-site rows not on the old `/pricing` page, only in Wix Bookings: cosmetic depigmentation with home kit (GBP 1,300), half face microneedling with LED and mask (GBP 150), face massage (GBP 40), foot and leg massage (GBP 45), tension neck and scalp massage (GBP 45), deep tissue massage (GBP 70), hydrating facial (GBP 70). All are in the old Bookings list, so they are not invented; they are simply not on the old price page.

## 7. Redirect map draft

GitHub Pages serves static files only, so "redirect" below means a small page at the old path with
`<meta http-equiv="refresh" content="0; url=...">` and `<link rel="canonical" href="...">`, or an
entry in whatever redirect mechanism the Lead chooses. Old paths have no trailing slash; Next.js
static export with `trailingSlash: true` writes `about/index.html`, which GitHub Pages serves at
`/about` and `/about/`.

| Old path | Suggested new path | Priority |
|---|---|---|
| `/` | `/` | same path |
| `/about` | `/our-clinic-kings-cross/` | high |
| `/contact` | `/contact/` | same path |
| `/pricing` | `/treatments/` | high |
| `/services` | `/treatments/` | high |
| `/book-online` | `/treatments/` | high |
| `/offers` | `/our-clinic-kings-cross/` | medium |
| `/aesthetics` | `/treatments/` | medium |
| `/face` | `/treatments/#face` (stub pages cannot keep a hash reliably; `/treatments/` is enough) | medium |
| `/body` | `/body-contouring-kings-cross/` | medium |
| `/injectables` | `/skin-boosters-kings-cross/` | medium |
| `/facials` | `/facials-kings-cross/` | medium |
| `/beauty` | `/treatments/` | low |
| `/massage` | `/massage-kings-cross/` | medium |
| `/waxing` | `/waxing-kings-cross/` | medium |
| `/slimming` | `/body-contouring-kings-cross/` | low |
| `/mens` | `/waxing-kings-cross/` or a future men's page (S4) | low |
| `/cleansing` | `/treatments/` or 404 if retired (M4) | low |
| `/eyes-ears` | `/treatments/` or 404 if retired (M4) | low |
| `/shop`, `/product-page/*` (12) | `/` or 404, after the owner's shop decision (S3) | low |
| `/terms-of-use` | `/terms/` | medium |
| `/privacy-policy` | `/privacy/` | medium |
| `/consent-form`, `/consent-form-1`, `/aesthetics-consent-form`, `/ipl-laser-consent-form` | `/contact/`; the clinic needs another home for its consent forms (question Q6) | high for the clinic, low for SEO |
| `/aesthetics-1/hifu` | `/hifu-kings-cross/` | medium |
| `/aesthetics-1/microneedling`, `/aesthetics-1/golden-micro-needling`, `/aesthetics-1/skymedic-chemical-peels` | `/microneedling-peels-kings-cross/` | medium |
| `/aesthetics-1/hydro-facial` | `/facials-kings-cross/` | medium |
| `/aesthetics-1/pico-laser`, `/aesthetics-1/ipl-(intense-pulsed-light)`, `/aesthetics-1/etherea-mx`, `/aesthetics-1/cryopen` | `/treatments/#laser` via `/treatments/` | low |
| `/aesthetics-1/emsculpt`, `/aesthetics-body/emsculpt`, `/aesthetics-body/3d-lipo`, `/aesthetics-body/hifu-body` | `/body-contouring-kings-cross/` | medium |
| `/aesthetics-body/laser-hair-removal-%2F-ipl` | `/laser-hair-removal-kings-cross/` | medium |
| `/aesthetics-body/tattoo-removal-` | `/treatments/` | low |
| `/aesthetics-body/indiba-deep-beauty` | `/microneedling-peels-kings-cross/` | low |
| `/aesthetics-body/profhilo-body`, `/injections/profhilo-skin-booster-`, `/injections/restylane-skin-boosters` | `/skin-boosters-kings-cross/` | low |
| `/aesthetics-body/carboxytherapy` | `/treatments/` | low |
| `/facials-1/eberlin-facial`, `/facials-1/age-defence-sensitive-skin-treatment-`, `/facials-1/diamondtome-microdermabrasion` | `/facials-kings-cross/` | low |
| Held pages: `/aesthetics-1/iv-therapy`, `/aesthetics-1/mesotherapy-injection-gun`, `/facials-1/mesotherapy-radio-frequency`, `/facials-1/pro-lift-eye-treatment`, `/injections/b12-injections`, `/injections/collagen`, `/injections/jalupro-skin-booster`, `/injections/lipo-lap--fat-dissolve`, `/injections/mesotherapy`, `/injections/s-dna-skin-booster`, `/injections/vitamin-c-injection` | 404 (do not redirect a held treatment to a page that seems to offer it) | none |
| `/service-page/*` (142) | 1 rule: live rows to `/treatments/`; held rows 404. 142 stub files are possible but probably not worth it; Google treats a mass redirect to 1 page as a soft 404 anyway. | low |

New-site family pages already exist at `/treatments/<slug>/` for 23 CMS rows (for example
`/treatments/aesthetics_1_hifu/`). If those stay, they are closer matches than the story pages above
for the matching `/aesthetics-1/`, `/aesthetics-body/`, `/facials-1/` and `/injections/` paths. The
Lead picks one target per old path.

## 8. Open questions for the clinic

1. Is the clinic open on Thursday? The old contact page lists every other day but not Thursday.
2. Are the landline 0207 278 5812 and the mobile 0771 688 8585 still in use? Should either appear on the new site?
3. Which of these are still offered: lash extensions, brow and lash tint, ear candle, detox body wrap, spa peel, shiatsu, head massage, eyebrow shaping, the 3 named facials, the full-body laser hair removal 1-year package?
4. For the 15 price pairs in section 4.2, which price is current: the price page or the booking system?
5. What should happen to the shop and its 12 products?
6. Where will the 3 consent forms live after the switch (they are clinical forms and should not move to a static site as-is)?
7. Can the team be named on the new site, and can each qualification (BABTAC, VTCT, CPD, the 2 doctors' degrees, CAB membership) be evidenced?
8. May reviews be shown, and from which source (Treatwell rating, Google reviews)? Customer first names are on the old page; the new site would need consent or none.
9. Which HIFU platform is the higher full-face price (already open in PEL's move brief section 7 item 1)?
10. Is the "30 years of experience" figure correct, given the old site also says "over 15 years"?

## 9. Files used (for re-checking)

- Captures (not in git): executor scratchpad `/private/tmp/claude-501/pweb-old/` (22 `p-*.html` pages, 7 `sm-*.xml` sitemaps, `seo.json`, `urls.txt`).
- Fetch log: `$TMPDIR/pweb-client-fetch/fetch-log.tsv`, 30 lines, all 200.
- PEL lead repo, read with `git show origin/main:<path>` only.
