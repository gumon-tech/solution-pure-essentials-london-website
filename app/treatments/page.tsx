import type { Metadata } from "next";
import ArchImage from "@/components/ArchImage";
import ReadMoreLink from "@/components/ReadMoreLink";
import CategoryChips from "@/components/CategoryChips";
import PriceList from "@/components/PriceList";
import { buildTreatmentsView } from "@/lib/treatments-view";
import { categoryAnchor } from "@/lib/story-map";

// Description sourced from content/treatments-intro.md (PEL's copy, cut; see
// content/COPY-SOURCES.md) per the Q8 spec's "description from PEL's copy if
// present, otherwise ...". Title kept as the Q8 spec's literal text, which differs
// from that file's frontmatter title ("Treatments in King's Cross | ..." vs the
// spec's "Treatments and prices in King's Cross | ...") -- flagged in the executor
// report rather than silently picking one.
export const metadata: Metadata = {
  title: "Treatments and prices in King's Cross | Pure Essentials London",
  description:
    "Facials, HIFU, laser, body contouring, massage and waxing at 155 King's Cross Road. The price shown is the price you pay.",
  alternates: {
    canonical: "/treatments/",
  },
};

// 1-line group descriptions, verbatim from content/treatments-intro.md (see
// content/COPY-SOURCES.md), keyed by the same 4 group ids as lib/groups.ts.
const GROUP_LINE: Record<string, string> = {
  face: "HIFU, skin boosters, microneedling, peels and facials",
  body: "3D lipo, HIFU body and Emsculpt",
  laser: "Pigmentation, rejuvenation and tattoo removal; laser and IPL hair removal",
  wellness: "Massage and waxing",
};

export default function TreatmentsPage() {
  const groups = buildTreatmentsView();
  const chips = groups.flatMap((group) =>
    group.categories.map((category) => ({ id: categoryAnchor(category.id), title: category.title })),
  );

  return (
    <main className="bg-cream">
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
          <div>
            <h1 className="rise-in font-display text-4xl text-espresso md:text-5xl">
              Treatments and prices
            </h1>
            <p className="rise-in rise-delay-1 mt-4 text-cocoa">
              The price shown is the price you pay. Where a price says &ldquo;from&rdquo;, the
              figure is the lowest option for that treatment and the consultation confirms
              yours.
            </p>
          </div>
          <ArchImage slot="step-2-consultation" priority className="settle-in w-full" />
        </div>
      </section>

      <CategoryChips items={chips} />

      {groups.map((group) => (
        <section
          key={group.id}
          id={group.id}
          // Same offset as the category anchors below: the site header nav (Face,
          // Body, Laser and hair removal, Wellness) links to these ids too.
          className="mx-auto max-w-6xl scroll-mt-[64px] px-4 py-12 md:px-6"
        >
          <h2 className="reveal font-display text-4xl text-espresso md:text-5xl">{group.label}</h2>
          {GROUP_LINE[group.id] ? (
            <p className="reveal mt-2 text-cocoa">{GROUP_LINE[group.id]}</p>
          ) : null}

          <div className="mt-8 space-y-16">
            {group.categories.map((category) => (
              <div
                key={category.id}
                // "cat-" prefix: groups body and laser share their names with categories,
                // and every id on the page must be unique (lib/story-map.ts categoryAnchor).
                id={categoryAnchor(category.id)}
                // Clears the sticky chips nav (measured ~63px); the sticky header (72px)
                // plus 16px of air is already cleared by html's scroll-padding-top in
                // app/globals.css, so a chip's anchor jump lands the heading below both.
                className="scroll-mt-[64px]"
              >
                <h3 className="reveal font-display text-2xl text-espresso">{category.title}</h3>

                {category.readMore.length > 0 ? (
                  <ul className="reveal mt-4 flex flex-wrap gap-3">
                    {category.readMore.map((link) => (
                      <li key={link.href}>
                        <ReadMoreLink href={link.href} variant="pill">
                          {link.label}
                        </ReadMoreLink>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="mt-6 grid gap-8 md:grid-cols-[1fr_1.6fr]">
                  <ArchImage
                    slot={category.image}
                    // Capped on mobile (< 768px wide) so the first price row is
                    // visible without scrolling past the image; desktop (md:)
                    // unchanged (Lead message 2026-09-13, PEL's outside review).
                    className="reveal order-first max-h-[40vh] w-full object-cover md:order-none md:max-h-none"
                  />
                  <PriceList rows={category.rows} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <p className="border-t border-beige pt-8 text-walnut">
          Aesthetic treatments are for adults aged 18 and over. Every treatment starts with a
          consultation; we will not recommend a treatment that is not right for you.
        </p>
      </section>
    </main>
  );
}
