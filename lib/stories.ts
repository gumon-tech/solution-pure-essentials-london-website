// Build-time parser for the storytelling landing pages (queue rows Q25/Q26).
//
// Reads the 8 PEL-approved copy files in content/stories/*.md straight off disk (no
// caching between requests matters here: this only ever runs at `next build` time,
// for a fully static export) and turns each into a StoryPage: front matter plus an
// ordered list of sections, each holding an ordered list of blocks.
//
// The parser is deliberately strict: content/stories/*.md is approved copy (read-only
// for this row -- see the executor brief), so any line it does not recognise is a
// build error, not a best-effort guess. That is what lets StoryPage.tsx render every
// file the same way without a single per-file special case.
import fs from "node:fs";
import path from "node:path";
import { IMAGES, type ImageSlot } from "@/lib/images";
import { waLink, liveServices, type Service } from "@/lib/services";
import { SITE, waSite } from "@/lib/site";
import { categoryAnchor, priceCategoryForStory, topicInSentence } from "@/lib/story-map";

export interface StoryFrontMatter {
  title: string;
  description: string;
  h1: string;
  /** Optional short title for menus and link labels (queue row Q36), e.g. "HIFU". */
  short?: string;
}

export interface StoryPriceRow {
  /** The "Treatment" column, exactly as written in the markdown. */
  name: string;
  /** The "Duration" column, exactly as written (e.g. "1 hr 45 min", "ask"). */
  duration: string;
  /** The "Price" column, converted to the site's £ style (e.g. "£450", "From £350"); "Ask for
   * a quote" passes through unchanged. See formatPrice() below. */
  price: string;
  /** The "Source slug" column -- data/services.json's slug for this row. Not rendered. */
  slug: string;
  waHref: string;
}

export interface StoryButton {
  label: string;
  href: string;
  /** True for a link that must open in a new tab (WhatsApp, Treatwell); false for an
   * in-site Next Link (e.g. to /treatments/). */
  external: boolean;
}

export type StoryBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "image"; slot: ImageSlot }
  | { kind: "numbered-list"; items: { lead: string; rest: string }[] }
  | { kind: "bullet-list"; items: string[] }
  | { kind: "buttons"; primary: StoryButton; secondary: StoryButton }
  | { kind: "table"; rows: StoryPriceRow[] }
  | { kind: "info-table"; rows: string[][] }
  | { kind: "faq-item"; question: string; answer: string };

export interface StorySection {
  /** "hero", "faq", "call-to-action" (specially recognised), or any other section
   * name. For the 8 STORY_SLUGS pages this is always a member of SECTION_ORDER, in
   * that exact order; for the set-3 STORY_SET3_SLUGS pages it is file order, with the
   * one constraint that section 0 is "hero" (see parseStoryFileFlexible). */
  id: string;
  blocks: StoryBlock[];
}

export interface StoryPage {
  slug: string;
  frontMatter: StoryFrontMatter;
  sections: StorySection[];
  /** "See <topic> prices" link to /treatments/#<category>, shown after the prices section;
   * null for a story with no category in lib/story-map.ts (queue row Q36). */
  pricesLink: { href: string; label: string } | null;
}

const SECTION_ORDER = [
  "hero",
  "what-it-is",
  "who-it-may-suit",
  "your-visit",
  "prices",
  "aftercare",
  "faq",
  "call-to-action",
] as const;

const TREATMENTS_HREF = "/treatments/";

/** Where a story's in-site "See treatments and prices" button goes: its own category on
 * /treatments/ when lib/story-map.ts maps one (queue row Q36), otherwise /treatments/. */
function treatmentsHrefFor(slug: string): string {
  const category = priceCategoryForStory(slug);
  return category ? `${TREATMENTS_HREF}#${categoryAnchor(category)}` : TREATMENTS_HREF;
}

function storyRef(slug: string): string {
  return `STORY-${slug.toUpperCase().replace(/-/g, "_")}`;
}

function withThousandsSeparators(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** Converts a price cell's literal markdown text to the site's £ style: "GBP 450" ->
 * "£450", "from GBP 350" -> "From £350" (thousands separators added, e.g. "GBP 1300"
 * -> "£1,300"). "Ask for a quote" passes through unchanged. Throws on anything else. */
function formatPrice(raw: string, slug: string): string {
  if (raw === "Ask for a quote") return raw;
  const fromMatch = /^from GBP (\d+)$/.exec(raw);
  if (fromMatch) {
    return `From £${withThousandsSeparators(fromMatch[1])}`;
  }
  const plainMatch = /^GBP (\d+)$/.exec(raw);
  if (plainMatch) {
    return `£${withThousandsSeparators(plainMatch[1])}`;
  }
  throw new Error(`${slug}: price cell not recognised: ${JSON.stringify(raw)}`);
}

// --- front matter ----------------------------------------------------------------

function parseFrontMatter(raw: string, slug: string): { frontMatter: StoryFrontMatter; rest: string } {
  const lines = raw.split("\n");
  if (lines[0]?.trim() !== "---") {
    throw new Error(`${slug}: expected front matter to open with "---"`);
  }
  const fields: Record<string, string> = {};
  let i = 1;
  while (i < lines.length && lines[i].trim() !== "---") {
    const line = lines[i];
    const m = /^(\w+):\s*"(.*)"$/.exec(line);
    if (!m) {
      throw new Error(`${slug}: front matter line not recognised: ${JSON.stringify(line)}`);
    }
    fields[m[1]] = m[2];
    i++;
  }
  if (lines[i]?.trim() !== "---") {
    throw new Error(`${slug}: front matter never closed with "---"`);
  }
  i++;
  for (const key of ["title", "description", "h1"]) {
    if (!(key in fields)) {
      throw new Error(`${slug}: front matter missing "${key}"`);
    }
  }
  for (const key of Object.keys(fields)) {
    if (!["title", "description", "h1", "short"].includes(key)) {
      throw new Error(`${slug}: front matter key "${key}" not recognised`);
    }
  }
  return {
    frontMatter: {
      title: fields.title,
      description: fields.description,
      h1: fields.h1,
      ...(fields.short ? { short: fields.short } : {}),
    },
    rest: lines.slice(i).join("\n"),
  };
}

// --- section splitting -------------------------------------------------------------

/** Splits a story file's body into ordered (id, lines) sections, in file order.
 * Shared by both the 8-section strict grammar (STORY_SLUGS) and the flexible one
 * (STORY_SET3_SLUGS) -- section-order validation is layered on top by the caller. */
function splitSectionsRaw(body: string, slug: string): { id: string; lines: string[] }[] {
  const lines = body.split("\n");
  const sections: { id: string; lines: string[] }[] = [];
  const seen = new Set<string>();
  let current: string | null = null;
  let buf: string[] = [];

  for (const line of lines) {
    const heading = /^## (.+)$/.exec(line);
    if (heading) {
      if (current) sections.push({ id: current, lines: buf });
      current = heading[1].trim();
      if (seen.has(current)) {
        throw new Error(`${slug}: duplicate section heading ${JSON.stringify(current)}`);
      }
      seen.add(current);
      buf = [];
      continue;
    }
    if (current) {
      buf.push(line);
    } else if (line.trim() !== "") {
      throw new Error(`${slug}: content before the first "## " section header: ${JSON.stringify(line)}`);
    }
  }
  if (current) sections.push({ id: current, lines: buf });
  return sections;
}

function splitSections(body: string, slug: string): Map<string, string[]> {
  const raw = splitSectionsRaw(body, slug);
  const ids = raw.map((s) => s.id);
  const expected = [...SECTION_ORDER];
  const matches = ids.length === expected.length && expected.every((id, idx) => ids[idx] === id);
  if (!matches) {
    throw new Error(
      `${slug}: sections must be exactly ${expected.join(", ")} in that order; found ${ids.join(", ")}`,
    );
  }
  return new Map(raw.map((s) => [s.id, s.lines]));
}

/** Set-3 section-order rule (executor brief, queue row Q27): the first section must
 * be "hero"; faq and call-to-action are optional; any other section ids are allowed,
 * in file order. Unlike the strict grammar there is no fixed id list to check against. */
function splitSectionsFlexible(body: string, slug: string): { id: string; lines: string[] }[] {
  const raw = splitSectionsRaw(body, slug);
  if (raw.length === 0 || raw[0].id !== "hero") {
    throw new Error(`${slug}: first section must be "hero", found ${raw[0] ? JSON.stringify(raw[0].id) : "no sections"}`);
  }
  return raw;
}

// --- table parsing -----------------------------------------------------------------

function splitTableRow(line: string): string[] {
  const trimmed = line.trim();
  const inner = trimmed.replace(/^\|/, "").replace(/\|$/, "");
  return inner.split("|").map((cell) => cell.trim());
}

function isSeparatorRow(cells: string[]): boolean {
  return cells.length > 0 && cells.every((c) => /^:?-+:?$/.test(c));
}

function parseTable(tableLines: string[], slug: string, servicesBySlug: Map<string, Service>): StoryPriceRow[] {
  if (tableLines.length < 2) {
    throw new Error(`${slug}: table has no header/separator row: ${JSON.stringify(tableLines)}`);
  }
  const header = splitTableRow(tableLines[0]);
  const sep = splitTableRow(tableLines[1]);
  if (header.length !== 4) {
    throw new Error(`${slug}: table header must have 4 columns, got ${header.length}: ${JSON.stringify(header)}`);
  }
  if (header[3] !== "Source slug") {
    throw new Error(`${slug}: table's 4th column must be "Source slug", got ${JSON.stringify(header[3])}`);
  }
  if (!isSeparatorRow(sep) || sep.length !== 4) {
    throw new Error(`${slug}: table separator row malformed: ${JSON.stringify(tableLines[1])}`);
  }

  return tableLines.slice(2).map((line) => {
    const cells = splitTableRow(line);
    if (cells.length !== 4) {
      throw new Error(`${slug}: table row must have 4 columns, got ${cells.length}: ${JSON.stringify(line)}`);
    }
    const [name, duration, price, rowSlug] = cells;
    const service = servicesBySlug.get(rowSlug);
    if (!service) {
      throw new Error(`${slug}: table row slug ${JSON.stringify(rowSlug)} is not a live row in data/services.json`);
    }
    const waName = service.display_name ?? service.name;
    return {
      name,
      duration,
      price: formatPrice(price, slug),
      slug: rowSlug,
      waHref: waLink(waName, rowSlug),
    };
  });
}

/** A table whose header's last column is not "Source slug" is a plain info table (set
 * 3, e.g. "Day | Hours"): every cell renders verbatim, no price/£ formatting, no
 * WhatsApp link. See isPriceTableHeader() at the call site for the branch decision. */
function parseInfoTableRows(tableLines: string[], slug: string): string[][] {
  if (tableLines.length < 2) {
    throw new Error(`${slug}: table has no header/separator row: ${JSON.stringify(tableLines)}`);
  }
  const header = splitTableRow(tableLines[0]);
  const sep = splitTableRow(tableLines[1]);
  if (!isSeparatorRow(sep) || sep.length !== header.length) {
    throw new Error(`${slug}: info table separator row malformed: ${JSON.stringify(tableLines[1])}`);
  }
  return tableLines.slice(2).map((line) => {
    const cells = splitTableRow(line);
    if (cells.length !== header.length) {
      throw new Error(
        `${slug}: info table row must have ${header.length} columns, got ${cells.length}: ${JSON.stringify(line)}`,
      );
    }
    return cells;
  });
}

/** A table is a price table iff its header's 4th column is literally "Source slug"
 * (the same test parseTable() itself enforces) -- anything else is an info table. */
function isPriceTableHeader(tableLines: string[]): boolean {
  const header = splitTableRow(tableLines[0]);
  return header.length === 4 && header[3] === "Source slug";
}

// --- block parsing -----------------------------------------------------------------

function parseBlocks(
  lines: string[],
  sectionId: string,
  slug: string,
  servicesBySlug: Map<string, Service>,
): StoryBlock[] {
  const blocks: StoryBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    if (lines[i].trim() === "") {
      i++;
      continue;
    }

    if (sectionId === "faq") {
      const question = /^\*\*(.+)\*\*$/.exec(lines[i]);
      if (!question) {
        throw new Error(`${slug} [faq]: expected a bold question line, got ${JSON.stringify(lines[i])}`);
      }
      i++;
      const answerLines: string[] = [];
      while (i < lines.length && lines[i].trim() !== "" && !/^\*\*(.+)\*\*$/.test(lines[i])) {
        answerLines.push(lines[i].trim());
        i++;
      }
      if (answerLines.length === 0) {
        throw new Error(`${slug} [faq]: question ${JSON.stringify(question[1])} has no answer line`);
      }
      blocks.push({ kind: "faq-item", question: question[1], answer: answerLines.join(" ") });
      continue;
    }

    const imgMatch = /^\[image: ([a-z0-9-]+)\]$/.exec(lines[i]);
    if (imgMatch) {
      const slotName = imgMatch[1];
      if (!(slotName in IMAGES)) {
        throw new Error(`${slug}: image slot ${JSON.stringify(slotName)} is not a key of IMAGES in lib/images.ts`);
      }
      blocks.push({ kind: "image", slot: slotName as ImageSlot });
      i++;
      continue;
    }

    if (lines[i].startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      if (isPriceTableHeader(tableLines)) {
        blocks.push({ kind: "table", rows: parseTable(tableLines, slug, servicesBySlug) });
      } else {
        blocks.push({ kind: "info-table", rows: parseInfoTableRows(tableLines, slug) });
      }
      continue;
    }

    if (/^\d+\.\s/.test(lines[i])) {
      const items: { lead: string; rest: string }[] = [];
      let n = 1;
      while (i < lines.length && new RegExp(`^${n}\\.\\s`).test(lines[i])) {
        const m = new RegExp(`^${n}\\.\\s+\\*\\*([^*]+)\\*\\*\\s*(.*)$`).exec(lines[i]);
        if (!m) {
          throw new Error(`${slug}: numbered list item ${n} missing a **bold** lead-in: ${JSON.stringify(lines[i])}`);
        }
        items.push({ lead: m[1], rest: m[2].trim() });
        i++;
        n++;
      }
      if (items.length !== 3) {
        throw new Error(`${slug}: numbered list must have exactly 3 items, found ${items.length}`);
      }
      blocks.push({ kind: "numbered-list", items });
      continue;
    }

    if (lines[i].startsWith("- ")) {
      const bulletLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        bulletLines.push(lines[i]);
        i++;
      }
      const buttonMatches = bulletLines.map((l) => /^- Button \((primary|secondary)\): (.+)$/.exec(l));
      if (buttonMatches.every((m) => m !== null)) {
        const primaryMatch = buttonMatches.find((m) => m![1] === "primary");
        const secondaryMatch = buttonMatches.find((m) => m![1] === "secondary");
        if (!primaryMatch || !secondaryMatch || bulletLines.length !== 2) {
          throw new Error(
            `${slug}: expected exactly one primary and one secondary button line, got ${JSON.stringify(bulletLines)}`,
          );
        }
        const secondaryLabel = secondaryMatch[2];
        const secondaryIsTreatwell = secondaryLabel.includes("Treatwell");
        blocks.push({
          kind: "buttons",
          primary: { label: primaryMatch[2], href: waSite(storyRef(slug)), external: true },
          secondary: {
            label: secondaryLabel,
            href: secondaryIsTreatwell ? SITE.treatwell : treatmentsHrefFor(slug),
            external: secondaryIsTreatwell,
          },
        });
      } else {
        blocks.push({ kind: "bullet-list", items: bulletLines.map((l) => l.slice(2).trim()) });
      }
      continue;
    }

    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^\[image: /.test(lines[i]) &&
      !lines[i].startsWith("|") &&
      !/^\d+\.\s/.test(lines[i]) &&
      !lines[i].startsWith("- ")
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    if (paraLines.length === 0) {
      throw new Error(`${slug}: line not recognised: ${JSON.stringify(lines[i])}`);
    }
    blocks.push({ kind: "paragraph", text: paraLines.join(" ") });
  }

  return blocks;
}

// --- whole-file parse ---------------------------------------------------------------

function parseStoryFile(filePath: string, slug: string, servicesBySlug: Map<string, Service>): StoryPage {
  const raw = fs.readFileSync(filePath, "utf8");
  const { frontMatter, rest } = parseFrontMatter(raw, slug);
  const sectionLines = splitSections(rest, slug);

  const sections: StorySection[] = SECTION_ORDER.map((id) => ({
    id,
    blocks: parseBlocks(sectionLines.get(id) ?? [], id, slug, servicesBySlug),
  }));

  return { slug, frontMatter, sections, pricesLink: pricesLinkFor(slug, frontMatter) };
}

/** The short title used in menus and link labels: front matter `short`, otherwise the h1
 * without its " in King's Cross" ending. */
export function storyShortTitle(frontMatter: StoryFrontMatter): string {
  return frontMatter.short ?? frontMatter.h1.replace(/ in King's Cross$/, "");
}

function pricesLinkFor(slug: string, frontMatter: StoryFrontMatter): StoryPage["pricesLink"] {
  const category = priceCategoryForStory(slug);
  if (!category) return null;
  return {
    href: `${TREATMENTS_HREF}#${categoryAnchor(category)}`,
    label: `See ${topicInSentence(storyShortTitle(frontMatter))} prices`,
  };
}

/** Real room photos (see docs/design/imagery-guideline.md §1, §4): never people, so
 * never a valid hero image on their own. Also the set the room-photo sentence check
 * in scripts/check-story-pages.mjs enforces against, independently, off the .md. */
const ROOM_IMAGE_SLOTS = new Set<ImageSlot>(["room-warm", "room-trolley", "room-analyser", "room-couch"]);

/** Set-3 (queue row Q27): a flexible grammar for pages whose sections don't follow
 * the 8-page SECTION_ORDER. Only "hero" is fixed (must be first, and its image must
 * be a people image, not a room photo); every other section id is accepted, in file
 * order, and faq / call-to-action are optional. Table shape (parseBlocks) and faq
 * bold-Q/A parsing are identical to the strict grammar -- only section-order
 * validation differs. */
function parseStoryFileFlexible(filePath: string, slug: string, servicesBySlug: Map<string, Service>): StoryPage {
  const raw = fs.readFileSync(filePath, "utf8");
  const { frontMatter, rest } = parseFrontMatter(raw, slug);
  const rawSections = splitSectionsFlexible(rest, slug);

  const sections: StorySection[] = rawSections.map(({ id, lines }) => ({
    id,
    blocks: parseBlocks(lines, id, slug, servicesBySlug),
  }));

  const heroFirst = sections[0].blocks[0];
  if (!heroFirst || heroFirst.kind !== "image") {
    throw new Error(`${slug}: hero section must start with an [image: ...] block`);
  }
  if (ROOM_IMAGE_SLOTS.has(heroFirst.slot)) {
    throw new Error(`${slug}: hero section must start with a people image, found room slot ${JSON.stringify(heroFirst.slot)}`);
  }

  return { slug, frontMatter, sections, pricesLink: pricesLinkFor(slug, frontMatter) };
}

// The 8 storytelling pages built by queue rows Q25/Q26, in their strict 8-section
// grammar (SECTION_ORDER).
const STORY_SLUGS = [
  "hifu-kings-cross",
  "laser-hair-removal-kings-cross",
  "facials-kings-cross",
  "body-contouring-kings-cross",
  "massage-kings-cross",
  "waxing-kings-cross",
  "microneedling-peels-kings-cross",
  "skin-boosters-kings-cross",
] as const;

// The 3 "set 3" storytelling pages built by queue row Q27, in the flexible grammar
// (parseStoryFileFlexible / splitSectionsFlexible). content/stories/ held these 3
// files as other executors' in-progress drafts before this row landed (see HANDOFF/
// queue history) -- both lists stay explicit rather than a glob of every "*.md" in
// the directory, so a future draft landing on main can't silently join either family.
const STORY_SET3_SLUGS = ["our-clinic-kings-cross", "your-visit", "first-visit-guide"] as const;

let cache: StoryPage[] | null = null;

function loadAll(): StoryPage[] {
  if (cache) return cache;
  const dir = path.join(process.cwd(), "content/stories");
  const servicesBySlug = new Map(liveServices().map((s) => [s.slug, s]));
  const strict = STORY_SLUGS.map((slug) => parseStoryFile(path.join(dir, `${slug}.md`), slug, servicesBySlug));
  const flexible = STORY_SET3_SLUGS.map((slug) =>
    parseStoryFileFlexible(path.join(dir, `${slug}.md`), slug, servicesBySlug),
  );
  cache = [...strict, ...flexible];
  return cache;
}

export function getStorySlugs(): string[] {
  return loadAll().map((p) => p.slug);
}

export function getStoryPages(): StoryPage[] {
  return loadAll();
}

export function getStoryPage(slug: string): StoryPage | undefined {
  return loadAll().find((p) => p.slug === slug);
}

/** The hero section's image slot: always its first block, used for openGraph. */
export function getHeroSlot(page: StoryPage): ImageSlot {
  const hero = page.sections.find((s) => s.id === "hero");
  const first = hero?.blocks[0];
  if (!first || first.kind !== "image") {
    throw new Error(`${page.slug}: hero section must start with an [image: ...] block`);
  }
  return first.slot;
}
