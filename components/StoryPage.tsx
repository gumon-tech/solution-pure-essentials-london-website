import Link from "next/link";
import { Fragment } from "react";
import ArchImage from "@/components/ArchImage";
import Picture from "@/components/Picture";
import { PRICE_BUTTON_CLASS, PRICE_ROW_CLASS } from "@/components/PriceList";
import ReadMoreLink from "@/components/ReadMoreLink";
import { getStoryFamilies } from "@/lib/family-pages";
import { FAMILY_IMAGE_SLOT } from "@/lib/family-images";
import { getStoryPages, storyShortTitle } from "@/lib/stories";
import { SECTION_EYEBROWS, layoutStorySections, type LayoutGroup, type StoryPair, textLength, COMPACT_TEXT_LIMIT } from "@/lib/story-layout";
import { familyServiceJsonLd } from "@/lib/structured-data";
import type { ImageSlot } from "@/lib/images";
import type { StoryBlock, StoryButton, StoryPage as StoryPageData, StoryPriceRow } from "@/lib/stories";

// Renderer for the 11 storytelling pages (queue rows Q25/Q26/Q27, layout Q41). The
// markdown grammar is unchanged; lib/story-layout.ts picks each section's pattern from its
// content (split, feature card, card row, photo band, text, price card), so every story is
// laid out the same way without per-file special cases. The hero and faq sections are
// rendered on their own.
//
// Every image keeps its own file (lib/images.ts srcset); where a frame's ratio differs
// from the file's, the image is shown with object-fit: cover. No text is ever clamped,
// collapsed or shortened: every block lands in the page in file order.

/** Every image slot placed by an [image: ...] block in any story file. */
function storySlotsInFiles(): Set<ImageSlot> {
  const slots = new Set<ImageSlot>();
  for (const story of getStoryPages()) {
    for (const section of story.sections) {
      for (const block of section.blocks) {
        if (block.kind === "image") slots.add(block.slot);
      }
    }
  }
  return slots;
}

const EYEBROW_CLASS = "font-body text-xs uppercase tracking-[0.28em] text-oak";

function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`${EYEBROW_CLASS} ${className}`.trim()}>{children}</p>;
}

function Paragraph({ text }: { text: string }) {
  return <p className="text-cocoa">{text}</p>;
}

function NumberedList({ items }: { items: { lead: string; rest: string }[] }) {
  return (
    <ol className="list-inside list-decimal space-y-3 text-cocoa">
      {items.map((item, i) => (
        <li key={i}>
          <strong className="text-espresso">{item.lead}</strong>
          {item.rest ? ` ${item.rest}` : ""}
        </li>
      ))}
    </ol>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-inside list-disc space-y-2 text-cocoa">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

const buttonBase =
  "pill inline-flex min-h-[44px] items-center justify-center rounded-full px-6 py-3 font-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

function Buttons({
  primary,
  secondary,
  hidePrimaryOnMobile = false,
}: {
  primary: StoryButton;
  secondary: StoryButton;
  hidePrimaryOnMobile?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-4">
      <a
        href={primary.href}
        target="_blank"
        rel="noopener"
        className={`${buttonBase} bg-oak text-white hover:opacity-90${hidePrimaryOnMobile ? " max-md:hidden" : ""}`}
      >
        {primary.label}
      </a>
      {secondary.external ? (
        <a
          href={secondary.href}
          target="_blank"
          rel="noopener"
          className={`${buttonBase} border border-espresso text-espresso hover:bg-espresso hover:text-cream`}
        >
          {secondary.label}
        </a>
      ) : (
        <Link
          href={secondary.href}
          className={`${buttonBase} border border-espresso text-espresso hover:bg-espresso hover:text-cream`}
        >
          {secondary.label}
        </Link>
      )}
    </div>
  );
}

/** A plain 2+-column info table (set 3, e.g. "Day | Hours" -- see content/contact.md
 * for the same shape): every cell verbatim, tabular-nums, border-beige hairlines. No
 * WhatsApp links, no £ conversion -- unlike PriceTable this is not a price list.
 * Mirrors the established hours-table pattern (components/contact/InfoPanel.tsx,
 * components/home/Clinic.tsx): first column as a row header, no rendered header row. */
function InfoTable({ rows }: { rows: string[][] }) {
  return (
    <table className="w-full max-w-xl text-cocoa">
      <tbody className="divide-y divide-beige">
        {rows.map((row, i) => (
          <tr key={i}>
            <th scope="row" className="py-3 pr-4 text-left font-normal text-espresso">
              {row[0]}
            </th>
            {row.slice(1).map((cell, j) => (
              <td key={j} className="tabular-nums py-3">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** A story's price table, in a contained card (queue row Q41), with the same row layout
 * as components/PriceList.tsx. */
function PriceTable({ rows, onBand }: { rows: StoryPriceRow[]; onBand: boolean }) {
  return (
    <div
      data-layout="prices"
      className={`reveal rounded-2xl border border-beige px-5 md:px-8 ${onBand ? "bg-cream" : "bg-linen"}`}
    >
      <ul className="divide-y divide-beige">
        {rows.map((row) => (
          <li key={row.slug} className={PRICE_ROW_CLASS}>
            <div className="min-w-0">
              <p className="text-espresso">{row.name}</p>
              <p className="text-sm text-walnut">{row.duration}</p>
            </div>
            <span className="tabular whitespace-nowrap text-right text-espresso">{row.price}</span>
            <a href={row.waHref} target="_blank" rel="noopener" className={PRICE_BUTTON_CLASS}>
              Ask on WhatsApp
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="reveal">
      <h3 className="font-display text-xl text-espresso">{question}</h3>
      <p className="mt-2 text-cocoa">{answer}</p>
    </div>
  );
}

function renderBlock(block: StoryBlock, key: number, opts: { hidePrimaryOnMobile?: boolean } = {}) {
  switch (block.kind) {
    case "paragraph":
      return <Paragraph key={key} text={block.text} />;
    case "numbered-list":
      return <NumberedList key={key} items={block.items} />;
    case "bullet-list":
      return <BulletList key={key} items={block.items} />;
    case "buttons":
      return (
        <Buttons
          key={key}
          primary={block.primary}
          secondary={block.secondary}
          hidePrimaryOnMobile={opts.hidePrimaryOnMobile}
        />
      );
    case "table":
      return <PriceTable key={key} rows={block.rows} onBand={false} />;
    case "info-table":
      return <InfoTable key={key} rows={block.rows} />;
    case "faq-item":
      return <FaqItem key={key} question={block.question} answer={block.answer} />;
    case "image":
      return null;
  }
}

function PairText({ pair, eyebrow }: { pair: StoryPair; eyebrow: string | null }) {
  return (
    <>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      {pair.blocks.map((b, j) => renderBlock(b, j))}
    </>
  );
}

/** Pattern a: image at 5 of 12 columns beside long text at 7, top-aligned. The image frame
 * follows the text's height between 230 and 520 px on lg, so it never towers over it. */
function Split({ pair, reverse, eyebrow }: { pair: StoryPair; reverse: boolean; eyebrow: string | null }) {
  return (
    <div data-layout="split" className="reveal grid gap-8 lg:grid-cols-12 lg:gap-12">
      <div
        data-media
        className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl lg:col-span-5 lg:aspect-auto lg:max-h-[520px] lg:min-h-[230px] ${reverse ? "lg:order-2" : ""}`}
      >
        <Picture
          slot={pair.slot}
          sizes="(min-width: 1024px) 440px, 100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div
        data-text
        className={`max-w-[65ch] space-y-4 lg:col-span-7 lg:self-start lg:text-lg ${reverse ? "lg:order-1" : ""}`}
      >
        <PairText pair={pair} eyebrow={eyebrow} />
      </div>
    </div>
  );
}

/** Pattern b: a short text beside a smaller image, as 1 horizontal card. */
function Feature({ pair, eyebrow, onBand }: { pair: StoryPair; eyebrow: string | null; onBand: boolean }) {
  // Very short text gets a lower image and larger type, so the card is not mostly empty.
  const compact = textLength(pair.blocks) < COMPACT_TEXT_LIMIT;
  return (
    <div data-layout="feature" className="reveal grid overflow-hidden rounded-2xl lg:grid-cols-12">
      <div
        data-media
        className={`relative w-full lg:col-span-4 lg:aspect-auto ${compact ? "aspect-[16/10] lg:min-h-[200px]" : "aspect-[4/3] lg:min-h-[260px]"}`}
      >
        <Picture
          slot={pair.slot}
          sizes="(min-width: 1024px) 360px, 100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div
        data-text
        className={`flex flex-col justify-center gap-4 p-6 md:p-10 lg:col-span-8 lg:px-12 ${onBand ? "bg-cream" : "bg-linen"}`}
      >
        <div className={`max-w-[65ch] space-y-4 ${compact ? "lg:text-xl" : ""}`}>
          <PairText pair={pair} eyebrow={eyebrow} />
        </div>
      </div>
    </div>
  );
}

/** Banner: an image followed only by a short heading-like line. A wide, low photo with the
 * line below it in display type; the wording is unchanged. */
function Banner({ pair, eyebrow }: { pair: StoryPair; eyebrow: string | null }) {
  const line = pair.blocks[0];
  return (
    <div data-layout="banner" className="reveal">
      <div data-media className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl md:aspect-[21/8]">
        <Picture
          slot={pair.slot}
          sizes="(min-width: 1024px) 1104px, 100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div data-text className="mt-5">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        {line && line.kind === "paragraph" ? (
          <p className="font-display text-2xl text-espresso md:text-3xl">{line.text}</p>
        ) : (
          pair.blocks.map((b, j) => renderBlock(b, j))
        )}
      </div>
    </div>
  );
}

/** Pattern b, 2 to 4 short pairs in a row: equal cards, image on top, text below. */
function Cards({ pairs, onBand }: { pairs: StoryPair[]; onBand: boolean }) {
  const cols = pairs.length === 4 ? "md:grid-cols-2 lg:grid-cols-4" : pairs.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2";
  const ratio = pairs.length === 2 ? "aspect-[3/2]" : "aspect-[4/3]";
  const sizes =
    pairs.length === 2 ? "(min-width: 768px) 560px, 100vw" : "(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw";
  return (
    <div data-layout="cards" className={`grid gap-6 ${cols}`}>
      {pairs.map((pair, i) => (
        <div
          key={i}
          className={`reveal flex flex-col overflow-hidden rounded-2xl ${onBand ? "bg-cream" : "bg-linen"}`}
        >
          <div className={`relative w-full ${ratio}`}>
            <Picture slot={pair.slot} sizes={sizes} className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div className="space-y-4 p-6 md:p-8">
            <PairText pair={pair} eyebrow={null} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Pattern c: images with no text between them, as an equal band (Taitam-D RoomBand). Only
 * the slots the section's markdown lists, never a filler. */
function Band({ slots }: { slots: ImageSlot[] }) {
  const cols =
    slots.length >= 4 ? "grid-cols-2 lg:grid-cols-4" : slots.length === 3 ? "grid-cols-1 sm:grid-cols-3" : slots.length === 2 ? "grid-cols-2" : "grid-cols-1";
  const ratio = slots.length === 2 ? "aspect-[4/5] lg:aspect-square" : "aspect-[4/5]";
  const width = slots.length === 1 ? "max-w-md" : "";
  return (
    <div data-layout="band" className={`reveal grid gap-4 ${cols} ${width}`}>
      {slots.map((slot) => (
        <div key={slot} className={`relative w-full overflow-hidden rounded-2xl ${ratio}`}>
          <Picture
            slot={slot}
            sizes="(min-width: 1024px) 380px, 50vw"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}

function renderGroup(
  group: LayoutGroup,
  key: number,
  ctx: { eyebrow: string | null; onBand: boolean },
): React.ReactNode {
  switch (group.type) {
    case "text":
      return (
        <div key={key} data-layout="text" className="reveal max-w-[65ch] space-y-4">
          {group.blocks.map((b, j) => renderBlock(b, j))}
        </div>
      );
    case "prices":
      return <PriceTable key={key} rows={group.rows} onBand={ctx.onBand} />;
    case "info":
      return (
        <div key={key} data-layout="info" className="reveal">
          <InfoTable rows={group.rows} />
        </div>
      );
    case "split":
      return <Split key={key} pair={group.pair} reverse={group.reverse} eyebrow={ctx.eyebrow} />;
    case "feature":
      return <Feature key={key} pair={group.pair} eyebrow={ctx.eyebrow} onBand={ctx.onBand} />;
    case "cards":
      return <Cards key={key} pairs={group.pairs} onBand={ctx.onBand} />;
    case "band":
      return <Band key={key} slots={group.slots} />;
    case "banner":
      return <Banner key={key} pair={group.pair} eyebrow={ctx.eyebrow} />;
  }
}

/** Sections shown on a subtle sand band, for rhythm. */
const BAND_SECTIONS = new Set(["prices", "call-to-action"]);

const CONTAINER = "mx-auto max-w-6xl px-4 py-10 md:px-6 lg:py-16";

export default function StoryPage({ page }: { page: StoryPageData }) {
  const heroSection = page.sections.find((s) => s.id === "hero");
  // faq is required for the 8 strict-grammar pages but optional for set 3 (executor
  // brief, queue row Q27) -- all 3 set-3 files happen to include one today, but the
  // grammar allows a future one not to.
  const faqSection = page.sections.find((s) => s.id === "faq");
  if (!heroSection) {
    throw new Error(`${page.slug}: missing hero section`);
  }
  const otherSections = layoutStorySections(page.sections.filter((s) => s.id !== "hero" && s.id !== "faq"));

  const heroImageBlock = heroSection.blocks[0];
  if (!heroImageBlock || heroImageBlock.kind !== "image") {
    throw new Error(`${page.slug}: hero section must start with an image`);
  }
  const heroRest = heroSection.blocks.slice(1);

  // Queue row Q36, PEL brief section 34: the families whose pages were retired into this
  // story. Their approved descriptions (content/treatment-descriptions.md, word for word)
  // render after "what-it-is", and each keeps a Service JSON-LD node.
  const families = getStoryFamilies(page.slug);
  // PEL brief section 38: a family's own image (lib/family-images.ts) shows on its card,
  // unless a story file already places that slot as an [image: ...] block, so no slot shows
  // twice on a page or twice across the stories.
  const slotsInStoryFiles = storySlotsInFiles();
  const familiesSection =
    families.length > 0 ? (
      <section data-section="treatments-in-this-group">
        <div className={CONTAINER}>
          <h2 className="reveal font-display text-3xl text-espresso md:text-4xl">Treatments in this group</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {families.map((family, index) => {
              const slot = FAMILY_IMAGE_SLOT[family.slug];
              const showImage = slot !== undefined && !slotsInStoryFiles.has(slot);
              // An odd last card spans both columns, so no half row is left empty.
              const wide = families.length % 2 === 1 && index === families.length - 1 && families.length > 1;
              return (
                <div
                  key={family.slug}
                  data-layout="family-card"
                  className={`reveal flex flex-col overflow-hidden rounded-2xl border border-beige bg-linen ${wide ? "lg:col-span-2" : ""} ${wide && showImage ? "lg:flex-row" : ""}`}
                >
                  {showImage ? (
                    <div className={`relative aspect-[4/3] w-full ${wide ? "lg:aspect-auto lg:min-h-[280px] lg:w-1/2" : ""}`}>
                      <Picture
                        slot={slot}
                        sizes="(min-width: 1024px) 540px, 100vw"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                  ) : null}
                  {/* A wide card with no image puts the title in a left column and the text in
                      a right column on lg, so the card is not half empty and no sentence is split
                      across columns (PEL brief section 41 note); the wording is unchanged. */}
                  <div
                    className={`p-6 md:p-8 ${wide && showImage ? "lg:w-1/2 lg:self-center" : ""} ${wide && !showImage ? "lg:grid lg:grid-cols-12 lg:gap-12" : ""}`}
                  >
                    <h3 className={`font-display text-2xl text-espresso ${wide && !showImage ? "lg:col-span-4" : ""}`}>{family.title}</h3>
                    <div
                      className={`mt-3 max-w-[65ch] space-y-3 text-cocoa ${wide && !showImage ? "lg:col-span-8 lg:mt-0" : ""}`}
                    >
                      {family.paragraphs.map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    ) : null;

  return (
    <main className="bg-cream">
      {families.map((family) => (
        <script
          key={family.slug}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(familyServiceJsonLd(family)) }}
        />
      ))}
      <section data-section="hero" className="mx-auto max-w-6xl px-4 pb-10 pt-8 md:px-6 lg:pb-16 lg:pt-12">
        {/* Mobile order: eyebrow and h1, image, intro and buttons. On lg the text sits
         * together in 7 columns, vertically centred beside the image in 5. */}
        <div
          data-layout="hero"
          className="grid gap-6 lg:grid-cols-12 lg:grid-rows-[1fr_auto_auto_1fr] lg:gap-x-12 lg:gap-y-0"
        >
          <div className="rise-in lg:col-span-7 lg:row-start-2">
            <Eyebrow>{storyShortTitle(page.frontMatter)}</Eyebrow>
            <h1 className="mt-3 font-display text-4xl leading-tight text-espresso md:text-5xl lg:text-6xl">
              {page.frontMatter.h1}
            </h1>
          </div>
          {/* On lg the arch follows the height of the text column, between 360 and 520 px. */}
          <div
            data-media
            className="relative lg:col-span-5 lg:col-start-8 lg:row-span-4 lg:row-start-1 lg:max-h-[520px] lg:min-h-[360px]"
          >
            <ArchImage
              slot={heroImageBlock.slot}
              priority
              sizes="(min-width: 1024px) 440px, 100vw"
              className="settle-in aspect-[4/3] max-h-[45vh] w-full lg:absolute lg:inset-0 lg:aspect-auto lg:h-full lg:max-h-none"
            />
          </div>
          <div className="rise-in rise-delay-1 max-w-[65ch] space-y-6 lg:col-span-7 lg:row-start-3 lg:mt-6 lg:text-lg">
            {heroRest.map((b, i) => renderBlock(b, i, { hidePrimaryOnMobile: true }))}
          </div>
        </div>
      </section>

      {otherSections.map((section) => {
        const onBand = BAND_SECTIONS.has(section.id);
        const first = section.groups[0];
        // The label goes inside the first group's text when that group has one beside an
        // image; otherwise it sits above the section.
        const labelInside = first !== undefined && (first.type === "split" || first.type === "feature");
        return (
          <Fragment key={section.id}>
            <section data-section={section.id} className={onBand ? "bg-sand" : undefined}>
              <div className={CONTAINER}>
                {section.eyebrow && !labelInside ? <Eyebrow className="reveal mb-6">{section.eyebrow}</Eyebrow> : null}
                <div className="space-y-8 lg:space-y-12">
                  {section.groups.map((group, i) =>
                    renderGroup(group, i, { eyebrow: i === 0 ? section.eyebrow : null, onBand }),
                  )}
                </div>
                {section.id === "prices" && page.pricesLink ? (
                  // Queue row Q36: straight after the story's prices, a way to the full price list
                  // for this category (lib/story-map.ts).
                  <div className="reveal mt-8">
                    <ReadMoreLink href={page.pricesLink.href} variant="pill">
                      {page.pricesLink.label}
                    </ReadMoreLink>
                  </div>
                ) : null}
              </div>
            </section>
            {section.id === "what-it-is" ? familiesSection : null}
          </Fragment>
        );
      })}

      {faqSection && (
        <section data-section="faq">
          <div className={CONTAINER}>
            <Eyebrow className="reveal">{SECTION_EYEBROWS.faq}</Eyebrow>
            <h2 className="reveal mt-3 font-display text-3xl text-espresso md:text-4xl">Frequently asked questions</h2>
            <div className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2">
              {faqSection.blocks.map((b, i) =>
                b.kind === "faq-item" ? <FaqItem key={i} question={b.question} answer={b.answer} /> : null,
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
