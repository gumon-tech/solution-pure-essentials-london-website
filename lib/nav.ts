// Build-time header menus (queue row Q36): each group lists its stories (lib/story-map.ts,
// in GROUPS order, named by the story's short title), any extra link, then its prices
// anchor. Computed on the server in app/layout.tsx and passed to the client Header.
import { GROUPS } from "./groups";
import { getStoryPage, storyShortTitle } from "./stories";
import {
  GROUP_EXTRA_LINKS,
  GROUP_PRICES_LABEL,
  storiesOfGroup,
  storyHref,
  type NavMenu,
  type NavMenuItem,
} from "./story-map";

export function getNavMenus(): NavMenu[] {
  return GROUPS.map((group) => {
    const items: NavMenuItem[] = storiesOfGroup(group.id).map((slug) => {
      const page = getStoryPage(slug);
      if (!page) throw new Error(`lib/nav.ts: story "${slug}" is not built`);
      return { label: storyShortTitle(page.frontMatter), href: storyHref(slug), kind: "story" };
    });
    for (const extra of GROUP_EXTRA_LINKS[group.id] ?? []) {
      items.push({ ...extra, kind: "link" });
    }
    items.push({ label: GROUP_PRICES_LABEL[group.id], href: `/treatments/#${group.id}`, kind: "link" });
    return { id: group.id, label: group.label, items };
  });
}
