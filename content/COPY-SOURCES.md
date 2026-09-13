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
| B18 | Lead brief: "Aesthetic treatments are for adults aged 18 and over. Prices include VAT." (also 02-uk-compliance 2.1 and 3) |
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
| "Prices include VAT." | PEL:Treatments intro |
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
| "Aesthetic treatments are for adults aged 18 and over. Prices include VAT." | HIFU, laser hair, body | B18; PEL:Treatments intro and note |
| "Prices include VAT." | facials | PEL:Treatments intro |
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
| "To find out which size your area counts as, ask on WhatsApp." | F4 |
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
