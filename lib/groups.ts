// Category-to-group map for the site nav (docs/research/00-direction.md section 3.1).
// Deliberately independent of lib/services.ts (no import from it): that file's
// "@/data/services.json" alias import needs a tsconfig path that does not exist yet
// in this repo, and this module should typecheck on its own in the meantime.

/** The real category ids from data/services.json's `categories` list (12 since queue row
 * Q42 added "head-spa", the Japanese Head Spa). */
export type CategoryId =
  | "hifu"
  | "laser"
  | "skin"
  | "skinboosters"
  | "carboxy"
  | "body"
  | "hair"
  | "facials"
  | "massage"
  | "head-spa"
  | "waxing-ladies"
  | "waxing-men";

export type GroupId = "face" | "body" | "laser" | "wellness";

export interface Group {
  id: GroupId;
  label: string;
  categories: CategoryId[];
}

/** 4 groups over the 12 categories, in nav display order. */
export const GROUPS: Group[] = [
  {
    id: "face",
    label: "Face",
    categories: ["hifu", "skin", "skinboosters", "facials", "carboxy"],
  },
  {
    id: "body",
    label: "Body",
    categories: ["body"],
  },
  {
    id: "laser",
    label: "Laser and Hair Removal",
    categories: ["laser", "hair"],
  },
  {
    id: "wellness",
    label: "Wellness",
    categories: ["massage", "head-spa", "waxing-ladies", "waxing-men"],
  },
];

const CATEGORY_TO_GROUP: Record<CategoryId, GroupId> = GROUPS.reduce(
  (acc, group) => {
    for (const categoryId of group.categories) {
      acc[categoryId] = group.id;
    }
    return acc;
  },
  {} as Record<CategoryId, GroupId>,
);

/** Which of the 4 groups a category id belongs to. */
export function groupOf(categoryId: CategoryId): GroupId {
  return CATEGORY_TO_GROUP[categoryId];
}
