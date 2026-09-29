# Treatment descriptions (draft for PEL review)

Drafted 2026-09-13 by PWEB under PEL ruling 8. Families are in category order (hifu, laser, skin, skinboosters, carboxy, body, hair, facials). Durations are copied verbatim from data/services.json. Old-site facts were read from www.pureessentialslondon.com on 2026-09-13; claims on those pages were not used. Held-back families are listed at the end.

## aesthetics_1_hifu
title: HIFU

HIFU stands for high intensity focused ultrasound, a method that uses ultrasound energy. For the face and neck it is booked as "Half Face", "Neck", "Eyes", "Smile Line", "Full Face + Neck", "Cheek, Jawline & Neck" or "Full Face + Chin + Neck". A session takes from 30 min for the eyes or the smile line to 2 hr for full face, chin and neck, and the length depends on the area booked. Your therapist gives aftercare advice at the appointment. Every treatment starts with a free consultation.

sources:
- S1: https://www.pureessentialslondon.com/aesthetics-1/hifu, fact taken: "(Hifu) high intensity focused ultrasound", uses "ultrasound energy"
- S2: data/services.json `name` of rows `full_face`, `full_face_1`, `half_face`, `neck`, `full_face_neck`, `full_face_chin_neck` (mapped in lib/families.ts)
- S3: data/services.json `duration` of `neck` ("45 min") and `full_face_chin_neck` ("2 hr"); other rows "1 hr 45 min", "1 hr 30 min", "1 hr"
- aftercare and consultation lines: PEL ruling 8 and the PEL-approved consultation fact

## aesthetics_1_cryopen
title: CryoPen

The CryoPen is a device that applies nitrous oxide to the surface of the skin, with control over how deep the nitrous oxide goes and over the border of the area it covers. Its session length is not on the price list yet, so ask on WhatsApp before you book. Your therapist gives aftercare advice at the appointment. Every treatment starts with a free consultation.

sources:
- S1: https://www.pureessentialslondon.com/aesthetics-1/cryopen, facts taken: device name "CryoPen"; "control of how deep the nitrous oxide penetrates and the circumference or border of the area treated"; "anything on the surface of the skin"
- S2: data/services.json `aesthetics_1_cryopen` `duration` null, and lib/families.ts `priced: []`; WhatsApp as the contact route from content/stories/facials-kings-cross.md (PEL-approved copy set 1)

## aesthetics_1_ipl_intense_pulsed_light
title: IPL (Intense Pulsed Light)

IPL uses intense pulsed light, a visible broad-spectrum light with multiple wavelengths between 500 and 1,200 nanometres, and the clinic's IPL page describes its use on the face. It is booked as "Pigmentation Reduction (IPL)" or "Rejuvenation IPL", and each session takes 45 min. Your therapist gives aftercare advice at the appointment. Every treatment starts with a free consultation.

sources:
- S1: https://www.pureessentialslondon.com/aesthetics-1/ipl-(intense-pulsed-light), facts taken: "an intense, visible, broad-spectrum light"; "multiple wavelengths (all between 500 and 1,200 nanometres)"; page refers to treating the face
- S2: data/services.json `name` and `duration` of `pigmentations_ipl` ("45 min") and `rejuvenation_ipl` ("45 min")

## aesthetics_1_pico_laser
title: Pico Laser

The Pico Laser treatment uses Picosure, a laser that works with ultra-short pulses known as PressureWave. It is booked as "Pigmentation Reduction (Picosure)" or "Rejuvenation Picosure", and each session takes 45 min. Your therapist gives aftercare advice at the appointment. Every treatment starts with a free consultation.

sources:
- S1: https://www.pureessentialslondon.com/aesthetics-1/pico-laser, facts taken: device name "Picosure"; "ultra-short pulses to create a photomechanical effect, known as PressureWave"
- S2: data/services.json `name` and `duration` of `pigmentations_picosure` ("45 min") and `rejuvenation_picosure` ("45 min")

## aesthetics_body_tattoo_removal
title: Tattoo Removal

This treatment uses the 3D-NanoSure, a dual wavelength Nd:Yag laser with Q-switching at 1064 nm and 532 nm, on the skin where a tattoo has been applied. Q-switching produces quick, powerful pulses of laser light. The price list shows "Tattoo Removal (1 Session)" at 15 min, and the medium area (3-8cm) and large area (8-15cm) at 1 hr. Your therapist gives aftercare advice at the appointment. Every treatment starts with a free consultation.

sources:
- S1: https://www.pureessentialslondon.com/aesthetics-body/tattoo-removal-, facts taken: "3D-NanoSure dual wavelength laser with Q-switching application"; "Nd:Yag ... 1064 x 532nm"; "wherever a tattoo has been applied"
- S2: same URL, fact taken: "quick, powerful pulse" (the outcome part of that sentence was not used)
- S3: data/services.json `name` and `duration` of `tattoo_removal_1_session` ("15 min"), `medium_area_tattoo_removal_3_8cm` ("1 hr"), `tattoo_large_area_8_15cm` ("1 hr"), `men_s_tattoo_large_area_8_15cm` ("1 hr")

## aesthetics_1_golden_micro_needling
title: Fractional Radiofrequency Microneedling

Fractional Radiofrequency Microneedling is radiofrequency microneedling, which directs radiofrequency heat into the deep dermis and sub-dermal layers of the skin. Its session length is not on the price list yet, so ask on WhatsApp before you book. Your therapist gives aftercare advice at the appointment. Every treatment starts with a free consultation.

sources:
- S1: https://www.pureessentialslondon.com/aesthetics-1/golden-micro-needling, facts taken: method "Radiofrequency Microneedling"; "radiofrequency heat"; "deep dermis and sub-dermal layers"
- S2: data/services.json `aesthetics_1_golden_micro_needling` `duration` null, lib/families.ts `priced: []`

## aesthetics_1_microneedling
title: Microneedling

The Microneedling treatment uses the Skin Needling System, which pierces the skin vertically to make hundreds of tiny open channels. It is booked for the face or for the face and neck: "Microneedling Face" takes 1 hr and "Microneedling Face + Neck" takes 1 hr 15 min. Your therapist gives aftercare advice at the appointment. Every treatment starts with a free consultation.

sources:
- S1: https://www.pureessentialslondon.com/aesthetics-1/microneedling, facts taken: "The Skin Needling System"; "used to vertically pierce the skin to produce hundreds of tiny open channels"
- S2: data/services.json `name` and `duration` of `microneedling_face` ("1 hr") and `microneedling_face_neck` ("1 hr 15 min")

## aesthetics_body_indiba_deep_beauty
title: Indiba Deep Beauty

INDIBA Deep Beauty is a radiofrequency device that works at 448 kHz through the Proionic System, and it is used on the face and body. "Radio Frequency INDIBA" takes 30 min, and "Radio Frequency INDIBA full back/ leg", for the full back or leg, takes 1 hr. Your therapist gives aftercare advice at the appointment. Every treatment starts with a free consultation.

sources:
- S1: https://www.pureessentialslondon.com/aesthetics-body/indiba-deep-beauty, facts taken: "INDIBA® Deep Beauty"; radiofrequency energy at "448kHz frequency"; "Proionic® System®"; "for the face and body" (areas only)
- S2: data/services.json `name` and `duration` of `radio_frequency_indiba` ("30 min") and `radio_frequency_indiba_full_back_leg` ("1 hr")

## aesthetics_body_profhilo_body
title: Profhilo Body Treatment

The Profhilo Body Treatment is a concentrated hyaluronic acid formula used on the inner arm and the abdomen, given at 10 injection points for each area. It is a consultation-led treatment, and its session length is not on the price list yet, so ask on WhatsApp before you book. Your therapist gives aftercare advice at the appointment. Every treatment starts with a free consultation.

sources:
- S1: https://www.pureessentialslondon.com/aesthetics-body/profhilo-body, facts taken: "concentrated hyaluronic acid formula"; "the inner arm and the abdomen" (areas only); "Only 10 points of injection for each area"
- S2: data/services.json `aesthetics_body_profhilo_body` `duration` null, lib/families.ts `priced: []`; "consultation-led" from the row brief (ruling 8 support, PWEB row Q12/Q25)

## injections_profhilo_skin_booster
title: Profhilo Skin Booster

Profhilo is made of ultra-pure hyaluronic acid, injected into the area being treated. It is a consultation-led treatment, and the price list shows "Profhilo Treatment (1 Session)" and "Profhilo Treatment Course (2 Sessions)", each with a duration of 45 min. Your therapist gives aftercare advice at the appointment. Every treatment starts with a free consultation.

sources:
- S1: https://www.pureessentialslondon.com/injections/profhilo-skin-booster-, fact taken: "Ultra-pure hyaluronic acid is precisely injected into the area being treated"
- S2: data/services.json `name` and `duration` of `profhilo` ("45 min") and `profhilo_2_sessions` ("45 min"); "consultation-led" from the row brief (ruling 8 support, PWEB row Q12/Q25)

## injections_restylane_skin_boosters
title: Restylane Skin Boosters

The products used are from the Restylane range, and the clinic's page describes their use on the upper face, the neck and the lips. It is a consultation-led treatment, booked as "Cheeks, jaw line, nasolabial (1ml)" or "Dermal Filler (1mL)" at 1 hr, or "Facial Fillers" at 1 hr 30 min. Your therapist gives aftercare advice at the appointment. Every treatment starts with a free consultation.

sources:
- S1: https://www.pureessentialslondon.com/injections/restylane-skin-boosters, facts taken: product brand "Restylane"; "Treating the upper face and neck area"; "Hydrating lips" (area only). The full product name on that page contains a medicine name and was not used.
- S2: data/services.json `name` and `duration` of `cheeks_jaw_line_nasolabial_1ml` ("1 hr"), `display_name` and `duration` of `lip_0_55ml` ("1 hr"), `facial_fillers` ("1 hr 30 min"); "consultation-led" from the row brief (ruling 8 support, PWEB row Q12/Q25)

## aesthetics_body_3d_lipo
title: 3D Lipo

3D Lipo is a device with 4 transducers that combines cavitation, cryolipolysis, focus fractional radio frequency and 3D-Dermology, which uses a vacuum with a roller action. A 3D Lipo session takes 1 hr. Your therapist gives aftercare advice at the appointment. Every treatment starts with a free consultation.

sources:
- S1: https://www.pureessentialslondon.com/aesthetics-body/3d-lipo, facts taken: "Cavitation", "Cryolipolysis", "Focus Fractional Radio Frequency", "3D-Dermology"; "Four Transducers"; "the vacuum combined with the roller action"
- S2: data/services.json `3d_lipo` `duration` ("1 hr")

## aesthetics_body_emsculpt
title: Emsculpt

Emsculpt is a device based on HIFEM energy. During the 30 min session the device causes muscle contractions. Your therapist gives aftercare advice at the appointment. Every treatment starts with a free consultation.

sources:
- S1: https://www.pureessentialslondon.com/aesthetics-body/emsculpt, fact taken: "EMSCULPT is based on HIFEM energy"
- S2: data/services.json `emsculpt` `duration` ("30 min"); same URL, fact taken: "A single EMSCULPT session causes thousands of powerful muscle contractions" (process only, the rest of the sentence not used)

## aesthetics_body_hifu_body
title: HIFU Body

HIFU Body uses ultrasound and controlled high temperature, delivered as a 24-line matrix of focused energy, and the clinic's page lists the abdomen, hips, buttocks, inner thighs, outer thighs and inner arm as areas. It is booked as "HIFU Small Area (Knees, Underarm or Bust)", "HIFU Medium Area (Upper Arms or Waist)" or "HIFU Large Area (Outer Thighs or Full Stomach)", each at 45 min. Your therapist gives aftercare advice at the appointment. Every treatment starts with a free consultation.

sources:
- S1: https://www.pureessentialslondon.com/aesthetics-body/hifu-body, facts taken: "uses ultrasound and controlled high temperature"; "a 24-line matrix of focused energy"; "Abdomen, Hips, Buttocks, Inner thighs, Outer thighs, Inner arm"
- S2: data/services.json `display_name` and `duration` of `hifu_small_area_knees_armpit_bust_lift`, `hifu_med_area_flappy_arms_lovehandle` and `large_area_outer_thighs_full_stomach` ("45 min" each; clinic WhatsApp 2026-09-18, Q42 A15 to A17)

## aesthetics_body_laser_hair_removal_2F_ipl
title: Laser Hair Removal / IPL

This treatment uses either a LONGPULSE laser or IPL (intense pulsed light), and common areas include the legs, armpits, upper lip, chin and bikini line. Both are priced by the size of the area: IPL sessions take from 15 min for a small area to 1 hr 30 min for an extra large area, and laser sessions take from 30 min for a medium area to 1 hr 30 min for an extra large area. Your therapist gives aftercare advice at the appointment. Every treatment starts with a free consultation.

sources:
- S1: https://www.pureessentialslondon.com/aesthetics-body/laser-hair-removal-%2F-ipl, facts taken: "LONGPULSE"; "IPL (Intense Pulsed Light)"; "Common treatment locations include legs, armpits, upper lip, chin and the bikini line"
- S2: data/services.json `name` and `duration` of `ipl_small_area` ("15 min"), `ipl_extra_large_area` ("1 hr 30 min"), `laser_hair_removal_medium_area` ("30 min"), `laser_hair_removal_extra_large_area` ("1 hr 30 min")

## aesthetics_1_hydro_facial
title: Hydro Facial

The Hydro Facial uses HYDRO ampoule solutions on the skin. The Hydrofacial takes 1 hr and runs through cleansing with gentle exfoliation, extraction by suction, a mask chosen for the skin type, and antioxidants and peptides on the skin's surface. Your therapist gives aftercare advice at the appointment. Every treatment starts with a free consultation.

sources:
- S1: https://www.pureessentialslondon.com/aesthetics-1/hydro-facial, fact taken: "HYDRO ampoules solutions"; "the skin"
- S2: data/services.json `hydrofacial` `duration` ("1 hr"); same URL, facts taken: "Cleanse ... gentle exfoliation"; "Extract ... suction"; "An unique mask will be apply on according to client's skin type"; "antioxidants and peptides" on "the skin's surface"

## facials_1_age_defence_sensitive_skin_treatment
title: Anti-Aging Facial

The Anti-Aging Facial is a facial that uses the Katherine Daniels Collagen Mask for Sensitive Skin. Its session length is not on the price list yet, so ask on WhatsApp before you book. Your therapist gives aftercare advice at the appointment. Every treatment starts with a free consultation.

sources:
- S1: https://www.pureessentialslondon.com/facials-1/age-defence-sensitive-skin-treatment-, fact taken: "Katherine Daniels Collagen Mask for Sensitive Skin"; data/services.json `category` "facials"
- S2: data/services.json `facials_1_age_defence_sensitive_skin_treatment` `duration` null, lib/families.ts `priced: []` (the page's own "60 minutes" is not in the data and was not used)

## facials_1_diamondtome_microdermabrasion
title: DiamondTome Microdermabrasion

DiamondTome Microdermabrasion uses a microdermabrasion wand plated with pure nickel and natural diamond chips, used on the skin. It is booked as a 30 min or a 1 hr session. Your therapist gives aftercare advice at the appointment. Every treatment starts with a free consultation.

sources:
- S1: https://www.pureessentialslondon.com/facials-1/diamondtome-microdermabrasion, fact taken: "a microdermabrasion wand plated with pure nickel and natural diamond chips"; "skin"
- S2: data/services.json `duration` of `facials_1_diamondtome_microdermabrasion` ("30 min") and `diamondtome_microdermabrasion_1_hr` ("1 hr"), clinic WhatsApp 2026-09-18 (Q42 A12)

## story-pages

### hifu-kings-cross

HIFU stands for high intensity focused ultrasound, a method that uses ultrasound energy. For the face it is booked as half face, neck, eyes, smile line, full face and neck, cheek, jawline and neck, or full face, chin and neck, and a session takes from 30 min to 2 hr depending on the area. For the body it is booked as a small, medium or large area, each at 45 min. Your therapist gives aftercare advice at the appointment. Every treatment starts with a free consultation.

sources:
- S1: https://www.pureessentialslondon.com/aesthetics-1/hifu, fact taken: "(Hifu) high intensity focused ultrasound", "ultrasound energy"
- S2: data/services.json `name` of `full_face`, `half_face`, `neck`, `full_face_neck`, `full_face_chin_neck`; `duration` of `neck` ("45 min") and `full_face_chin_neck` ("2 hr")
- S3: data/services.json `display_name` and `duration` of `hifu_small_area_knees_armpit_bust_lift` ("45 min") and `hifu_med_area_flappy_arms_lovehandle` ("1 hr 30 min")

### laser-hair-removal-kings-cross

This treatment uses either a LONGPULSE laser or IPL (intense pulsed light), and common areas include the legs, armpits, upper lip, chin and bikini line. Both are priced by the size of the area: IPL sessions take from 15 min for a small area to 1 hr 30 min for an extra large area, and laser sessions take from 30 min for a medium area to 1 hr 30 min for an extra large area. Your therapist gives aftercare advice at the appointment. Every treatment starts with a free consultation.

sources:
- S1: https://www.pureessentialslondon.com/aesthetics-body/laser-hair-removal-%2F-ipl, facts taken: "LONGPULSE"; "IPL (Intense Pulsed Light)"; "legs, armpits, upper lip, chin and the bikini line"
- S2: data/services.json `duration` of `ipl_small_area` ("15 min"), `ipl_extra_large_area` ("1 hr 30 min"), `laser_hair_removal_medium_area` ("30 min"), `laser_hair_removal_extra_large_area` ("1 hr 30 min")

### facials-kings-cross

The Hydrofacial uses HYDRO ampoule solutions and takes 1 hr, running through cleansing with gentle exfoliation, extraction by suction, a mask chosen for the skin type, and antioxidants and peptides on the skin's surface. The Calming and Hydrating Facial takes 1 hr 45 min. The Anti-Aging Facial uses the Katherine Daniels Collagen Mask for Sensitive Skin, and DiamondTome Microdermabrasion uses a wand plated with pure nickel and natural diamond chips. Your therapist gives aftercare advice at the appointment. Every treatment starts with a free consultation.

sources:
- S1: https://www.pureessentialslondon.com/aesthetics-1/hydro-facial, facts as in `aesthetics_1_hydro_facial` above; data/services.json `hydrofacial` `duration` ("1 hr")
- S2: data/services.json `hydrating` `name` and `duration` ("1 hr 45 min")
- S3: https://www.pureessentialslondon.com/facials-1/age-defence-sensitive-skin-treatment-, https://www.pureessentialslondon.com/facials-1/diamondtome-microdermabrasion, facts as in the 2 facial families above

### body-contouring-kings-cross

3D Lipo combines cavitation, cryolipolysis, focus fractional radio frequency and 3D-Dermology, a vacuum with a roller action, and a session takes 1 hr. Emsculpt is based on HIFEM energy and causes muscle contractions during a 30 min session. HIFU Body uses focused ultrasound on areas the clinic lists as the abdomen, hips, buttocks, thighs and inner arm, booked as a small, medium or large area at 45 min. Cryoelectrolipolysis is booked for 1, 2 or 3 areas, at 45 min, 1 hr 30 min or 2 hr. Your therapist gives aftercare advice at the appointment. Every treatment starts with a free consultation.

sources:
- S1: https://www.pureessentialslondon.com/aesthetics-body/3d-lipo, facts as in `aesthetics_body_3d_lipo` above; data/services.json `3d_lipo` `duration` ("1 hr")
- S2: https://www.pureessentialslondon.com/aesthetics-body/emsculpt, "EMSCULPT is based on HIFEM energy", "muscle contractions"; data/services.json `emsculpt` `duration` ("30 min")
- S3: https://www.pureessentialslondon.com/aesthetics-body/hifu-body, "ultrasound", "Abdomen, Hips, Buttocks, Inner thighs, Outer thighs, Inner arm"; data/services.json `duration` of `hifu_small_area_knees_armpit_bust_lift` ("45 min") and `hifu_med_area_flappy_arms_lovehandle` ("1 hr 30 min")
- S4: data/services.json `name` and `duration` of `cryoelectrolipolysis_one_area` ("45 min"), `cryoelectrolipolysis_two_areas` ("1 hr 30 min"), `cryoelectrolipolysis_three_areas` ("2 hr")

## held-back

- aesthetics_1_etherea_mx and facials_1_eberlin_facial: removed at the clinic's request 2026-09-18 (K, queue row Q42 A13 and A21). Their rows are status "removed" in data/services.json and their descriptions were taken out of this file.
- aesthetics_1_emsculpt: duplicate cms page for the same treatment as aesthetics_body_emsculpt (lib/families.ts merge note, `priced: []`). Use the aesthetics_body_emsculpt description; writing it twice adds nothing.
- aesthetics_body_carboxytherapy: its 2 booking rows are named "Localised fat" and "Stretch mark, Scar and burns". These have the same shape as POM review group 5 (services named after conditions, including stretch-marks and c-section-scars) and sit next to group 2 (fat dissolving). The page also does not say how the carbon dioxide is delivered. Needs a PEL ruling before any description.
- injections_collagen: the page does not say whether the collagen is injected, applied or delivered by a device, and its only sentence about the body is "a whole body whitening process". That is a skin-lightening claim, the concern behind POM review group 3. It also sits in the cms "injections" collection. Not described.

## row-descriptions

Shown under a price row on /treatments/ (lib/row-descriptions.ts), keyed by the row's slug in data/services.json. The clinic's own words, from F in the clinic's WhatsApp group on 2026-09-21 13:36 (queue row Q42 A22). F wrote "Helo" once and "Halo" elsewhere; the site uses Halo. Not a family section: lib/family-pages.ts stops reading at `## story-pages`.

### head_spa_ritual
A restorative ritual featuring scalp, neck and shoulder massage, Gua Sha therapy, and targeted pressure point techniques to release tension and promote deep relaxation.

### head_spa_exotic
A rejuvenating head spa experience including scalp, shoulder and arm massage, double shampoo cleanse, steam therapy, nourishing hair treatment, Halo water ritual, and rough dry finish.

### head_spa_serenity
A deeply relaxing ritual combining scalp, neck and shoulder massage, therapeutic scalp tools, ritual combing massage, steam therapy, nourishing treatment, double shampoo cleanse, mini radiance facial, Halo water ritual, and rough dry finish.

### head_spa_royal_glow
Our signature luxury head spa experience featuring therapeutic scalp brushing and massage, fresh herb steam therapy, Halo waterfall ritual, intensive hair mask with steam infusion, luxury facial cleanse, exfoliation and hydration, lifting facial massage, lymphatic drainage, soothing aromatherapy, and mindful relaxation.

### steps: head-spa
1. Shampoo with massage on the scalp.
2. Wash off the shampoo with Halo.
3. Hair scrub, then wash off with Halo.
4. Conditioner with a head massager, then wash off with Halo.
5. Hair mask with scalp massage and scalp massage tools (shoulder and facial massage can be added at an extra cost).
6. Steam the hair.
7. Blow-dry (not styling).
