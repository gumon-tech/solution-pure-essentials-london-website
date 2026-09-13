import Link from "next/link";
import Picture from "@/components/Picture";
import ReadMoreLink from "@/components/ReadMoreLink";
import { fromPrices } from "@/lib/fromPrices";
import type { ImageSlot } from "@/lib/images";
import type { GroupId } from "@/lib/groups";
import { getStoryPage, storyShortTitle } from "@/lib/stories";
import { storiesOfGroup, storyHref } from "@/lib/story-map";

// Titles, 1-line descriptions and image slots verbatim from content/home.md's
// "## groups" section, in the same order and with the same group ids as
// lib/groups.ts (GROUPS) so the /treatments/#<id> anchors line up.
const CARDS: { id: GroupId; title: string; line: string; slot: ImageSlot }[] = [
  {
    id: "face",
    title: "Face",
    line: "HIFU, skin boosters, microneedling, peels and facials",
    slot: "face-card",
  },
  {
    id: "body",
    title: "Body",
    line: "3D lipo, HIFU body and Emsculpt",
    slot: "body-card",
  },
  {
    id: "laser",
    title: "Laser and hair removal",
    line: "Pigmentation, rejuvenation and tattoo removal; laser and IPL hair removal",
    slot: "laser-card",
  },
  {
    id: "wellness",
    title: "Wellness",
    line: "Massage and waxing",
    slot: "wellness-card",
  },
];

/** Queue row Q36: each card's image and title go to the group's prices anchor, for every
 * group alike, because the card line names the whole group (Face lists 5 kinds of
 * treatment, only 1 of which is HIFU) and 3 of the 4 groups have more than 1 story or a
 * part with no story (Laser: skin laser). The stories are listed under the text as their
 * own visible links, so each one is 1 tap away. */
export default function Groups() {
  const prices = fromPrices();

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-16 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
        {CARDS.map((card) => {
          const from = prices[card.id];
          const stories = storiesOfGroup(card.id).map((slug) => {
            const page = getStoryPage(slug);
            if (!page) throw new Error(`components/home/Groups.tsx: story "${slug}" is not built`);
            return { href: storyHref(slug), label: storyShortTitle(page.frontMatter) };
          });
          return (
            <div key={card.id} className="reveal">
              <Link
                href={`/treatments/#${card.id}`}
                className="group block rounded-arch focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
              >
                <Picture
                  slot={card.slot}
                  sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="rounded-arch w-full object-cover"
                />
                <h2 className="mt-5 font-display text-2xl text-espresso group-hover:text-oak">{card.title}</h2>
              </Link>
              <p className="mt-2 text-cocoa">{card.line}</p>
              {from !== null ? (
                <p className="mt-2 font-body text-sm uppercase tracking-[0.12em] text-walnut">
                  From £{from}
                </p>
              ) : null}
              <ul className="mt-4 flex flex-col items-start gap-2">
                {stories.map((story) => (
                  <li key={story.href}>
                    <ReadMoreLink href={story.href}>{story.label}</ReadMoreLink>
                  </li>
                ))}
                <li>
                  <ReadMoreLink href={`/treatments/#${card.id}`}>See prices</ReadMoreLink>
                </li>
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
