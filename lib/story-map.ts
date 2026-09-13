// The one category-to-story map for the site (queue row Q36, owner decision 2026-09-13:
// stories are separate from the price list). Pure data, no fs: safe to import from client
// components (the header) as well as from build-time modules.
//
// Every read about / see prices link on the site is derived from this file:
//  - /treatments/ shows "Read about <topic>" under each category that has a story;
//  - each story shows "See <topic> prices" going to /treatments/#cat-<first category>;
//  - the header menus and home cards list the stories of each group in GROUPS order.
// Categories with no story (laser: skin laser; carboxy) are left out on purpose.
import { GROUPS, type CategoryId, type GroupId } from "./groups";

export const CATEGORY_STORY: Partial<Record<CategoryId, string>> = {
  hifu: "hifu-kings-cross",
  skin: "microneedling-peels-kings-cross",
  skinboosters: "skin-boosters-kings-cross",
  facials: "facials-kings-cross",
  body: "body-contouring-kings-cross",
  hair: "laser-hair-removal-kings-cross",
  massage: "massage-kings-cross",
  "waxing-ladies": "waxing-kings-cross",
  "waxing-men": "waxing-kings-cross",
};

/** "<Group> prices" label for each group's price anchor. */
export const GROUP_PRICES_LABEL: Record<GroupId, string> = {
  face: "Face prices",
  body: "Body prices",
  laser: "Laser prices",
  wellness: "Wellness prices",
};

/** Extra links in a group's header menu, between its stories and its prices link. The
 * label is the data category title (data/services.json category "laser"): PEL brief
 * section 34 condition 5 did not approve "Skin laser treatments", because CryoPen is a
 * cold treatment, not a laser. */
export const GROUP_EXTRA_LINKS: Partial<Record<GroupId, { label: string; href: string }[]>> = {
  laser: [{ label: "Laser and IPL skin treatments", href: `/treatments/#${categoryAnchor("laser")}` }],
};

/** The element id of a category block on /treatments/ (and its chip link). Prefixed so it
 * never equals a group section id: groups "body" and "laser" share names with categories.
 * Group anchors (#face, #body, #laser, #wellness) stay on the group sections. */
export function categoryAnchor(category: CategoryId): string {
  return `cat-${category}`;
}

export interface NavMenuItem {
  label: string;
  href: string;
  /** "story" for a story page, "link" for any other in-site link (prices, anchors). */
  kind: "story" | "link";
}

export interface NavMenu {
  id: GroupId;
  label: string;
  items: NavMenuItem[];
}

export function storyHref(slug: string): string {
  return `/${slug}/`;
}

export function storyForCategory(category: CategoryId): string | null {
  return CATEGORY_STORY[category] ?? null;
}

/** The first category (in GROUPS order) whose story is `slug`: the price anchor for that
 * story. null for a story with no category (the 3 set-3 pages). */
export function priceCategoryForStory(slug: string): CategoryId | null {
  for (const group of GROUPS) {
    for (const category of group.categories) {
      if (CATEGORY_STORY[category] === slug) return category;
    }
  }
  return null;
}

/** Story slugs of a group, in GROUPS category order, each once. */
export function storiesOfGroup(groupId: GroupId): string[] {
  const group = GROUPS.find((g) => g.id === groupId);
  if (!group) return [];
  const out: string[] = [];
  for (const category of group.categories) {
    const slug = CATEGORY_STORY[category];
    if (slug && !out.includes(slug)) out.push(slug);
  }
  return out;
}

/** A short story title for use inside a sentence: "Microneedling and peels" becomes
 * "microneedling and peels", while a first word in capitals ("HIFU") is kept. */
export function topicInSentence(shortTitle: string): string {
  const firstWord = shortTitle.split(" ")[0] ?? "";
  if (firstWord.length > 1 && firstWord === firstWord.toUpperCase()) return shortTitle;
  return shortTitle.slice(0, 1).toLowerCase() + shortTitle.slice(1);
}
