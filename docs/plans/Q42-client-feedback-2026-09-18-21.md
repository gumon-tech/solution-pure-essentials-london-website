# Q42: client feedback of 2026-09-18 and 2026-09-21, and the owner's Title Case order

Source: the clinic's WhatsApp group with Gumon, read by the PWEB Lead in the owner's browser on
2026-09-26 at the owner's request. Contacts are K (2026-09-18 22:44 to 23:24 UK) and F
(2026-09-21 13:34 to 20:00). The owner's order of 2026-09-26 in the PWEB room: every heading and
button in Title Case, for example "Book online" becomes "Book Online"; body text unchanged.
The owner also ordered: apply all the feedback and deploy.

## Path (standing order A10)

```
visitor -> home cards / header menu -> /treatments/ price list (data/services.json via lib/services.ts,
lib/groups.ts, lib/treatments-view.ts) -> family pages (lib/families.ts, lib/family-pages.ts) and
story pages (content/stories/*.md, lib/stories.ts, lib/story-map.ts) -> WhatsApp CTA with Ref slug
-> sitemap, JSON-LD (lib/structured-data.ts), redirect stubs
```
Every row change below must survive the whole path: price list, family page, story price blocks,
JSON-LD, WhatsApp Ref, and the check scripts.

## A. Data changes (data/services.json)

Rule: rename by setting `display_name` (keep `name` and `slug`, so WhatsApp Refs and redirects stay
stable). New rows get a new slug. Removed rows get `status: "removed"` with a note (never rendered),
not deleted, so the history stays in the file.

| # | From K / F | Row(s) | Change |
|---|---|---|---|
| A1 | K 22:44 | category `hifu` | category title "HIFU (High-Intensity Focused Ultrasound)" |
| A2 | K 22:52 | skinox_pigmentation, skinox_redness, skinox_wrinkles | display names "Pigmentation Reduction Chemical Peel + Serum Treatment + LED Therapy", "Redness Reduction Chemical Peel + Serum Treatment + LED Therapy", "Wrinkle Reduction Chemical Peel + Serum Treatment + LED Therapy" |
| A3 | K 22:54 | cosmelan_depigmenting_including_home_kit | "Cosmelan Depigmenting Chemical Peel Treatment (Including Home Kit)" |
| A4 | K 22:55 | aesthetics_1_golden_micro_needling | "Fractional Radiofrequency Microneedling" |
| A5 | K 23:00 | profhilo | "Profhilo Treatment (1 Session)" |
| A6 | K 23:02 | profhilo_2_sessions | "Profhilo Treatment Course (2 Sessions)" |
| A7 | K 23:03 | aesthetics_body_profhilo_body | "Profhilo Body Treatment", price 580, price_from true |
| A8 | K 23:04 | lip_0_55ml | "Dermal Filler (1mL)", price 350 |
| A9 | K 23:08 | hydrating | "Calming and Hydrating Facial", price 90 |
| A10 | K 23:09 | facials_1_age_defence_sensitive_skin_treatment | "Anti-Aging Facial", price 90 |
| A11 | K 23:09 | new row, facials | "Brightening and Glowing Facial", price 90, duration unknown (null) |
| A12 | K 23:11 | facials_1_diamondtome_microdermabrasion | becomes "DiamondTome Microdermabrasion (30 mins)" price 70 duration 30 min; new row "DiamondTome Microdermabrasion (1 hour)" price 85 duration 1 hr |
| A13 | K 23:11 | facials_1_eberlin_facial | removed |
| A14 | K 23:13 | collagen (carboxy) | "Carboxytherapy - Face (30 mins)", price 150, duration 30 min; new rows "Carboxytherapy - Face & Eyes (45 mins)" 180 / 45 min and "Carboxytherapy - Body" from 150 |
| A15 | K 23:16 | hifu_small_area_knees_armpit_bust_lift | "HIFU Small Area (Knees, Underarm or Bust)", 45 min, price 200 |
| A16 | K 23:16 | hifu_med_area_flappy_arms_lovehandle | "HIFU Medium Area (Upper Arms or Waist)", 45 min, price 320 |
| A17 | K 23:16 | large_area_outer_thighs_full_stomach | "HIFU Large Area (Outer Thighs or Full Stomach)", 45 min, price 420 |
| A18 | K 23:19 | vascular_removal_vein_broken_capillari_1 | "Laser Vascular Reduction (Veins or Broken Capillaries)" |
| A19 | K 23:21 | pigmentations_ipl, pigmentations_qswitch, pigmentations_picosure | "Pigmentation Reduction (IPL)", "Pigmentation Reduction (Q-switch)", "Pigmentation Reduction (Picosure)" |
| A20 | K 23:21 | aesthetics_1_cryopen | "CryoPen", price 65, price_from true |
| A21 | K 23:21 | aesthetics_1_etherea_mx | removed |
| A22 | F 13:36 | new category `head-spa` "Japanese Head Spa" | 4 rows: Ritual Head Spa 60 / 45 min; Exotic Head Spa 85 / 60 min; Serenity Head Spa 125 / 90 min; Royal Glow Head Spa 175 / 135 min; the clinic's own description per row (below) |
| A23 | F 20:00 | new row, skinboosters | "PRP (Platelet-Rich Plasma) Injections", no price (consultation), no claims |

Head spa descriptions, the clinic's words, used as the row descriptions:
```
Ritual       A restorative ritual featuring scalp, neck and shoulder massage, Gua Sha therapy, and
             targeted pressure point techniques to release tension and promote deep relaxation.
Exotic       A rejuvenating head spa experience including scalp, shoulder and arm massage, double
             shampoo cleanse, steam therapy, nourishing hair treatment, Halo water ritual, and rough dry finish.
Serenity     A deeply relaxing ritual combining scalp, neck and shoulder massage, therapeutic scalp tools,
             ritual combing massage, steam therapy, nourishing treatment, double shampoo cleanse, mini
             radiance facial, Halo water ritual, and rough dry finish.
Royal Glow   Our signature luxury head spa experience featuring therapeutic scalp brushing and massage,
             fresh herb steam therapy, Halo waterfall ritual, intensive hair mask with steam infusion,
             luxury facial cleanse, exfoliation and hydration, lifting facial massage, lymphatic
             drainage, soothing aromatherapy, and mindful relaxation.
Steps        1 Shampoo with massage on the scalp. 2 Wash off the shampoo with Halo. 3 Hair scrub, then
             wash off with Halo. 4 Conditioner with a head massager, then wash off with Halo. 5 Hair mask
             with scalp massage and scalp massage tools (shoulder and facial massage can be added at an
             extra cost). 6 Steam the hair. 7 Blow-dry (not styling).
```
(F wrote "Helo" in step 2 and "Halo" elsewhere; the site uses Halo.)

## B. Held, not published (reason recorded, owner and PEL told)

| # | From | Item | Why held |
|---|---|---|---|
| B1 | F 20:00 | "Anti-Wrinkle Injections" | Names a prescription-only medicine by euphemism. The ASA's own guidance lists this kind of wording as unacceptable (lead repo docs/pel-pom-review-en.html section 7; handoff rule 3). PEL's route: advertise a consultation for lines and wrinkles, no product wording. |
| B2 | F 20:00 | "IV (Intravenous) Drips" | Group 2 of the POM review: vitamin drips generally contain prescription-only ingredients (Regulation 284, CAP 12.12). Held rows under Q-PEL-023 until PEL rules on the consultation route. |
| B3 | K 23:23 | 6 venue photos | Downloads from the owner's WhatsApp browser did not land on this machine; the owner or PEL saves them to the OneDrive client-photos folder. |
| B4 | F 13:37 | 4 head spa videos (0:25, 0:23, 0:14, 0:39) | Same as B3. The head spa section ships with the existing people imagery until the media arrive. |

## C. Title Case (owner's order)

Headings (h1 to h6), buttons, button-styled links, menu items, category and family titles, service
names, section eyebrows, FAQ questions. Body paragraphs unchanged.
Rule: capitalise every word except a, an, the, and, or, nor, but, of, in, on, at, to, for, by, with,
per, from, via, vs, as, when they are not the first or last word. Keep existing capitals
(HIFU, IPL, CryoPen, mL, Q-switch). Units stay lower case: mins, min, hr, ml, cm. Words after a
hyphen follow the same rule (Face-to-Face), except Q-switch and similar product spellings.
Service names are formatted at render time by one function, so the clinic's future edits in
services.json come out right without anyone remembering the rule.
Measured before (main c4273cc, local build): 89 distinct heading and button strings in sentence case.

## Acceptance

1. every A row visible on /treatments/ and its family or story page with the new name and price; removed rows appear nowhere in out/
2. B1 and B2 wording appears nowhere in out/ (grep, visible text)
3. the label scan reports 0 sentence-case headings, buttons or menu items
4. all check scripts 0, build 0, lint 0
5. live on https://pel.gumon.io after deploy, read from outside
