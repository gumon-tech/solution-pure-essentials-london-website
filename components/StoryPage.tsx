import Link from "next/link";
import ArchImage from "@/components/ArchImage";
import type { ImageSlot } from "@/lib/images";
import type { StoryBlock, StoryButton, StoryPage as StoryPageData, StoryPriceRow } from "@/lib/stories";

// Image-led renderer for the 8 storytelling landing pages (queue rows Q25/Q26).
// Every section is rendered the same generic way: an image slot is paired with the
// blocks that follow it (arch image beside its text, alternating sides on lg), a
// price table always breaks out to full width, and content with no image in front of
// it renders as plain stacked text. The hero and faq sections are the two exceptions
// called out in the brief.

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
  "inline-flex items-center justify-center rounded-full px-6 py-3 font-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

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

function PriceTable({ rows }: { rows: StoryPriceRow[] }) {
  return (
    <ul className="divide-y divide-beige">
      {rows.map((row) => (
        <li key={row.slug} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4">
          <div className="min-w-0">
            <p className="text-espresso">{row.name}</p>
            <p className="text-sm text-walnut">{row.duration}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="tabular whitespace-nowrap text-espresso">{row.price}</span>
            <a
              href={row.waHref}
              target="_blank"
              rel="noopener"
              className="inline-block whitespace-nowrap rounded-full border border-oak px-4 py-2 text-sm text-oak"
            >
              Ask on WhatsApp
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div>
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
      return <PriceTable key={key} rows={block.rows} />;
    case "faq-item":
      return <FaqItem key={key} question={block.question} answer={block.answer} />;
    case "image":
      return null;
  }
}

function ImageWithText({
  slot,
  reverse,
  children,
}: {
  slot: ImageSlot;
  reverse: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-2">
      <ArchImage
        slot={slot}
        sizes="(min-width: 1024px) 45vw, 100vw"
        className={`order-first w-full ${reverse ? "lg:order-2" : "lg:order-1"}`}
      />
      <div className={`space-y-4 ${reverse ? "lg:order-1" : "lg:order-2"}`}>{children}</div>
    </div>
  );
}

type Group =
  | { type: "plain"; blocks: StoryBlock[] }
  | { type: "table"; rows: StoryPriceRow[] }
  | { type: "image"; slot: ImageSlot; following: StoryBlock[] };

/** Groups a section's blocks so an image pairs with the text that follows it, up to
 * the next image or table -- a table always breaks out to its own full-width group,
 * even mid-run, since price rows need the whole page width. */
function groupBlocks(blocks: StoryBlock[]): Group[] {
  const groups: Group[] = [];
  let i = 0;
  while (i < blocks.length) {
    const block = blocks[i];
    if (block.kind === "image") {
      i++;
      const following: StoryBlock[] = [];
      while (i < blocks.length && blocks[i].kind !== "image" && blocks[i].kind !== "table") {
        following.push(blocks[i]);
        i++;
      }
      groups.push({ type: "image", slot: block.slot, following });
    } else if (block.kind === "table") {
      groups.push({ type: "table", rows: block.rows });
      i++;
    } else {
      const plain: StoryBlock[] = [];
      while (i < blocks.length && blocks[i].kind !== "image" && blocks[i].kind !== "table") {
        plain.push(blocks[i]);
        i++;
      }
      groups.push({ type: "plain", blocks: plain });
    }
  }
  return groups;
}

export default function StoryPage({ page }: { page: StoryPageData }) {
  const heroSection = page.sections.find((s) => s.id === "hero");
  const faqSection = page.sections.find((s) => s.id === "faq");
  if (!heroSection || !faqSection) {
    throw new Error(`${page.slug}: missing hero or faq section`);
  }
  const otherSections = page.sections.filter((s) => s.id !== "hero" && s.id !== "faq");

  const heroImageBlock = heroSection.blocks[0];
  if (!heroImageBlock || heroImageBlock.kind !== "image") {
    throw new Error(`${page.slug}: hero section must start with an image`);
  }
  const heroRest = heroSection.blocks.slice(1);

  let sideCounter = 0;

  return (
    <main className="bg-cream">
      <section className="mx-auto max-w-6xl px-4 pb-6 pt-10 md:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
          <ArchImage
            slot={heroImageBlock.slot}
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="order-first max-h-[45vh] w-full lg:order-none lg:max-h-none"
          />
          <h1 className="font-display text-4xl text-espresso md:text-5xl">{page.frontMatter.h1}</h1>
        </div>
        <div className="mt-8 max-w-3xl space-y-6">{heroRest.map((b, i) => renderBlock(b, i, { hidePrimaryOnMobile: true }))}</div>
      </section>

      {otherSections.map((section) => (
        <section key={section.id} className="mx-auto max-w-6xl px-4 py-8 md:px-6">
          <div className="space-y-10">
            {groupBlocks(section.blocks).map((group, i) => {
              if (group.type === "table") {
                return <PriceTable key={i} rows={group.rows} />;
              }
              if (group.type === "plain") {
                return (
                  <div key={i} className="max-w-3xl space-y-4">
                    {group.blocks.map((b, j) => renderBlock(b, j))}
                  </div>
                );
              }
              const reverse = sideCounter % 2 === 1;
              sideCounter++;
              return (
                <ImageWithText key={i} slot={group.slot} reverse={reverse}>
                  {group.following.map((b, j) => renderBlock(b, j))}
                </ImageWithText>
              );
            })}
          </div>
        </section>
      ))}

      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <h2 className="font-display text-2xl text-espresso">Frequently asked questions</h2>
        <div className="mt-6 max-w-3xl space-y-6">
          {faqSection.blocks.map((b, i) =>
            b.kind === "faq-item" ? <FaqItem key={i} question={b.question} answer={b.answer} /> : null,
          )}
        </div>
      </section>
    </main>
  );
}
