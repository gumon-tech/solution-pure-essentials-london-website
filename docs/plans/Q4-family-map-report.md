# Q4 family map report

Generated 2026-09-13 by room PWEB, executor for queue row Q4, from `data/services.json`
(176 rows, 115 live) and `lib/families.ts`, by running
`node --experimental-strip-types` over both. Not hand counted.

Live cms rows (families): 24. Live priced booking rows: 91. Mapped: 38. Unmapped: 53.

## Families

| Family slug | Title | Category | Priced rows | Names |
|---|---|---|---|---|
| aesthetics_1_cryopen | Cryopen | laser | 0 | - |
| aesthetics_1_emsculpt | Emsculpt | body | 0 | - |
| aesthetics_1_etherea_mx | Etherea MX | laser | 0 | - |
| aesthetics_1_golden_micro_needling | Golden Micro Needling | skin | 0 | - |
| aesthetics_1_hifu | HIFU | hifu | 6 | Full Face (1 hr 45 min, GBP 450); Full Face (1 hr 30 min, GBP 300); Full Face + Chin + Neck (2 hr, GBP 560); Full Face + Neck (1 hr, GBP 350); Half Face (1 hr, GBP 280); Neck (45 min, GBP 299) |
| aesthetics_1_hydro_facial | Hydro Facial | facials | 1 | Hydrofacial (1 hr, GBP 100) |
| aesthetics_1_ipl_intense_pulsed_light | IPL (Intense Pulsed Light) | laser | 2 | Pigmentations IPL (45 min, GBP 99); Rejuvenation IPL (45 min, GBP 99) |
| aesthetics_1_microneedling | Microneedling | skin | 2 | Microneedling Face (1 hr, GBP 100); Microneedling Face + Neck (1 hr 15 min, GBP 150) |
| aesthetics_1_pico_laser | Pico Laser | laser | 2 | Pigmentations Picosure (45 min, GBP 150); Rejuvenation Picosure (45 min, GBP 150) |
| aesthetics_1_skymedic_chemical_peels | Skymedic Chemical Peels | skin | 0 | - |
| aesthetics_body_3d_lipo | 3D Lipo | body | 1 | 3D Lipo (1 hr, GBP 125) |
| aesthetics_body_carboxytherapy | Carboxytherapy | carboxy | 2 | Localised fat (1 hr, GBP 130); Stretch mark, Scar and burns (45 min, GBP 99) |
| aesthetics_body_emsculpt | Emsculpt | body | 1 | Emsculpt (30 min, GBP 99) |
| aesthetics_body_hifu_body | HIFU Body | body | 2 | Hifu Med Area (Flappy arms/lovehandle) (1 hr 30 min, GBP 280); Hifu Small Area (Knees/Armpit/Bust lift) (45 min, GBP 140) |
| aesthetics_body_indiba_deep_beauty | Indiba Deep Beauty | skin | 2 | Radio Frequency INDIBA (30 min, GBP 75); Radio Frequency INDIBA full back/ leg (1 hr, GBP 100) |
| aesthetics_body_laser_hair_removal_2F_ipl | Laser Hair Removal / IPL | hair | 7 | IPL Extra Large Area (1 hr 30 min, GBP 99); IPL Large Area (45 min, GBP 70); IPL Medium Area (30 min, GBP 45); IPL Small Area (15 min, GBP 25); Laser Hair Removal Extra Large Area (1 hr 30 min, GBP 80); Laser Hair Removal Large Area (45 min, GBP 60); Laser Hair Removal Medium Area (30 min, GBP 35) |
| aesthetics_body_profhilo_body | Profhilo Body | skinboosters | 0 | - |
| aesthetics_body_tattoo_removal | Tattoo Removal | laser | 4 | Medium Area Tattoo Removal (3-8cm) (1 hr, GBP 100); Men's Tattoo Large Area (8-15cm) (1 hr, GBP 199); Tattoo Large Area (8-15cm) (1 hr, GBP 199); Tattoo Removal (1 Session) (15 min, GBP 69) |
| facials_1_age_defence_sensitive_skin_treatment | Age Defence Sensitive Skin Treatment | facials | 0 | - |
| facials_1_diamondtome_microdermabrasion | Diamondtome Microdermabrasion | facials | 0 | - |
| facials_1_eberlin_facial | Eberlin Facial | facials | 0 | - |
| injections_collagen | Collagen | carboxy | 1 | Collagen (1 hr 30 min, GBP 90) |
| injections_profhilo_skin_booster | Profhilo Skin Booster | skinboosters | 2 | Profhilo (45 min, GBP 250); Profhilo 2 Sessions (45 min, GBP 400) |
| injections_restylane_skin_boosters | Restylane Skin Boosters | skinboosters | 3 | Cheeks, jaw line, nasolabial (1ml) (1 hr, GBP 350); Facial Fillers (1 hr 30 min, GBP 350); Lip (0.55ml) (1 hr, GBP 350) |

## Live priced rows left unmapped

Every live priced booking row not listed above, with 1 reason each.

| Slug | Name | Category | Reason unmapped |
|---|---|---|---|
| collagen_production_full_face | Collagen Production (full Face) | skin | RF collagen-stimulation treatment (category skin), not the injectable Collagen cms family (category carboxy) |
| cosmelan_depigmenting_including_home_kit | Cosmelan Depigmenting including home kit | skin | branded peel (Cosmelan) with no matching cms family |
| cryoelectrolipolysis_one_area | Cryoelectrolipolysis One Area | body | different modality (cryolipolysis) from the 3D Lipo cms family; no explicit merge instruction |
| cryoelectrolipolysis_three_areas | Cryoelectrolipolysis Three Areas | body | different modality (cryolipolysis) from the 3D Lipo cms family; no explicit merge instruction |
| cryoelectrolipolysis_two_areas | Cryoelectrolipolysis Two Areas | body | different modality (cryolipolysis) from the 3D Lipo cms family; no explicit merge instruction |
| deep_tissue_massage | Deep Tissue Massage | massage | no cms family exists in the massage category (0 of the 24 live cms rows use it) |
| face_massage | Face Massage | massage | no cms family exists in the massage category (0 of the 24 live cms rows use it) |
| foot_leg_massage | Foot & Leg Massage | massage | no cms family exists in the massage category (0 of the 24 live cms rows use it) |
| gycolic_acid_peel | Gycolic Acid Peel | skin | generic peel, no matching branded cms family |
| half_face_with_led_and_mask | Half face With LED and Mask | skin | LED/mask treatment not described by any cms family |
| hydrating | Hydrating | facials | no clear cms family for this name |
| ladies_waxing_bikini | Ladies' Waxing - Bikini | waxing-ladies | no cms family exists in the waxing-ladies category |
| ladies_waxing_body_hot_wax_abdomen | Ladies' Waxing - Body (Hot Wax) Abdomen | waxing-ladies | no cms family exists in the waxing-ladies category |
| ladies_waxing_body_hot_wax_bottom | Ladies' Waxing - Body (Hot Wax) Bottom | waxing-ladies | no cms family exists in the waxing-ladies category |
| ladies_waxing_body_hot_wax_crack | Ladies' Waxing - Body (Hot Wax) Crack | waxing-ladies | no cms family exists in the waxing-ladies category |
| ladies_waxing_body_strip_wax_abdomen | Ladies' Waxing Body (Strip Wax) Abdomen | waxing-ladies | no cms family exists in the waxing-ladies category |
| ladies_waxing_body_strip_wax_bottom | Ladies' Waxing - Body (Strip Wax) Bottom | waxing-ladies | no cms family exists in the waxing-ladies category |
| ladies_waxing_brazilian | Ladies' Waxing - Brazilian | waxing-ladies | no cms family exists in the waxing-ladies category |
| ladies_waxing_face_hot_wax_forehead | Ladies' Waxing Face (Hot Wax) Forehead | waxing-ladies | no cms family exists in the waxing-ladies category |
| ladies_waxing_face_hot_wax_full_chin | Ladies' Waxing Face (Hot Wax) Full Chin | waxing-ladies | no cms family exists in the waxing-ladies category |
| ladies_waxing_face_hot_wax_full_face | Ladies' Waxing Face (Hot Wax) Full Face | waxing-ladies | no cms family exists in the waxing-ladies category |
| ladies_waxing_face_hot_wax_sideburns | Ladies' Waxing Face (Hot Wax) Sideburns | waxing-ladies | no cms family exists in the waxing-ladies category |
| ladies_waxing_face_hot_wax_upper_lip | Ladies' Waxing Face (Hot Wax) Upper Lip | waxing-ladies | no cms family exists in the waxing-ladies category |
| ladies_waxing_full_arm_with_strip_wax | Ladies' Waxing - Full Arm with strip wax | waxing-ladies | no cms family exists in the waxing-ladies category |
| ladies_waxing_full_leg_strip_wax | Ladies' Waxing - Full Leg (Strip Wax) | waxing-ladies | no cms family exists in the waxing-ladies category |
| ladies_waxing_g_string | Ladies' Waxing - G-String | waxing-ladies | no cms family exists in the waxing-ladies category |
| ladies_waxing_half_arm_with_strip_wax | Ladies' Waxing - Half Arm with strip wax | waxing-ladies | no cms family exists in the waxing-ladies category |
| ladies_waxing_hollywood | Ladies' Waxing - Hollywood | waxing-ladies | no cms family exists in the waxing-ladies category |
| ladies_waxing_lower_leg_strip_wax | Ladies' Waxing - Lower Leg (Strip Wax) | waxing-ladies | no cms family exists in the waxing-ladies category |
| ladies_waxing_underarm_hot_wax | Ladies' Waxing - Underarm (Hot Wax) | waxing-ladies | no cms family exists in the waxing-ladies category |
| ladies_waxing_upper_leg_strip_wax | Ladies' Waxing - Upper Leg (Strip Wax) | waxing-ladies | no cms family exists in the waxing-ladies category |
| large_area_outer_thighs_full_stomach | Large Area (Outer thighs/full stomach) | body | generic body-area row, no specific cms family names it |
| men_s_waxing_eyebrow | Men's Waxing Eyebrow | waxing-men | no cms family exists in the waxing-men category |
| men_s_waxing_full_arm | Men's Waxing Full Arm | waxing-men | no cms family exists in the waxing-men category |
| men_s_waxing_full_leg | Men's Waxing Full Leg | waxing-men | no cms family exists in the waxing-men category |
| men_s_waxing_full_leg_1 | Men's Waxing Full Leg | waxing-men | no cms family exists in the waxing-men category |
| men_s_waxing_half_arm | Men's Waxing Half Arm | waxing-men | no cms family exists in the waxing-men category |
| men_s_waxing_half_chest | Men's Waxing Half Chest | waxing-men | no cms family exists in the waxing-men category |
| men_s_waxing_half_leg | Men's Waxing Half Leg | waxing-men | no cms family exists in the waxing-men category |
| men_s_waxing_shoulder | Men's Waxing Shoulder | waxing-men | no cms family exists in the waxing-men category |
| men_s_waxing_stomach | Men's Waxing Stomach | waxing-men | no cms family exists in the waxing-men category |
| pigmentations_qswitch | Pigmentations Qswitch | laser | Q-switch laser has no matching cms family (Pico Laser and IPL are separate families) |
| rejuvenation_full_face | Rejuvenation (Full Face) | skin | no matching branded cms family |
| skinox_pigmentation | Skinox Pigmentation | skin | branded line (Skinox) with no matching cms family |
| skinox_redness | Skinox Redness | skin | branded line (Skinox) with no matching cms family |
| skinox_wrinkles | Skinox Wrinkles | skin | branded line (Skinox) with no matching cms family |
| swedish_massage | Swedish Massage | massage | no cms family exists in the massage category (0 of the 24 live cms rows use it) |
| tension_neck_sculp_massage_intense | Tension neck & sculp massage (intense) | massage | no cms family exists in the massage category (0 of the 24 live cms rows use it) |
| thai_massage | Thai Massage | massage | no cms family exists in the massage category (0 of the 24 live cms rows use it) |
| therapeutic_lymphatic_drainage_massage | Therapeutic Lymphatic Drainage Massage | massage | no cms family exists in the massage category (0 of the 24 live cms rows use it) |
| therapeutic_lymphatic_drainage_massage_1 | Therapeutic Lymphatic Drainage Massage | massage | no cms family exists in the massage category (0 of the 24 live cms rows use it) |
| thermal_peel_rejuvenations | Thermal peel/Rejuvenations | laser | no matching cms family |
| vascular_removal_vein_broken_capillari_1 | Vascular removal(vein /broken capillari) | laser | no matching cms family |
