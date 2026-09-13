import Link from "next/link";
import Picture from "@/components/Picture";
import { fromPrices } from "@/lib/fromPrices";
import type { ImageSlot } from "@/lib/images";
import type { GroupId } from "@/lib/groups";

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

export default function Groups() {
  const prices = fromPrices();

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-16 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
        {CARDS.map((card) => {
          const from = prices[card.id];
          return (
            <Link
              key={card.id}
              href={`/treatments/#${card.id}`}
              className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream rounded-arch"
            >
              <Picture
                slot={card.slot}
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                className="rounded-arch w-full object-cover transition-transform group-hover:scale-[1.02]"
              />
              <h2 className="mt-5 font-display text-2xl text-espresso">{card.title}</h2>
              <p className="mt-2 text-cocoa">{card.line}</p>
              {from !== null ? (
                <p className="mt-2 font-body text-sm uppercase tracking-[0.12em] text-walnut">
                  From £{from}
                </p>
              ) : null}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
