# Copy sources for the content files

Written 2026-09-13 by a PWEB executor for queue rows Q7, Q9 and Q25. Every sentence in `content/` is listed with its source. A sentence without a source was removed, not listed.

## Source keys

| Key | Source |
|---|---|
| F1 | Address: Pure Essentials London, 155 King's Cross Road, London WC1X 9BN (Lead brief, fact line) |
| F2 | Hours: Monday to Saturday 10:00 to 20:00, Sunday 11:00 to 20:00, Bank Holidays 11:00 to 20:00 (Lead brief) |
| F3 | Email info@pureessentialslondon.com (Lead brief) |
| F4 | Booking and questions by WhatsApp (primary); Treatwell secondary (Lead brief) |
| F5 | Free consultation is offered (Lead brief; live site 2026-09-13) |
| F6 | Company record: PURE ESSENTIALS (LONDON) LTD, 09500632, England and Wales, 129 Station Road, London NW4 4NJ (Lead brief; Companies House read by PEL 2026-09-13) |
| S:slug | `data/services.json` row with that slug, status live (name, category, duration, price_gbp) |
| C:id | `data/services.json` category title |
| PEL:section | `~/dev/solution-pure-essentials-london/docs/pel-site-copy-v1.md`, that section, used verbatim or cut |
| B18 | Lead brief: "Aesthetic treatments are for adults aged 18 and over. The price shown is the price you pay." (also 02-uk-compliance 2.1 and 3) |
| BH | Lead brief hedge rule ("results vary") |
| D4 | 00-direction section 7 decision 4 and DECISIONS-2026-09-13: rows without a price show "Ask for a quote" |
| D51 | 00-direction section 5.1 point 1: both HIFU Full Face rows shown as "HIFU full face" with the duration |
| TFL | https://tfl.gov.uk/hub/stop/HUBKGX/king-s-cross-st-pancras read 2026-09-13: Circle, Hammersmith & City and Metropolitan; Northern; Piccadilly; Victoria |
| UI | Lead brief format line: map note text |

Edits made to PEL sentences (cuts and number format only, no additions): "seven" written as "7" (Arabic numerals rule for public content); "HIFU lifting" cut to "HIFU" (device outcome wording); "cryolipolysis" cut from the Body line (the data name is Cryoelectrolipolysis, see report); "two minutes from King's Cross St Pancras" cut (walking minutes are forbidden, not measured); "and national rail" and the bus sentence cut from Getting here (not shown on the TfL page).

## content/home.md (PEL sentences only)

| Sentence start | Source |
|---|---|
| title "Beauty Treatments in King's Cross" | PEL:Home Hero heading, cut |
| description "Facials, HIFU, laser, body contouring..." | PEL:Home Hero sub-line |
| h1 "Beauty and skin treatments in King's Cross" | PEL:Home Hero heading |
| "Facials, HIFU, laser, body contouring, massage and waxing at 155..." | PEL:Home Hero sub-line; F1, F2 |
| "Every treatment starts with a free consultation." | PEL:Home Hero sub-line; F5 |
| Buttons "Message us on WhatsApp" / "See treatments and prices" | PEL:Home Hero buttons; F4 |
| "HIFU, skin boosters, microneedling, peels and facials" | PEL:Home groups, Face line, cut |
| "From GBP 70" | PEL:Home groups; S:hydrating (script check 4) |
| "3D lipo, HIFU body and Emsculpt" | PEL:Home groups, Body line, cut |
| "From GBP 99" | PEL:Home groups; S:emsculpt, S:cryoelectrolipolysis_one_area |
| "Pigmentation, rejuvenation and tattoo removal; laser and IPL hair removal" | PEL:Home groups, Laser line |
| "From GBP 25" | PEL:Home groups; S:ipl_small_area |
| "Massage and waxing" | PEL:Home groups, Wellness line |
| "From GBP 10" | PEL:Home groups; S:ladies_waxing_face_hot_wax_full_chin, S:ladies_waxing_face_hot_wax_upper_lip |
| "Tell us what you would like to change..." | PEL:Home How it works 1; F3, F4 |
| "We look at your skin or your goal..." | PEL:Home How it works 2 |
| "Booked at a time that suits you, 7 days a week." | PEL:Home How it works 3; F2 |
| "You leave with clear aftercare advice..." | PEL:Home How it works 4 |
| "Pure Essentials London is a salon and clinic at 155..." | PEL:Home The clinic, cut; F1 |
| "Open Monday to Saturday 10:00 to 20:00..." | PEL:Home The clinic; F2 |
| "Consultations are free." | PEL:Home The clinic; F5 |
| "Ready when you are" | PEL:Home Final call heading |
| "Message us on WhatsApp and we will reply during opening hours." | PEL:Home Final call line |
| Footer "Pure Essentials (London) Ltd · Company number..." | PEL:Footer; F6, F1, F3 |

## content/contact.md (PEL sentences only, plus the UI map note)

| Sentence start | Source |
|---|---|
| title "Contact and Hours, King's Cross" | PEL:Contact heading and hours line, cut and reordered |
| description "Find us at 155 King's Cross Road..." | PEL:Contact heading, address, hours; F1, F2 |
| h1 "Find us" | PEL:Contact heading |
| "155 King's Cross Road, London WC1X 9BN" | PEL:Contact; F1 |
| Hours table (3 rows) | PEL:Contact hours; F2 |
| "WhatsApp: Message us (button)" | PEL:Contact; F4 |
| "Email: info@pureessentialslondon.com" | PEL:Contact; F3 |
| "Book on Treatwell" | PEL:Contact; F4 |
| "King's Cross St Pancras (Circle, Hammersmith and City, Metropolitan, Northern, Piccadilly, Victoria lines) is the nearest station." | PEL:Contact Getting here, cut; line names checked against TFL |
| "The map loads when you tap it." | UI (not in PEL's file; see report) |
| Footer | PEL:Footer; F6, F1, F3 |

## content/treatments-intro.md (PEL sentences only)

| Sentence start | Source |
|---|---|
| title "Treatments in King's Cross" | PEL:Home Hero buttons "See treatments and prices", cut |
| description "Facials, HIFU, laser, body contouring, massage and waxing at 155..." | PEL:Home Hero sub-line, cut; PEL:Treatments intro |
| h1 "Treatments and prices" | PEL:Home Hero button, cut |
| "Every price below is the price you pay." | PEL:Treatments intro |
| "The price shown is the price you pay." | PEL:Treatments intro |
| "Where a price says "from", the figure is the lowest option..." | PEL:Treatments intro |
| Group lines (Face, Body, Laser and hair removal, Wellness) | PEL:Home groups, same cuts as home.md |
| "Ask for a quote" | PEL:Treatments row without a price; D4 |
| "Aesthetic treatments are for adults aged 18 and over." | PEL:Treatments note; B18 |
| "Every treatment starts with a consultation; we will not recommend..." | PEL:Treatments note |

## Story pages: sentences shared by all 4

| Sentence start | Files | Source |
|---|---|---|
| "...at 155 King's Cross Road, 7 days a week." (hero) | all 4 | PEL:Home Hero sub-line, cut; F1, F2; category from C:hifu, C:hair, C:facials, C:body |
| "Every treatment starts with a free consultation." | all 4 | PEL:Home Hero sub-line; F5 |
| Buttons "Message us on WhatsApp" / "See treatments and prices" / "Book on Treatwell" | all 4 | PEL:Home Hero buttons, PEL:Contact; F4 |
| "At the consultation we look at your skin or your goal and recommend what suits you." | all 4 | PEL:Home How it works 2 |
| "Results vary from person to person." | all 4 | BH |
| "If you have a health condition, or you are unsure... ask at the consultation before you book." | all 4 (facials: "skin or health condition") | F5; 02-uk-compliance section 4 (health questions kept to the consultation) |
| Step 1 "Tell us what you would like to ask about, on WhatsApp or by email." | all 4 | PEL:Home How it works 1, cut; F3, F4 |
| Step 2 "We look at your skin or your goal and recommend what suits you." | all 4 | PEL:Home How it works 2 |
| Step 3 "Booked at a time that suits you, 7 days a week." | all 4 | PEL:Home How it works 3; F2 |
| "The duration of each (priced) option is listed below." | all 4 | S: rows in the page's price table |
| "You can also book through Treatwell." | all 4 | F4 |
| "Aesthetic treatments are for adults aged 18 and over. The price shown is the price you pay." | HIFU, laser hair, body | B18; PEL:Treatments intro and note |
| "The price shown is the price you pay." | facials | PEL:Treatments intro |
| Aftercare "You leave with clear aftercare advice and can message us with any question." | all 4 | PEL:Home How it works 4 |
| FAQ "Where is the clinic?" / "155 King's Cross Road, London WC1X 9BN." | all 4 | F1 |
| FAQ "When are you open?" / "Monday to Saturday 10:00 to 20:00, Sunday and bank holidays 11:00 to 20:00." | all 4 | PEL:Home The clinic; F2 |
| FAQ "Is the consultation free?" / "Yes. Consultations are free." | HIFU, facials, body | PEL:Home The clinic; F5 |
| FAQ "How do I book?" / "Message us on WhatsApp. You can also book through Treatwell." | all 4 | F4 |
| CTA "Message us on WhatsApp and we will reply during opening hours." | all 4 | PEL:Home Final call line |

## content/stories/hifu-kings-cross.md

| Sentence start | Source |
|---|---|
| title, h1 "HIFU in King's Cross" | C:hifu; F1 |
| description "HIFU for the face and neck at 155..." | C:hifu; F1; S:half_face (GBP 280); PEL:Home Hero sub-line |
| hero "HIFU for the face and neck at 155 King's Cross Road, 7 days a week." | C:hifu; F1; F2 |
| "HIFU at Pure Essentials London is available for the full face, half face and neck, and for combinations..." | S:full_face, S:full_face_1, S:half_face, S:neck, S:full_face_neck, S:full_face_chin_neck |
| "Sessions take from 45 minutes to 2 hours, depending on the area." | S:neck (45 min), S:full_face_chin_neck (2 hr) |
| "HIFU is also available for small and medium areas of the body." | S:hifu_small_area_knees_armpit_bust_lift, S:hifu_med_area_flappy_arms_lovehandle |
| "At the free consultation you can ask how the treatment works and what it aims to do for you." | F5; BH |
| "HIFU is an aesthetic treatment for adults aged 18 and over." | B18 |
| Price tables (8 rows) | S: slug in each row; D51 for the 2 "HIFU full face" names |
| FAQ "Face and neck options run from GBP 280 for a half face to GBP 560 for full face, chin and neck." | S:half_face, S:full_face_chin_neck |
| FAQ "Every option is listed on this page." | the page's price tables |
| FAQ "From 45 minutes for the neck to 2 hours for full face, chin and neck." | S:neck, S:full_face_chin_neck |

## content/stories/laser-hair-removal-kings-cross.md

| Sentence start | Source |
|---|---|
| title, h1 "Laser hair removal in King's Cross" | C:hair; F1 |
| description "...priced by area size. IPL from GBP 25, laser from GBP 35. Consultations are free." | S:ipl_small_area, S:laser_hair_removal_medium_area; F1; F5 |
| hero "Laser and IPL hair removal at 155 King's Cross Road, 7 days a week." | C:hair; F1; F2 |
| "Hair removal here is available with laser or with IPL, and each is priced by the size of the area." | S: 7 hair rows (Small, Medium, Large, Extra Large Area names) |
| "Sessions take from 15 minutes for a small IPL area to 1 hour 30 minutes for an extra large area." | S:ipl_small_area, S:ipl_extra_large_area, S:laser_hair_removal_extra_large_area |
| "Laser hair removal area sizes:" and 3 bullets: "Medium area: underarms, buttocks, bikini line, crack, neck, shoulders, tummy line, face, full front bikini", "Large area: arms, half legs, tummy, lower back, upper back, chest", "Extra large area: full legs, Hollywood" | https://www.pureessentialslondon.com/pricing, Laser hair removal block, old wording "* Medium area: Underarms, buttocks, bikini line, crack, neck, shoulders, tummy line, face, full front bikini" / "* Large area: Arms, half legs, tummy, lower back, upper back, chest" / "* Extra large: Full legs, Hollywood" (the capture splits "tummy" across 2 spans as "tu" and "mmy", joined here); PEL ruling 2026-09-13 brief section 27; band names from S:laser_hair_removal_medium_area, _large_area, _extra_large_area. The old "* Small area: Feet, hands, lip, chin" is left out: no live laser small-area row |
| "IPL hair removal area sizes:" and 4 bullets: "Small area: upper lip, chin, sideburns", "Medium area: underarms, bikini line", "Large area: Hollywood, half leg, half arm", "Extra large area: full leg, full back, full arms" | https://www.pureessentialslondon.com/pricing, IPL Hair Removal block, old wording "* Small area: Upper lip/ Chin/ Sideburn" / "* Medium area: underarms/ Bikini line" / "* Large area: Hollywood/ half leg/ half arm" / "* Extra large: Full leg / full back /full arms"; PEL ruling 2026-09-13 brief section 27; band names from S:ipl_small_area, _medium_area, _large_area, _extra_large_area |
| "If your area is not listed, ask on WhatsApp which size it counts as." | F4 (replaces "To find out which size your area counts as, ask on WhatsApp.", reworded because the sizes are now listed) |
| "Laser and IPL hair removal are aesthetic treatments for adults aged 18 and over." | B18 |
| Price tables (7 rows) | S: slug in each row |
| FAQ "IPL starts at GBP 25 for a small area and laser at GBP 35 for a medium area." | S:ipl_small_area, S:laser_hair_removal_medium_area |
| FAQ "Should I choose laser or IPL?" / "Ask at the free consultation." | F5; PEL:Home How it works 2 |
| FAQ "From 15 minutes for a small IPL area to 1 hour 30 minutes..." | S:ipl_small_area, S:ipl_extra_large_area |

## content/stories/facials-kings-cross.md

| Sentence start | Source |
|---|---|
| title, h1 "Facials in King's Cross" | C:facials; F1 |
| description "...including a Hydrofacial and a Hydrating facial from GBP 70..." | S:hydrofacial, S:hydrating; F1; PEL:Home Hero sub-line |
| hero "Facials at 155 King's Cross Road, 7 days a week." | PEL:Home Hero sub-line, cut; F1; F2 |
| "The facial menu includes a Hydrofacial and a Hydrating facial." | S:hydrofacial, S:hydrating |
| "An Age Defence Sensitive Skin Treatment, Diamondtome Microdermabrasion and an Eberlin Facial are also on the menu." | S:facials_1_age_defence_sensitive_skin_treatment, S:facials_1_diamondtome_microdermabrasion, S:facials_1_eberlin_facial |
| "The Hydrofacial takes 1 hour and the Hydrating facial takes 1 hour 45 minutes." (body and FAQ) | S:hydrofacial, S:hydrating |
| "Not sure which facial fits your skin?" | question, leads into PEL:Home How it works 2 |
| Price table (5 rows) | S: slug in each row; D4 for the 3 rows without a price |
| FAQ "The Hydrating facial is GBP 70 and the Hydrofacial is GBP 100." | S:hydrating, S:hydrofacial |
| FAQ "For the other facials, ask for a quote on WhatsApp." | D4; F4 |

## content/stories/body-contouring-kings-cross.md

| Sentence start | Source |
|---|---|
| title, h1 "Body contouring in King's Cross" | C:body; F1 |
| description "...3D Lipo, cryoelectrolipolysis, Emsculpt and HIFU for the body. From GBP 99..." | S:3d_lipo, S:cryoelectrolipolysis_one_area, S:emsculpt, S:hifu_small_area_knees_armpit_bust_lift; F1; F5 |
| hero "Body contouring at 155 King's Cross Road, 7 days a week." | C:body; F1; F2 |
| "Body contouring here covers 3D Lipo, cryoelectrolipolysis, Emsculpt and HIFU for the body." | S:3d_lipo, S:cryoelectrolipolysis_one_area, S:emsculpt, S:hifu_small_area_knees_armpit_bust_lift, S:hifu_med_area_flappy_arms_lovehandle |
| "Cryoelectrolipolysis is priced for 1, 2 or 3 areas, and HIFU for small and medium areas." | S:cryoelectrolipolysis_one_area, _two_areas, _three_areas; S:hifu_small_area..., S:hifu_med_area... |
| "Sessions take from 30 minutes to 2 hours." | S:emsculpt (30 min), S:cryoelectrolipolysis_three_areas (2 hr) |
| "What each treatment aims to do, and which one may suit you, is a question for the free consultation." | F5; BH |
| "Body contouring treatments are aesthetic treatments for adults aged 18 and over." | B18 |
| Price table (8 rows) | S: slug in each row |
| FAQ "Prices start at GBP 99 for Emsculpt or for 1 area of cryoelectrolipolysis." | S:emsculpt, S:cryoelectrolipolysis_one_area |
| FAQ "From 30 minutes for Emsculpt to 2 hours for 3 areas of cryoelectrolipolysis." | S:emsculpt, S:cryoelectrolipolysis_three_areas |

## Story pages set 2 (queue row Q26)

Written 2026-09-13 by a PWEB executor for Q26. Data read from `data/services.json` after rebase onto 7a2808c (data commit f305afa, 112 live rows). Rows moved to review by PEL (stretch_mark_scar_and_burns, localised_fat, injections_collagen) are not on any set 2 page.

### Source keys added for set 2

| Key | Source |
|---|---|
| DESC:family | `content/treatment-descriptions.md`, that family, desc (PEL approved 96eb850), used verbatim or cut |
| AC | "Your therapist gives aftercare advice at the appointment." PEL ruling 8 (brief section 9); fixed sentence in the Q26 row brief |
| R5 | "The price shown is the price you pay." PEL ruling 5 (brief section 9) |
| CL | "consultation-led" for skin boosters: Q26 row brief; DESC:injections_profhilo_skin_booster and DESC:injections_restylane_skin_boosters |
| FAM:slug | `lib/families.ts` family title, used as the name of a cms row without a price (same practice as the 3 facials_1_ rows in set 1) |

Change to the shared aftercare line: set 1's "You leave with clear aftercare advice and can message us with any question." is replaced on set 2 pages by AC, plus "You can message us with any question." (PEL:Home How it works 4, cut) on the massage and waxing pages.

### Sentences shared by the set 2 pages

| Sentence start | Files | Source |
|---|---|---|
| "...at 155 King's Cross Road, 7 days a week." (hero) | all 4 | PEL:Home Hero sub-line, cut; F1, F2; category from C:massage, C:waxing-ladies, C:waxing-men, C:skin, C:skinboosters |
| "Every treatment starts with a free consultation." | massage, waxing, microneedling | PEL:Home Hero sub-line; F5 |
| Buttons "Message us on WhatsApp" / "See treatments and prices" / "Book on Treatwell" | all 4 (skin boosters: no Treatwell button) | PEL:Home Hero buttons, PEL:Contact; F4 |
| "At the consultation we look at your skin or your goal and recommend what suits you." | microneedling, skin boosters (massage: "your goal" only) | PEL:Home How it works 2 (massage: cut) |
| "Results vary from person to person." | microneedling only | BH |
| "If you have a (skin or) health condition, or you are unsure..., ask (at the consultation) before you book." | all 4 | F5; 02-uk-compliance section 4, as set 1 |
| Step 1 "Tell us what you would like to ask about, on WhatsApp or by email." | all 4 | PEL:Home How it works 1, cut; F3, F4 |
| Step 2 "We look at your skin or your goal and recommend what suits you." | all 4 (massage: "your goal" only) | PEL:Home How it works 2 |
| Step 3 "Booked at a time that suits you, 7 days a week." | all 4 | PEL:Home How it works 3; F2 |
| "The duration of each option is listed below." | massage, waxing | S: rows in the page's price table |
| "You can also book through Treatwell." (body and FAQ) | massage, waxing, microneedling | F4 |
| "Aesthetic treatments are for adults aged 18 and over." | microneedling, skin boosters (skin boosters: body and FAQ) | B18; Q26 row brief |
| "The price shown is the price you pay." | all 4 | R5; PEL:Treatments intro |
| Aftercare "Your therapist gives aftercare advice at the appointment." | all 4 | AC |
| FAQ "Where is the clinic?" / "155 King's Cross Road, London WC1X 9BN." | all 4 | F1 |
| FAQ "When are you open?" / "Monday to Saturday 10:00 to 20:00, Sunday and bank holidays 11:00 to 20:00." | all 4 | PEL:Home The clinic; F2 |
| FAQ "Is the consultation free?" / "Yes. Consultations are free." | all 4 | PEL:Home The clinic; F5 |
| FAQ "How do I book?" / "Message us on WhatsApp. You can also book through Treatwell." | massage, waxing, microneedling | F4 |
| CTA "Message us on WhatsApp and we will reply during opening hours." | all 4 | PEL:Home Final call line |

### content/stories/massage-kings-cross.md

| Sentence start | Source |
|---|---|
| title, h1 "Massage in King's Cross" | C:massage; F1 |
| description "Massage at 155..., including Deep Tissue, Swedish and Thai Massage, from GBP 40..." | S:deep_tissue_massage, S:swedish_massage, S:thai_massage, S:face_massage (GBP 40); F1; F5 |
| "The massage menu includes Deep Tissue Massage, Swedish Massage, Thai Massage and Therapeutic Lymphatic Drainage Massage." | S:deep_tissue_massage, S:swedish_massage, S:thai_massage, S:therapeutic_lymphatic_drainage_massage |
| "A Face Massage, a Foot & Leg Massage and a Tension neck & sculp massage (intense) are also on the menu." | S:face_massage, S:foot_leg_massage, S:tension_neck_sculp_massage_intense (name verbatim, ruling 6) |
| "Sessions take from 20 minutes to 1 hour." | S:tension_neck_sculp_massage_intense (20 min); S:deep_tissue_massage, S:thai_massage (1 hr) |
| "Therapeutic Lymphatic Drainage Massage is booked as 30 minutes or 1 hour." | S:therapeutic_lymphatic_drainage_massage (30 min), S:therapeutic_lymphatic_drainage_massage_1 (1 hr) |
| "Not sure which massage to choose?" | question, leads into PEL:Home How it works 2 (set 1 facials pattern) |
| Price table (8 rows) | S: slug in each row; the 2 same-name rows told apart by duration (D51 practice) |
| FAQ "Prices run from GBP 40 for a Face Massage to GBP 80 for a 1 hour Therapeutic Lymphatic Drainage Massage." | S:face_massage, S:therapeutic_lymphatic_drainage_massage_1 |
| FAQ "Every option is listed on this page." | the page's price table |
| FAQ "From 20 minutes for the Tension neck & sculp massage (intense) to 1 hour for a Deep Tissue, Thai or Therapeutic Lymphatic Drainage Massage." | S:tension_neck_sculp_massage_intense, S:deep_tissue_massage, S:thai_massage, S:therapeutic_lymphatic_drainage_massage_1 |

### content/stories/waxing-kings-cross.md

| Sentence start | Source |
|---|---|
| title, h1 "Waxing in King's Cross" | C:waxing-ladies, C:waxing-men; F1 |
| description "Waxing for ladies and men at 155..., from GBP 10..." | S:ladies_waxing_face_hot_wax_full_chin, S:ladies_waxing_face_hot_wax_upper_lip (GBP 10); F1; F5 |
| hero "Waxing for ladies and men at 155 King's Cross Road, 7 days a week." | C:waxing-ladies, C:waxing-men; F1; F2 |
| "Ladies' waxing covers the face, underarm, arms, legs and body, and the bikini, Brazilian, G-String and Hollywood." | S: the 20 waxing-ladies rows (area words in their names) |
| "The face and underarm are waxed with hot wax, and the arms and legs with strip wax." | S:ladies_waxing_face_hot_wax_ (5 rows), S:ladies_waxing_underarm_hot_wax; S:ladies_waxing_half_arm_with_strip_wax, _full_arm_with_strip_wax, _lower_leg_strip_wax, _upper_leg_strip_wax, _full_leg_strip_wax |
| "Men's waxing covers the eyebrow, arms, legs, half chest, shoulder and stomach." | S: the 9 waxing-men rows |
| "Men's waxing does not include intimate areas." | https://www.pureessentialslondon.com/mens, old wording "Hair removal waxing (no intimate waxing)"; PEL ruling 2026-09-13 brief section 27 |
| "Sessions take from 10 minutes to 1 hour." | S:ladies_waxing_face_hot_wax_sideburns (10 min), S:men_s_waxing_full_leg (1 hr) |
| "Not sure which area to book? Ask on WhatsApp, or at the free consultation." | question; F4; F5 |
| "If you have a skin or health condition, or you are unsure about waxing, ask before you book." | set 1 facials sentence, "a facial" changed to "waxing"; F5 |
| Price tables "Waxing, ladies" (20 rows), "Waxing, men" (9 rows) | C:waxing-ladies, C:waxing-men; S: slug in each row; the 2 "Men's Waxing Full Leg" rows told apart by duration (D51 practice) |
| FAQ "Ladies' waxing starts at GBP 10 for the full chin or the upper lip, and men's waxing at GBP 15 for the eyebrow." | S:ladies_waxing_face_hot_wax_full_chin, S:ladies_waxing_face_hot_wax_upper_lip, S:men_s_waxing_eyebrow |
| FAQ "From 10 minutes for ladies' sideburns to 1 hour for a men's full leg." | S:ladies_waxing_face_hot_wax_sideburns, S:men_s_waxing_full_leg |

### content/stories/microneedling-peels-kings-cross.md

| Sentence start | Source |
|---|---|
| title, h1 "Microneedling and peels in King's Cross" | C:skin, cut; F1 |
| description and hero "Microneedling, radio frequency and peels at 155..." (hero: 7 days a week; description: from GBP 75) | C:skin; F1; F2; S:gycolic_acid_peel, S:radio_frequency_indiba (GBP 75); F5 |
| "The Microneedling treatment uses the Skin Needling System, which pierces the skin vertically to make hundreds of tiny open channels." | DESC:aesthetics_1_microneedling, verbatim |
| "It is booked for the face, or for the face and neck." | DESC:aesthetics_1_microneedling, cut; S:microneedling_face, S:microneedling_face_neck |
| "INDIBA Deep Beauty is a radiofrequency device that works at 448 kHz through the Proionic System." | DESC:aesthetics_body_indiba_deep_beauty, cut (areas clause dropped) |
| "Skymedic Chemical Peels are chemical peels, in which a chemical solution is applied to the skin." | DESC:aesthetics_1_skymedic_chemical_peels, cut |
| "Golden Micro Needling is radiofrequency microneedling." | DESC:aesthetics_1_golden_micro_needling, cut |
| "Sessions take from 30 minutes to 1 hour 30 minutes." | S:radio_frequency_indiba (30 min); S:skinox_pigmentation, S:skinox_redness, S:skinox_wrinkles (1 hr 30 min) |
| Price table (14 rows) | S: slug in each row; FAM:aesthetics_1_golden_micro_needling, FAM:aesthetics_1_skymedic_chemical_peels for the 2 rows without a price; D4 |
| FAQ "Microneedling Face is GBP 100 and Microneedling Face + Neck is GBP 150." | S:microneedling_face, S:microneedling_face_neck |
| FAQ "Every option is listed on this page." | the page's price table |
| FAQ "From 30 minutes for Radio Frequency INDIBA to 1 hour 30 minutes for a Skinox treatment." | S:radio_frequency_indiba, S:skinox_pigmentation, S:skinox_redness, S:skinox_wrinkles |

Left out of the table on purpose: aesthetics_1_microneedling and aesthetics_body_indiba_deep_beauty (live cms rows whose family in `lib/families.ts` maps to the priced booking rows already in the table).

### content/stories/skin-boosters-kings-cross.md

| Sentence start | Source |
|---|---|
| title, h1 "Skin boosters consultation in King's Cross" | C:skinboosters, cut; F5; F1 |
| description "Skin boosters and dermal fillers at 155... Every treatment starts with a free consultation, and we recommend what suits you." | C:skinboosters; F1; PEL:Home Hero sub-line; PEL:Home How it works 2, cut |
| hero "Every skin booster and dermal filler treatment starts with a free consultation, at 155 King's Cross Road, 7 days a week." | PEL:Home Hero sub-line, narrowed to C:skinboosters; F5; F1; F2 |
| "Skin boosters and dermal fillers are consultation-led treatments." | CL; C:skinboosters |
| "Every treatment starts with a consultation; we will not recommend a treatment that is not right for you." | PEL:Treatments note, verbatim |
| Step 3 addition "Sessions take from 45 minutes to 1 hour 30 minutes." | S:profhilo, S:profhilo_2_sessions (45 min); S:facial_fillers (1 hr 30 min) |
| Price table (6 rows) | S: slug in each row; FAM:aesthetics_body_profhilo_body for the row without a price; D4 |
| "Where a price says "from", the figure is the lowest option for that treatment and the consultation confirms yours." | PEL:Treatments intro, verbatim; S:facial_fillers price_from true |
| FAQ "Do I need a consultation first?" / "Yes. Every treatment starts with a free consultation." | PEL:Home Hero sub-line; F5 |
| FAQ "Who can have these treatments?" / "Aesthetic treatments are for adults aged 18 and over." | B18 |
| FAQ "How do I book a consultation?" / "Message us on WhatsApp." | F4 |

Left out of this page on purpose: any product ingredient, any method sentence, any brand name outside the price table, "Results vary", and a Treatwell booking line (consultation-led). injections_profhilo_skin_booster and injections_restylane_skin_boosters (live cms rows) are not in the table, because their families map to the priced booking rows already in it.

## Story pages set 3 (queue row Q27)

Written 2026-09-13 by a PWEB executor for Q27, at website commit f4c37dc. Data read from `data/services.json` at that commit (111 live rows). The 4 group "from" figures reused from content/home.md were re-checked against the live rows and the group map in `lib/groups.ts`: Face GBP 70 (S:hydrating), Body GBP 99 (S:emsculpt, S:cryoelectrolipolysis_one_area), Laser and hair removal GBP 25 (S:ipl_small_area), Wellness GBP 10 (S:ladies_waxing_face_hot_wax_full_chin, S:ladies_waxing_face_hot_wax_upper_lip).

### Source keys added for set 3

| Key | Source |
|---|---|
| RP | Room photo rule: `docs/design/imagery-guideline.md` section 4 and section 10 (room-warm, room-trolley, room-analyser, room-couch "may say a treatment room at Pure Essentials London"); lead brief section 11 |
| SIGN | Page signpost: names the sections of the page it sits on and states no fact about the business |

### Sentences shared by the set 3 pages

| Sentence start | Files | Source |
|---|---|---|
| "Every treatment starts with a free consultation." | all 3 (hero; our-clinic also description) | PEL:Home Hero sub-line; F5 |
| Buttons "Message us on WhatsApp" / "See treatments and prices" / "Book on Treatwell" | all 3 | PEL:Home Hero buttons, PEL:Contact; F4 |
| "Pure Essentials London is a salon and clinic at 155 King's Cross Road, WC1X 9BN." | all 3 (our-clinic: hero and description) | PEL:Home The clinic, verbatim; F1 |
| "King's Cross St Pancras (Circle, Hammersmith and City, Metropolitan, Northern, Piccadilly, Victoria lines) is the nearest station." | all 3 | PEL:Contact Getting here, verbatim from contact.md; TFL; rulings 1 and 4 (brief section 9) |
| "Open Monday to Saturday 10:00 to 20:00, Sunday and bank holidays 11:00 to 20:00." | our-clinic, your-visit | PEL:Home The clinic; F2 |
| "Tell us what you would like to change or ask about, on WhatsApp or by email." | all 3 | PEL:Home How it works 1, verbatim; F3, F4 |
| "You can also book through Treatwell." | all 3 (body and FAQ; first-visit-guide FAQ only) | F4 |
| "At the consultation we look at your skin or your goal and recommend what suits you." | all 3 | PEL:Home How it works 2 (set 1 story wording) |
| "Every treatment starts with a consultation; we will not recommend a treatment that is not right for you." | all 3 | PEL:Treatments note, verbatim (as skin boosters, set 2) |
| "Consultations are free." | all 3 (body and FAQ) | PEL:Home The clinic; F5 |
| "Aesthetic treatments are for adults aged 18 and over." | your-visit; first-visit-guide (body and FAQ) | B18; fixed sentence in the Q27 row brief |
| "If you have a skin or health condition, or you are unsure about a treatment, ask (at the consultation) before you book." | your-visit ("at the consultation"), first-visit-guide | set 1 facials sentence, "a facial" changed to "a treatment"; F5; 02-uk-compliance section 4 |
| "Results vary from person to person." | your-visit, first-visit-guide | BH |
| "Your therapist gives aftercare advice at the appointment." | your-visit, first-visit-guide | AC |
| "You can message us with any question." | your-visit, first-visit-guide | PEL:Home How it works 4, cut (as set 2 massage and waxing) |
| "The price shown is the price you pay." | your-visit, first-visit-guide | R5; PEL:Treatments intro |
| "Message us on WhatsApp and we will reply during opening hours." (CTA, and body on your-visit and first-visit-guide) | all 3 | PEL:Home Final call line |
| FAQ "Where is the clinic?" / "155 King's Cross Road, London WC1X 9BN." | all 3 | F1 |
| FAQ "When are you open?" / "Monday to Saturday 10:00 to 20:00, Sunday and bank holidays 11:00 to 20:00." | all 3 | PEL:Home The clinic; F2 |
| FAQ "Is the consultation free?" / "Yes. Consultations are free." | all 3 | PEL:Home The clinic; F5 |
| FAQ "How do I book?" / "Message us on WhatsApp. You can also book through Treatwell." | all 3 | F4 |

### content/stories/our-clinic-kings-cross.md

| Sentence start | Source |
|---|---|
| title, h1 "Our clinic in King's Cross" | PEL:Home The clinic ("a salon and clinic"), cut; F1 |
| description "Open 7 days a week." | PEL:Home How it works 3 ("7 days a week"), cut; F2 |
| "Find us at 155 King's Cross Road, London WC1X 9BN." | PEL:Contact description, cut; F1 |
| "For the face: HIFU, skin boosters, microneedling, peels and facials, from GBP 70." | PEL:Home groups, Face line and figure; `lib/groups.ts`; S:hydrating |
| "For the body: 3D lipo, HIFU body and Emsculpt, from GBP 99." | PEL:Home groups, Body line and figure; S:emsculpt, S:cryoelectrolipolysis_one_area |
| "Laser and hair removal: pigmentation, rejuvenation and tattoo removal; laser and IPL hair removal, from GBP 25." | PEL:Home groups, Laser line and figure; S:ipl_small_area |
| "Wellness: massage and waxing, from GBP 10." | PEL:Home groups, Wellness line and figure; S:ladies_waxing_face_hot_wax_full_chin, S:ladies_waxing_face_hot_wax_upper_lip |
| "The photographs in this section show treatment rooms at Pure Essentials London." | RP |

### content/stories/your-visit.md

| Sentence start | Source |
|---|---|
| title "Your Visit, King's Cross", h1 "Your visit" | SIGN; F1 |
| description "Your visit to Pure Essentials London at 155 King's Cross Road, from your first message to the free consultation, your treatment and aftercare advice." | PEL:Home How it works 1 to 4, cut; F1; F5; AC |
| "This page walks through a visit, from your first message to aftercare." | SIGN |
| "The photographs in this section show treatment rooms at Pure Essentials London." | RP |
| "Booked at a time that suits you, 7 days a week." | PEL:Home How it works 3, verbatim; F2 |
| "To book again, message us on WhatsApp." | F4 |

### content/stories/first-visit-guide.md

| Sentence start | Source |
|---|---|
| title "First Visit Guide, King's Cross", h1 "Your first visit" | SIGN; F1 |
| description "Planning your first visit to 155 King's Cross Road?" | SIGN; F1 |
| description "What to message us, the free consultation, opening hours, how prices are shown and aftercare." | SIGN; F5 |
| "This guide covers what to message us, what to expect, opening hours and how prices are shown." | SIGN |
| "Not sure which treatment to choose?" | question, leads into PEL:Home How it works 2 (set 1 facials pattern) |
| "Your treatment is booked at a time that suits you, 7 days a week." | PEL:Home How it works 3, "Your treatment is" added; F2 |
| Hours table (3 rows) | PEL:Contact hours table, verbatim from contact.md; F2 |
| "Where a price says "from", the figure is the lowest option for that treatment and the consultation confirms yours." | PEL:Treatments intro, verbatim (as skin boosters, set 2) |
| "Where a treatment shows "Ask for a quote", ask on WhatsApp." | D4; F4; set 1 facials FAQ ("ask for a quote on WhatsApp") |
| FAQ "Who can have aesthetic treatments?" / "Aesthetic treatments are for adults aged 18 and over." | B18 (set 2 skin boosters FAQ pattern) |

Left out of set 3 on purpose, for lack of a held fact: what the entrance or reception looks like; whether to arrive early; how long a consultation takes; whether the consultation and the treatment happen on the same visit; what to bring or wear; payment methods; how to find the door from the street; walking minutes, parking and access; what the rooms contain beyond "treatment rooms" (the skin analyser and the gold walls are visible in the photos, but no sentence names them).
