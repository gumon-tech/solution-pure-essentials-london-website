// View model for /treatments/: groups every live service (data/services.json via
// lib/services.ts) into the 4 groups (lib/groups.ts) and their 11 categories, in
// display-ready rows, with the cms+booking merge rule from queue row Q8.
//
// Merge rule (Q8, extended by the Lead's message of 2026-09-13): a live row whose
// source starts with "cms/" is dropped from rendering when a live "booking" row in the
// SAME category has the same name after lowercasing and removing all whitespace — the
// booking row (with its own price and duration) is what renders. This covers 3D Lipo,
// Collagen, Emsculpt (original 4 names normalization) and now also HYDRO FACIAL /
// Hydrofacial (equal only once internal spaces are removed, not just trimmed). This is
// mechanical: every matching cms row is dropped, however many there are for one
// booking row.
//
// Known discrepancy (reported to the Lead, not decided here): docs/research/
// 00-direction.md section 5.1 (PEL, 2026-09-13) describes each duplicate name as "one
// row is the cms page ... and the other the bookable row" — one cms row per booking
// row. The live data has 2 live cms rows named EMSCULPT in category "body"
// (aesthetics_1_emsculpt and aesthetics_body_emsculpt) matching the single live
// "Emsculpt" booking row. Applying the rule above drops both, so with the 4 matched
// names above (3D Lipo, Collagen, Emsculpt, Hydro Facial) this module drops 5 cms rows,
// not 4 — rendered rows is 110, not the 111 that "4 pairs, 1 dropped row each" would
// give. lib/families.ts resolves the Emsculpt case by mapping only
// aesthetics_body_emsculpt to the booking row and leaving aesthetics_1_emsculpt as a
// distinct family with an empty priced list; this module does not consult
// lib/families.ts (Q8's rule is name+category equality only, and families.ts is
// marked read-only / not for this page), so it cannot reproduce that per-row choice
// without inventing a tiebreak.
import { liveServices, waLink, type Service } from "./services";
import { GROUPS, type CategoryId, type GroupId } from "./groups";
import { IMAGES } from "./images";
import { FAMILIES } from "./families";

import servicesFile from "@/data/services.json";

export interface TreatmentRow {
  slug: string;
  name: string;
  priceGbp: number | null;
  priceFrom: boolean;
  duration: string | null;
  waHref: string;
  waAriaLabel: string;
}

export interface CategoryBlock {
  id: CategoryId;
  title: string;
  image: keyof typeof IMAGES;
  rows: TreatmentRow[];
}

export interface GroupSection {
  id: GroupId;
  label: string;
  categories: CategoryBlock[];
}

/** 1 people image per category (docs/design/imagery-guideline.md section 10). Typed
 * against IMAGES so a missing slot fails the build. */
export const CATEGORY_IMAGE: Record<CategoryId, keyof typeof IMAGES> = {
  hifu: "story-hifu",
  laser: "cat-laser-skin",
  skin: "cat-skin",
  skinboosters: "cat-skinboosters",
  carboxy: "cat-carboxy",
  body: "body-card",
  hair: "story-laser-hair",
  facials: "face-card",
  massage: "wellness-card",
  "waxing-ladies": "cat-waxing-ladies",
  "waxing-men": "cat-waxing-men",
};

const CATEGORY_TITLES: Record<string, string> = Object.fromEntries(
  (servicesFile as { categories: { id: string; title: string }[] }).categories.map((c) => [
    c.id,
    c.title,
  ]),
);

/** The name to show for a row: display_name when present, otherwise name — used for
 * on-page text, the WhatsApp prefilled message, and the aria-label alike. lib/services.ts
 * carries `display_name` as an optional field on Service (added by the Lead 2026-09-13,
 * currently set on the 2 HIFU rows renamed for display). */
function displayNameOf(s: Service): string {
  return s.display_name ?? s.name;
}

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "");
}

function isCmsSource(source: string): boolean {
  return source.startsWith("cms/");
}

function isBookingSource(source: string): boolean {
  return source === "booking";
}

/** cms slugs (lib/families.ts) whose family already has at least 1 priced booking
 * row — that family's page carries the price, so the cms row itself drops to avoid
 * showing "Ask for a quote" next to a price for the same treatment (Q8 pt 2
 * addition, Lead message 2026-09-13). */
const FAMILY_PRICED_SLUGS = new Set(
  FAMILIES.filter((f) => f.priced.length > 0).map((f) => f.slug),
);

function toRow(s: Service): TreatmentRow {
  const name = displayNameOf(s);
  return {
    slug: s.slug,
    name,
    priceGbp: s.price_gbp,
    priceFrom: s.price_from,
    duration: s.duration,
    waHref: waLink(name, s.slug),
    waAriaLabel: `Ask about ${name} on WhatsApp`,
  };
}

/** Builds the 4 group sections, in lib/groups.ts order, each with its categories in
 * order, each with its live rows (merged, sorted). Held and review rows never reach
 * this output because liveServices() already excludes them. */
export function buildTreatmentsView(): GroupSection[] {
  const live = liveServices();

  const byCategory = new Map<string, Service[]>();
  for (const s of live) {
    const list = byCategory.get(s.category) ?? [];
    list.push(s);
    byCategory.set(s.category, list);
  }

  return GROUPS.map((group) => ({
    id: group.id,
    label: group.label,
    categories: group.categories.map((categoryId) => {
      const rows = byCategory.get(categoryId) ?? [];

      const bookingNames = new Set(
        rows.filter((r) => isBookingSource(r.source)).map((r) => normalizeName(r.name)),
      );
      const kept = rows.filter(
        (r) =>
          !(
            isCmsSource(r.source) &&
            (bookingNames.has(normalizeName(r.name)) || FAMILY_PRICED_SLUGS.has(r.slug))
          ),
      );

      const priced = kept
        .filter((r) => r.price_gbp !== null)
        .sort((a, b) => (a.price_gbp as number) - (b.price_gbp as number));
      const quote = kept
        .filter((r) => r.price_gbp === null)
        .sort((a, b) => displayNameOf(a).localeCompare(displayNameOf(b)));

      return {
        id: categoryId,
        title: CATEGORY_TITLES[categoryId] ?? categoryId,
        image: CATEGORY_IMAGE[categoryId],
        rows: [...priced, ...quote].map(toRow),
      };
    }),
  }));
}
