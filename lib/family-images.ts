// One PEL-approved image slot per family (queue row Q33), keyed by the family's slug in
// lib/families.ts. Slot names are neutral: no brand or medicine name.
//
// Used by components/FamilyPage.tsx (hero and "You may also like" card of the 5 kept
// family pages) and by components/StoryPage.tsx (queue row Q36, PEL brief section 38): a
// retired family's slot shows beside its h3 in "Treatments in this group" unless a story
// file already places that slot as an [image: ...] block. scripts/check-story-pages.mjs
// reads this file as text to expect those extra pictures, so keep one `slug: "slot"` pair
// per line.
import type { ImageSlot } from "@/lib/images";

export const FAMILY_IMAGE_SLOT: Partial<Record<string, ImageSlot>> = {
  aesthetics_1_hifu: "fam-hifu-face",
  aesthetics_1_cryopen: "fam-cryotherapy",
  aesthetics_1_etherea_mx: "fam-light-platform",
  aesthetics_1_ipl_intense_pulsed_light: "fam-ipl",
  aesthetics_1_pico_laser: "fam-pico-laser",
  aesthetics_body_tattoo_removal: "fam-tattoo-removal",
  aesthetics_1_golden_micro_needling: "fam-gold-microneedling",
  aesthetics_1_microneedling: "fam-microneedling",
  aesthetics_1_skymedic_chemical_peels: "fam-chemical-peel",
  aesthetics_body_indiba_deep_beauty: "fam-radiofrequency",
  aesthetics_body_profhilo_body: "fam-skin-booster-body",
  injections_profhilo_skin_booster: "fam-skin-booster-face",
  injections_restylane_skin_boosters: "fam-skin-booster-hydration",
  aesthetics_body_3d_lipo: "fam-fat-reduction",
  aesthetics_body_emsculpt: "fam-muscle-toning",
  aesthetics_body_hifu_body: "fam-hifu-body",
  aesthetics_body_laser_hair_removal_2F_ipl: "fam-laser-hair",
  aesthetics_1_hydro_facial: "fam-hydrating-facial",
  facials_1_age_defence_sensitive_skin_treatment: "fam-sensitive-skin-facial",
  facials_1_diamondtome_microdermabrasion: "fam-microdermabrasion",
  facials_1_eberlin_facial: "fam-botanical-facial",
};
