// Section layout for the storytelling pages (queue row Q41). The markdown grammar is
// unchanged (lib/stories.ts); this helper only decides how a section's blocks are laid
// out, from their content, so every story gets the same treatment without per-file
// special cases:
//
//   split     an image followed by long text (250 characters or more, or 2+ blocks
//             including a list or table): image 5 of 12 columns, text 7, sides alternating
//   feature   an image followed by short text: a horizontal card, image 4 columns, text 8
//   cards     2 to 4 consecutive short image and text pairs: a row of equal cards
//   band      images with no text between them: an equal row of photos
//   banner    an image followed only by a short heading-like line (a single paragraph of
//             40 characters or fewer with no closing full stop): a wide low photo with the
//             line below it, so a sub-heading never sits alone beside a tall image
//   text      text with no image, capped at about 65 characters wide
//   prices    a price table, in its own card
//   info      an info table with no image in front of it
//
// Nothing here changes, drops or shortens any block: every block of the section lands in
// exactly 1 group, in file order.
import type { ImageSlot } from "@/lib/images";
import type { StoryBlock, StoryPriceRow, StorySection } from "@/lib/stories";

/** Text under this many characters beside an image counts as short. */
export const SHORT_TEXT_LIMIT = 250;

export interface StoryPair {
  slot: ImageSlot;
  blocks: StoryBlock[];
}

export type LayoutGroup =
  | { type: "text"; blocks: StoryBlock[] }
  | { type: "prices"; rows: StoryPriceRow[] }
  | { type: "info"; rows: string[][] }
  | { type: "split"; pair: StoryPair; reverse: boolean }
  | { type: "feature"; pair: StoryPair }
  | { type: "cards"; pairs: StoryPair[] }
  | { type: "band"; slots: ImageSlot[] }
  | { type: "banner"; pair: StoryPair };

export interface LaidOutSection {
  id: string;
  /** Small uppercase label above the section, or null (PEL41, content/COPY-SOURCES.md). */
  eyebrow: string | null;
  groups: LayoutGroup[];
}

/** Section eyebrow labels, by section id (approved by PEL, brief section 41). A section id
 * not listed here gets no label. */
export const SECTION_EYEBROWS: Record<string, string> = {
  "what-it-is": "What it is",
  "who-it-may-suit": "Who it may suit",
  "your-visit": "Your visit",
  prices: "Prices",
  aftercare: "Aftercare",
  faq: "Questions",
  "how-it-works": "How it works",
  "the-rooms": "The rooms",
  "where-it-is": "Where it is",
  treatments: "Treatments",
  "message-us": "Message us",
  "finding-the-clinic": "Finding the clinic",
  arriving: "Arriving",
  "the-consultation": "The consultation",
  "your-treatment": "Your treatment",
  "what-to-message": "What to message",
  "what-to-expect": "What to expect",
  hours: "Hours",
};

type RawGroup =
  | { type: "text"; blocks: StoryBlock[] }
  | { type: "prices"; rows: StoryPriceRow[] }
  | { type: "info"; rows: string[][] }
  | { type: "pair"; pair: StoryPair };

/** Text under this many characters in a feature card gets the compact card. */
export const COMPACT_TEXT_LIMIT = 120;

/** True for a pair whose only text is a short heading-like line. */
export function isHeadingLine(blocks: StoryBlock[]): boolean {
  if (blocks.length !== 1) return false;
  const b = blocks[0];
  return b.kind === "paragraph" && b.text.length <= 40 && !/[.!?]$/.test(b.text.trim());
}

/** Characters of readable text in a run of blocks (buttons are not counted). */
export function textLength(blocks: StoryBlock[]): number {
  let n = 0;
  for (const b of blocks) {
    switch (b.kind) {
      case "paragraph":
        n += b.text.length;
        break;
      case "numbered-list":
        for (const item of b.items) n += item.lead.length + 1 + item.rest.length;
        break;
      case "bullet-list":
        for (const item of b.items) n += item.length;
        break;
      case "info-table":
        for (const row of b.rows) n += row.join(" ").length;
        break;
      case "faq-item":
        n += b.question.length + b.answer.length;
        break;
      default:
        break;
    }
  }
  return n;
}

function isLong(blocks: StoryBlock[]): boolean {
  if (textLength(blocks) >= SHORT_TEXT_LIMIT) return true;
  const structured = blocks.some(
    (b) => b.kind === "numbered-list" || b.kind === "bullet-list" || b.kind === "info-table",
  );
  return blocks.length >= 2 && structured;
}

/** An image pairs with every block that follows it up to the next image or price table.
 * A price table always stands alone; an info table stands alone only when no image is in
 * front of it. */
function rawGroups(blocks: StoryBlock[]): RawGroup[] {
  const groups: RawGroup[] = [];
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
      groups.push({ type: "pair", pair: { slot: block.slot, blocks: following } });
    } else if (block.kind === "table") {
      groups.push({ type: "prices", rows: block.rows });
      i++;
    } else if (block.kind === "info-table") {
      groups.push({ type: "info", rows: block.rows });
      i++;
    } else {
      const plain: StoryBlock[] = [];
      while (
        i < blocks.length &&
        blocks[i].kind !== "image" &&
        blocks[i].kind !== "table" &&
        blocks[i].kind !== "info-table"
      ) {
        plain.push(blocks[i]);
        i++;
      }
      groups.push({ type: "text", blocks: plain });
    }
  }
  return groups;
}

/** Splits a run of short pairs into rows of at most 4, never leaving a row of 1 when it
 * can be avoided. */
function chunkPairs(pairs: StoryPair[]): StoryPair[][] {
  if (pairs.length <= 4) return [pairs];
  const rows: StoryPair[][] = [];
  let rest = pairs;
  while (rest.length > 4) {
    rows.push(rest.slice(0, 3));
    rest = rest.slice(3);
  }
  rows.push(rest);
  return rows;
}

/** Lays out every section after the hero. `split` sides alternate across the whole page. */
export function layoutStorySections(sections: StorySection[]): LaidOutSection[] {
  let splitCount = 0;
  return sections.map((section) => {
    const raw = rawGroups(section.blocks);
    const groups: LayoutGroup[] = [];
    let i = 0;
    while (i < raw.length) {
      const g = raw[i];
      if (g.type !== "pair") {
        groups.push(g);
        i++;
        continue;
      }
      if (g.pair.blocks.length === 0) {
        const slots: ImageSlot[] = [];
        while (i < raw.length) {
          const next = raw[i];
          if (next.type !== "pair" || next.pair.blocks.length !== 0) break;
          slots.push(next.pair.slot);
          i++;
        }
        groups.push({ type: "band", slots });
        continue;
      }
      if (isHeadingLine(g.pair.blocks)) {
        groups.push({ type: "banner", pair: g.pair });
        i++;
        continue;
      }
      if (isLong(g.pair.blocks)) {
        groups.push({ type: "split", pair: g.pair, reverse: splitCount % 2 === 1 });
        splitCount++;
        i++;
        continue;
      }
      const shorts: StoryPair[] = [];
      while (i < raw.length) {
        const next = raw[i];
        if (
          next.type !== "pair" ||
          next.pair.blocks.length === 0 ||
          isLong(next.pair.blocks) ||
          isHeadingLine(next.pair.blocks)
        )
          break;
        shorts.push(next.pair);
        i++;
      }
      for (const row of chunkPairs(shorts)) {
        groups.push(row.length === 1 ? { type: "feature", pair: row[0] } : { type: "cards", pairs: row });
      }
    }
    return { id: section.id, eyebrow: SECTION_EYEBROWS[section.id] ?? null, groups };
  });
}
