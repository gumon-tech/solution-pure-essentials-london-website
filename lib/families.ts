// Which live cms row (a "family": a treatment page with no price of its own, source
// starting "cms/") is the storytelling page for which live priced booking rows.
//
// Hand-written from reading data/services.json 2026-09-13 (176 rows, 24 live cms rows,
// 91 live priced booking rows) — not fuzzy matching at runtime, per the brief. Every
// family below is one of the 24 live cms rows (proven in
// docs/plans/Q4-family-map-report.md); every priced slug is a live booking row mapped
// to at most 1 family (same report). A booking row with no clear family is left out of
// every `priced` list on purpose rather than guessed into one.
//
// Known merges from PEL (2026-09-13): 3D LIPO, COLLAGEN and EMSCULPT cms rows are the
// same treatment as the booking rows "3D Lipo", "Collagen" and "Emsculpt". There are 2
// live EMSCULPT cms rows (aesthetics_1_emsculpt and aesthetics_body_emsculpt); PEL's
// note says both. The single "Emsculpt" booking row can only belong to 1 family
// (acceptance rule: never 2), so it is mapped to aesthetics_body_emsculpt (the
// aesthetics-body cluster, where the rest of that page's family already lives:
// aesthetics_body_3d_lipo, aesthetics_body_hifu_body). aesthetics_1_emsculpt is still
// listed below as a family, with an empty priced list, so both merged rows show up in
// the report and neither is silently dropped.
import type { CategoryId } from "./groups";

export interface Family {
  /** The cms row's own slug in data/services.json. */
  slug: string;
  title: string;
  category: CategoryId;
  /** Live booking-row slugs this family's page should list a price for. */
  priced: string[];
}

export const FAMILIES: Family[] = [
  {
    slug: "aesthetics_1_cryopen",
    title: "Cryopen",
    category: "laser",
    priced: [],
  },
  {
    slug: "aesthetics_1_emsculpt",
    title: "Emsculpt",
    category: "body",
    // Duplicate cms page for the same treatment as aesthetics_body_emsculpt (PEL merge
    // note). The 1 live "Emsculpt" booking row is mapped there instead, so this family
    // is listed with no priced rows rather than mapped twice.
    priced: [],
  },
  {
    slug: "aesthetics_1_etherea_mx",
    title: "Etherea MX",
    category: "laser",
    priced: [],
  },
  {
    slug: "aesthetics_1_golden_micro_needling",
    title: "Golden Micro Needling",
    category: "skin",
    priced: [],
  },
  {
    slug: "aesthetics_1_hifu",
    title: "HIFU",
    category: "hifu",
    priced: [
      "full_face",
      "full_face_1",
      "full_face_chin_neck",
      "full_face_neck",
      "half_face",
      "neck",
    ],
  },
  {
    slug: "aesthetics_1_hydro_facial",
    title: "Hydro Facial",
    category: "facials",
    priced: ["hydrofacial"],
  },
  {
    slug: "aesthetics_1_ipl_intense_pulsed_light",
    title: "IPL (Intense Pulsed Light)",
    category: "laser",
    priced: ["pigmentations_ipl", "rejuvenation_ipl"],
  },
  {
    slug: "aesthetics_1_microneedling",
    title: "Microneedling",
    category: "skin",
    priced: ["microneedling_face", "microneedling_face_neck"],
  },
  {
    slug: "aesthetics_1_pico_laser",
    title: "Pico Laser",
    category: "laser",
    priced: ["pigmentations_picosure", "rejuvenation_picosure"],
  },
  {
    slug: "aesthetics_1_skymedic_chemical_peels",
    title: "Skymedic Chemical Peels",
    category: "skin",
    priced: [],
  },
  {
    slug: "aesthetics_body_3d_lipo",
    title: "3D Lipo",
    category: "body",
    priced: ["3d_lipo"],
  },
  {
    slug: "aesthetics_body_carboxytherapy",
    title: "Carboxytherapy",
    category: "carboxy",
    priced: [], // both rows moved to review by PEL 2026-09-13 (lead repo bf55134)
  },
  {
    slug: "aesthetics_body_emsculpt",
    title: "Emsculpt",
    category: "body",
    priced: ["emsculpt"],
  },
  {
    slug: "aesthetics_body_hifu_body",
    title: "HIFU Body",
    category: "body",
    priced: [
      "hifu_med_area_flappy_arms_lovehandle",
      "hifu_small_area_knees_armpit_bust_lift",
    ],
  },
  {
    slug: "aesthetics_body_indiba_deep_beauty",
    title: "Indiba Deep Beauty",
    category: "skin",
    priced: ["radio_frequency_indiba", "radio_frequency_indiba_full_back_leg"],
  },
  {
    slug: "aesthetics_body_laser_hair_removal_2F_ipl",
    title: "Laser Hair Removal / IPL",
    category: "hair",
    priced: [
      "ipl_extra_large_area",
      "ipl_large_area",
      "ipl_medium_area",
      "ipl_small_area",
      "laser_hair_removal_extra_large_area",
      "laser_hair_removal_large_area",
      "laser_hair_removal_medium_area",
    ],
  },
  {
    slug: "aesthetics_body_profhilo_body",
    title: "Profhilo Body",
    category: "skinboosters",
    priced: [],
  },
  {
    slug: "aesthetics_body_tattoo_removal",
    title: "Tattoo Removal",
    category: "laser",
    priced: [
      "medium_area_tattoo_removal_3_8cm",
      "men_s_tattoo_large_area_8_15cm",
      "tattoo_large_area_8_15cm",
      "tattoo_removal_1_session",
    ],
  },
  {
    slug: "facials_1_age_defence_sensitive_skin_treatment",
    title: "Age Defence Sensitive Skin Treatment",
    category: "facials",
    priced: [],
  },
  {
    slug: "facials_1_diamondtome_microdermabrasion",
    title: "Diamondtome Microdermabrasion",
    category: "facials",
    priced: [],
  },
  {
    slug: "facials_1_eberlin_facial",
    title: "Eberlin Facial",
    category: "facials",
    priced: [],
  },
  {
    slug: "injections_profhilo_skin_booster",
    title: "Profhilo Skin Booster",
    category: "skinboosters",
    priced: ["profhilo", "profhilo_2_sessions"],
  },
  {
    slug: "injections_restylane_skin_boosters",
    title: "Restylane Skin Boosters",
    category: "skinboosters",
    priced: ["cheeks_jaw_line_nasolabial_1ml", "facial_fillers", "lip_0_55ml"],
  },
];
